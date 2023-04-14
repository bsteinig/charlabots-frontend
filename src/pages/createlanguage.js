import { Button, Group, Title, createStyles } from "@mantine/core";
import { IconHome2 } from "@tabler/icons-react";
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
      </main>
    </>
  );
}

export default CreateLanguage;
