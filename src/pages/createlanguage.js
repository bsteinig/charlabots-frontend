import {
  Button,
  Center,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  createStyles,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconHome2, IconUpload } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

const useStyles = createStyles((theme) => ({
  root: {
    minHeight: "100vh",
    backgroundColor: "#d7e5f9",
  },
}));

function CreateLanguage() {
  const { classes, cx } = useStyles();

  const router = useRouter();

  const languageValues = [
    "ifAny",
    "andNotAny",
    "ifAll",
    "andNotAll",
    "replyLine",
    "startReply",
    "endReply",
    "endIf",
    "pickRandom",
    "pickRandomLine",
  ];

  const form = useForm({
    initialValues: {
      name: "",
      ifAny: "",
      andNotAny: "",
      ifAll: "",
      andNotAll: "",
      replyLine: "",
      startReply: "",
      endReply: "",
      endIf: "",
      pickRandom: "",
      pickRandomLine: "",
    },

    validate: {
      name: (value) => (value.length === 0 ? "name cannot be empty" : null),
      ifAny: (value) => (value.length === 0 ? "ifAny cannot be empty" : null),
      andNotAny: (value) =>
        value.length === 0 ? "andNotAny cannot be empty" : null,
      ifAll: (value) => (value.length === 0 ? "ifAll cannot be empty" : null),
      andNotAll: (value) =>
        value.length === 0 ? "andNotAll cannot be empty" : null,
      replyLine: (value) =>
        value.length === 0 ? "replyLine cannot be empty" : null,
      startReply: (value) =>
        value.length === 0 ? "startReply cannot be empty" : null,
      endReply: (value) =>
        value.length === 0 ? "endReply cannot be empty" : null,
      endIf: (value) => (value.length === 0 ? "endIf cannot be empty" : null),
      pickRandom: (value) =>
        value.length === 0 ? "pickRandom cannot be empty" : null,
      pickRandomLine: (value) =>
        value.length === 0 ? "pickRandomLine cannot be empty" : null,
    },
  });

  return (
    <>
      <Head>
        <title>Create a Language</title>
        <meta name="description" content="CharlaBots Create a Bot Language" />
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
            Create a Language
          </Title>
        </Group>
        <Container mt={30} size="lg" className={classes.chatWrapper}>
          <form
            onSubmit={form.onSubmit((values) => handleChat(values.message))}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Stack
              align="flex-start"
              justify="flex-start"
              style={{ width: "100%" }}
            >
              <TextInput
                label={<Text size="lg">Language Name:</Text>}
                {...form.getInputProps("name")}
              />
              <Title order={3} align="center">
                Language Mapping
              </Title>
              <SimpleGrid cols={3}>
                {languageValues.map((value) => (
                  <TextInput
                    key={value}
                    label={<Text size="lg">{`{${value}}:`}</Text>}
                    {...form.getInputProps(value)}
                  />
                ))}
              </SimpleGrid>
              <Center ml="auto" mr="auto">
                <Button
                  size="lg"
                  color="green"
                  type="submit"
                  leftIcon={<IconUpload />}
                >
                  Create Language
                </Button>
              </Center>
            </Stack>
          </form>
        </Container>
      </main>
    </>
  );
}

export default CreateLanguage;
