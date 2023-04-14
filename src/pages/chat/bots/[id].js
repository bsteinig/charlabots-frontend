import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  NumberInput,
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
    backgroundColor: "#d7e5f9",
  },
  chatWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  botName: {
    fontSize: "1.5rem",
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

function BotChat() {
  const { classes, cx } = useStyles();

  const router = useRouter();
  const { id: botId1, botId: botId2 } = router.query;

  const [bot1, setBot1] = useState({});
  const [bot2, setBot2] = useState({});
  const [interpreted1, setInterpreted1] = useState([]);
  const [interpreted2, setInterpreted2] = useState([]);

  const [loaded, setLoaded] = useState(false);

  const [messages, handlers] = useListState([]);

  const form = useForm({
    initialValues: {
      message: "",
      numResponses: 1,
    },

    validate: {
      message: (value) =>
        value.length === 0 ? "Message cannot be empty" : null,
      numResponses: (value) => (value < 1 ? "Must be at least 1" : null),
    },
  });

  useEffect(() => {
    console.log(botId1, botId2);
    if (!botId1 || !botId2) return;
    let url =
      "http://localhost:8000/getBotData2/?botid1=" +
      botId1 +
      "&botid2=" +
      botId2;

    fetch(url, {})
      .then((response) => response.json())
      // loads headers that include bot names
      .then((data) => {
        if (data.data1 && data.data2) {
          setBot1({ name: data.data1.botname });
          setBot2({ name: data.data2.botname });
        }
      });
    getCode(setInterpreted1, botId1);
    getCode(setInterpreted2, botId2);
  }, [router.isReady]);

  const getCode = (setter, botId) => {
    let url = "http://localhost:8000/getBotData/?botid=" + botId;
    fetch(url, {})
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          const blockData = getBlocks(res.data.canonical);
          const canonicalArray = createCanonicalArray(blockData);
          setter(canonicalArray);
        }
      });
  };

  useEffect(() => {
    if (interpreted1 && interpreted2 && bot1 && bot2) {
      setLoaded(true);
    }
  }, [bot1, bot2]);

  const chatWindow = useRef(null);
  const scrollToBottom = () =>
    chatWindow.current.scrollTo({
      top: chatWindow.current.scrollHeight,
      behavior: "smooth",
    });

  const generateResponse = (interpreted, text) => {
    let response = "";
    for (let i = 0; i < interpreted.length; i++) {
      response = splitOnNewline(chat(interpreted[i], text));
      if (response !== "") {
        break;
      }
    }
    return response;
  };

  const handleChat = (values) => {
    console.log(values);
    form.reset();
    const { message, numResponses } = values;
    var text = message;
    const right_msg = {
      message: text,
      side: "right",
    };
    handlers.append(right_msg);
    scrollToBottom();
    for (let i = 0; i < numResponses; i++) {
      text = generateResponse(interpreted1, text);
      const left_msg = {
        message: text,
        side: "left",
      };
      handlers.append(left_msg);
      setTimeout(() => {
        scrollToBottom();
      }, 50);
      text = generateResponse(interpreted2, text);
      const right_msg = {
        message: text,
        side: "right",
      };
      handlers.append(right_msg);
      setTimeout(() => {
        scrollToBottom();
      }, 50);
    }
  };

  return (
    <>
      <Head>
        <title>Two Bot Chat</title>
        <meta name="description" content="CharlaBots Chat with two bots" />
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
            {loaded
              ? `Have ${bot1.name} chat with ${bot2.name}!`
              : `Loading...`}
          </Title>
        </Group>
        {loaded ? (
          <Container size="xl" className={classes.chatWrapper}>
            <Group position="apart" style={{ width: "60%" }}>
              <Text className={classes.botName}>{bot1.name}</Text>
              <Text className={classes.botName}>{bot2.name}</Text>
            </Group>
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
              onSubmit={form.onSubmit((values) => handleChat(values))}
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
                  placeholder={`Enter ${bot2.name}'s starting message...`}
                  {...form.getInputProps("message")}
                />
                <NumberInput
                  label="Number of Responses"
                  size="lg"
                  defaultValue={1}
                  style={{ width: "180px" }}
                  {...form.getInputProps("numResponses")}
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

export default BotChat;
