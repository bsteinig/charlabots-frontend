import SubMenu from "@/components/SubMenu";
import {
  Button,
  Center,
  Container,
  Stack,
  Title,
  createStyles,
} from "@mantine/core";
import Head from "next/head";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  root: {
    minHeight: "100vh",
    backgroundColor: "#b1c8e9",
  },
  siteTitle: {
    fontSize: "min(10vmin, 20rem)",
  },
  menuButton: {
    width: "min(90vw, 600px)",
    fontSize: "2vmin",
    fontWeight: "600",
  },
}));

export default function Home() {
  const { classes } = useStyles();

  const options = [
    { label: "Chat with a Bot", value: "chat" },
    { label: "Create a Bot", value: "create" },
    { label: "Edit a Bot", value: "edit" },
    { label: "Chat with Two Bots", value: "bot-chat" },
    { label: "Create a Bot Language", value: "bot-lang" },
  ];

  const [currentMenu, setCurrentMenu] = useState("home");

  return (
    <>
      <Head>
        <title>CharlaBots</title>
        <meta name="description" content="CharlaBots Chatbot interface" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={classes.root}>
        {currentMenu === "home" ? (
          <Container size="md">
            <Stack align="center" spacing={60} pt={100}>
              <Title order={1} className={classes.siteTitle}>
                CharlaBots
              </Title>
              <Stack>
                {options.map((option) => {
                  return (
                    <Button
                      className={classes.menuButton}
                      size="xl"
                      key={option.value}
                      onClick={() => setCurrentMenu(option.value)}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </Stack>
            </Stack>
          </Container>
        ) : (
          <SubMenu currentMenu={currentMenu} setCurrentMenu={setCurrentMenu} />
        )}
      </main>
    </>
  );
}
