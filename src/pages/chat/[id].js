import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  ScrollArea,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
  createStyles,
  keyframes,
} from "@mantine/core";
import { IconHome2 } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { getBlocks } from "@/lib/createBlocks";
import { createCanonicalArray } from "@/lib/parseCanonical";
import { chat, splitOnNewline } from "@/lib/handleInputs";
import { useForm } from "@mantine/form";
import { useListState } from "@mantine/hooks";

const fadeIn = keyframes({
  "0%": { opacity: 0, transform: "translate3d(0, 50%, 0)" },
  "100%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
});

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
    height: "100%",
  },
  chatBox: {
    backgroundColor: "#ebebeb",
    width: "max(80%,300px)",
    height: "80vh",
    borderRadius: `${theme.radius.md} ${theme.radius.md} 0 0`,
    padding: theme.spacing.md,
    overflowY: "auto",
  },
  inputBar: {
    backgroundColor: "#ebebeb",
    borderRadius: `0 0 ${theme.radius.md} ${theme.radius.md}`,
    width: "max(80%,300px)",
  },
  input: {
    flexGrow: 1,
  },
  message: {
    backgroundColor: "#fff",
    width: "fit-content",
    maxWidth: "80%",
    padding: `8px ${theme.spacing.sm}`,
    borderRadius: theme.radius.md,
    animation: `${fadeIn} 0.3s ease-in-out forwards`,
  },
  left: {
    margin: `${theme.spacing.sm} 0`,
    display: "flex",
    flexDirection: "row",
  },
  right: {
    margin: `${theme.spacing.sm} 0`,
    display: "flex",
    flexDirection: "row-reverse",
  },
  colorMessage: {
    backgroundColor: theme.colors.blue[2],
  },
}));

function Chat() {
  const { classes, cx } = useStyles();

  const router = useRouter();
  const { id } = router.query;

  const [loaded, setLoaded] = useState(false);
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
            console.log("Chat:", res.data);
            setData(res.data);
            const blockData = getBlocks(res.data.canonical);
            setBlocks(blockData);
            const canonicalArray = createCanonicalArray(blockData);
            setInterpreted(canonicalArray);
            setLoaded(true);
          }
        });
    }
  }, [router.isReady]);

  const chatWindow = useRef(null);
  const scrollToBottom = () =>
    chatWindow.current.scrollTo({
      top: chatWindow.current.scrollHeight,
      behavior: "smooth",
    });

  const handleChat = (message) => {
    console.log("Message:", interpreted);
    form.reset();
    const user_msg = {
      message: message,
      side: "right",
    };
    handlers.append(user_msg);
    scrollToBottom();
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
      setTimeout(() => {
        scrollToBottom();
      }, 50);
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
        <Group p={20} position="center">
          <Button
            style={{ position: "absolute", left: "3%" }}
            leftIcon={<IconHome2 size="1.2rem" />}
            onClick={() => router.push("/")}
          >
            Home
          </Button>
          <Title order={2} align="center">
            {data ? `Let's Chat with ${data.botname}!` : "Loading"}
          </Title>
        </Group>
        {loaded ? (
          <Container size="xl" className={classes.chatWrapper}>
            <ScrollArea className={classes.chatBox} viewportRef={chatWindow}>
              {messages.map((message, index) => {
                return (
                  <div
                    key={index}
                    className={cx({
                      [classes.left]: message.side === "left",
                      [classes.right]: message.side === "right",
                    })}
                  >
                    <Text
                      className={cx(classes.message, {
                        [classes.colorMessage]: message.side === "right",
                      })}
                    >
                      {message.message}
                    </Text>
                  </div>
                );
              })}
            </ScrollArea>
            <form
              onSubmit={form.onSubmit((values) => handleChat(values.message))}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Group className={classes.inputBar}>
                <TextInput
                  className={classes.input}
                  size="lg"
                  placeholder="Enter your message"
                  {...form.getInputProps("message")}
                />
                <Button size="lg" color="green" type="submit">
                  Send
                </Button>
              </Group>
            </form>
          </Container>
        ) : (
          <Center style={{ height: "80vh" }}>
            <Loader size={150} />
          </Center>
        )}
      </main>
    </>
  );
}

export default Chat;
