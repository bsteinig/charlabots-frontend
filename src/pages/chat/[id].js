import {
  Button,
  Container,
  Group,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
  createStyles,
} from "@mantine/core";
import { IconHome2 } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getBlocks } from "@/lib/createBlocks";
import { createCanonicalArray } from "@/lib/parseCanonical";
import { chat, splitOnNewline } from "@/lib/handleInputs";
import { useForm } from "@mantine/form";
import { useListState } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  root: {
    minHeight: "100vh",
    backgroundColor: "#b1c8e9",
  },
  chatWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  chatBox: {
    backgroundColor: "#ebebeb",
    width: "800px",
    height: "80vh",
    borderRadius: theme.radius.md,
  },
}));

function Chat() {
  const { classes } = useStyles();

  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState({});
  const [blocks, setBlocks] = useState([]);
  const [interpreted, setInterpreted] = useState({});

  const [messages, handlers] = useListState([]);

  const form = useForm({
    initialValues: {
      message: "",
    },

    validate: {
      message: (value) =>
        value.length === 0 ? "Message cannot be empty" : null,
    },
  });

  useEffect(() => {
    if (id) {
      console.log("Chat:", id);
      let url = "http://localhost:8000/getBotData/?botid=" + id;
      fetch(url, {})
        .then((response) => response.json())
        .then((res) => {
          if (res.data) {
            setData(res.data);
            setBlocks(getBlocks(res.data.canonical));
            setInterpreted(createCanonicalArray(blocks));
          }
        });
    }
  }, [id]);

  const handleChat = (message) => {
    form.reset();
    const user_msg = {
      message: message,
      side: "right",
    };
    handlers.append(user_msg);
    setTimeout(() => {
      let response = "";
      for (let i = 0; i < interpreted.length; i++) {
        response = "";
        response = splitOnNewline(chat(interpreted[i], message));
        if (response !== "") {
          break;
        }
      }
      console.log("Response:", response);
      const response_msg = {
        message: response,
        side: "left",
      };
      handlers.append(response_msg);
    }, 250);
  };

  return (
    <>
      <Head>
        <title>Chat With A Bot</title>
        <meta name="description" content="CharlaBots Chat with A Bot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={classes.root}>
        <Group p={20} position="apart">
          <Button
            leftIcon={<IconHome2 size="1.2rem" />}
            onClick={() => router.push("/")}
          >
            Home
          </Button>
          <Title order={2} align="center">
            {data ? `Let's Chat with ${data.botname}!` : "Loading"}
          </Title>
          <Space />
        </Group>
        <Container size="xl" className={classes.chatWrapper}>
          <Stack className={classes.chatBox}>
            {messages.map((message, index) => {
              return <Text key={index}>{message.message}</Text>;
            })}
          </Stack>
          <form
            onSubmit={form.onSubmit((values) => handleChat(values.message))}
          >
            <Group>
              <TextInput
                placeholder="Enter your message"
                {...form.getInputProps("message")}
              />
              <Button type="submit">Send</Button>
            </Group>
          </form>
        </Container>
      </main>
    </>
  );
}

export default Chat;
