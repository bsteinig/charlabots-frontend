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
import { useRouter } from "next/router";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  root: {
    minHeight: "100vh",
    backgroundColor: "#d7e5f9",
  },
  siteTitle: {
    fontSize: "min(10vmin, 20rem)",
    userSelect: "none",
    cursor: "pointer",
  },
  menuButton: {
    width: "min(90vw, 600px)",
    fontSize: "2vmin",
    fontWeight: "600",
  },
}));

export default function Home() {
  const { classes } = useStyles();

  const router = useRouter();

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
        <Container size="md">
          <Stack align="center" spacing={60} pt={100} justify="flex-start">
            <Title
              order={1}
              className={classes.siteTitle}
              onClick={() => setCurrentMenu("home")}
            >
              CharlaBots
            </Title>
            {currentMenu === "home" ? (
              <Stack>
                {options.map((option) => {
                  return (
                    <Button
                      className={classes.menuButton}
                      size="xl"
                      key={option.value}
                      onClick={() => {
                        option.value === "bot-lang"
                          ? router.push("/createlanguage")
                          : setCurrentMenu(option.value);
                      }}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </Stack>
            ) : (
              <SubMenu
                currentMenu={currentMenu}
                setCurrentMenu={setCurrentMenu}
              />
            )}
          </Stack>
        </Container>
      </main>
    </>
  );
}
