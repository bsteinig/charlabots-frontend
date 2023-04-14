import BotEditor from "@/components/BotEditor";
import { translateCanonicalCode } from "@/lib/canonicalToText";
import { translateLineToCanonical, updateCanonicalCode } from "@/lib/textToCanonical";
import {
  Button,
  Center,
  Group,
  Loader,
  Title,
  createStyles,
} from "@mantine/core";
import { IconHome2 } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const useStyles = createStyles((theme) => ({
  root: {
    minHeight: "100vh",
    backgroundColor: "#d7e5f9",
  },
  topInputs: {
    maxWidth: "max(50%,300px)",
  },
  editor: {
    fontSize: "1.2rem",

    "& > code": {
      fontSize: "1.2rem",
    },
  },
}));

function Edit() {
  const { classes, cx } = useStyles();

  const router = useRouter();
  const { id: langId, botId } = router.query;

  const [botName, setBotName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log(langId, botId);
    let url = `http://localhost:8000/getBotAndLang/?botID=${botId}&langID=${langId}`;
    fetch(url, {})
      .then((response) => response.json())
      .then((data) => {
        if (data.botInfo !== null || data.langInfo !== null) {
          // loads titles that use bot names
          setBotName(data.botInfo["botname"]);

          // loads existing bot description
          setDescription(data.botInfo["description"]);

          // loads existing bot code
          let canonical = data.botInfo["canonical"];
          let mappings = data.langInfo;
          let translatedCode = translateCanonicalCode(mappings, canonical);
          setCode(translatedCode);
          setLoaded(true);
        }
      });
  }, [router.isReady]);

  const handleUpdate = (values, codeText) => {
    if (codeText.trim() == "") {
      alert("Bot code cannot be empty");
      return;
    }

    let url = "http://localhost:8000/getLanguageData/?langid=" + langId;
    fetch(url, {})
      .then((response) => response.json())
      .then((data) => {
        let canonicalCode = "";
        let translatedCode = codeText;

        let translatedLines = translatedCode.split("\n");
        let mappings = data;

        for (let i = 0; i < translatedLines.length; i++) {
          let line = translatedLines[i].trim();
          if (line == "") continue;
          line = translateLineToCanonical(mappings, line);
          canonicalCode += line;
          if (i != translatedLines.length - 1) {
            canonicalCode += "(nw-ln)";
          }
        }
        canonicalCode.trim();
        //send the updated code back to database
        updateCanonicalCode(
          true,
          canonicalCode,
          values.name,
          values.description,
          botId
        );
      });
  };

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
            {loaded ? `Edit ${botName}` : "Loading"}
          </Title>
        </Group>
        {loaded ? (
          <BotEditor
            formHandler={handleUpdate}
            name={botName}
            description={description}
            code={code}
            isEditing={true}
          />
        ) : (
          <Center style={{ height: "80vh" }}>
            <Loader size={150} />
          </Center>
        )}
      </main>
    </>
  );
}

export default Edit;
