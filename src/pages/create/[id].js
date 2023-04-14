import {
  Button,
  Center,
  Container,
  Group,
  Text,
  TextInput,
  Textarea,
  Title,
  createStyles,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy, IconHome2 } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const useStyles = createStyles((theme) => ({
  root: {
    minHeight: "100vh",
    backgroundColor: "#b1c8e9",
  },
  topInputs: {
    maxWidth: "max(50%,300px)",
  },
}));

function Create() {
  const { classes, cx } = useStyles();

  const router = useRouter();
  const { id } = router.query;

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      code: "",
    },
    validate: {
      name: (value) => (value.length === 0 ? "Name is required" : null),
      code: (value) => (value.length === 0 ? "Code is required" : null),
    },
  });

  return (
    <>
      <Head>
        <title>Create A Bot</title>
        <meta name="description" content="CharlaBots Create A Bot" />
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
            {router.isReady ? `Create a Bot` : "Loading"}
          </Title>
        </Group>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Container size="lg">
            <TextInput
              className={classes.topInputs}
              label="Name"
              size="md"
              {...form.getInputProps("name")}
            />
            <Textarea
              my={20}
              className={classes.topInputs}
              label="Description"
              size="md"
              {...form.getInputProps("description")}
              autosize
              minRows={3}
              maxRows={5}
            />
            <Center>
            <Button type="submit" color="blue" leftIcon={<IconDeviceFloppy />}>
              Save Bot
            </Button>
          </Center>
          <Text size="lg">Add Code Below</Text>
          </Container>
          
        </form>
      </main>
    </>
  );
}

export default Create;
