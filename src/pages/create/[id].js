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
import { RichTextEditor } from "@mantine/tiptap";
import { IconDeviceFloppy, IconHome2 } from "@tabler/icons-react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { CharlaBotsHighlight } from "@/lib/customLang";
import { lowlight } from "lowlight";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { translateLineToCanonical, updateCanonicalCode } from "@/lib/textToCanonical";
import BotEditor from "@/components/BotEditor";

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

lowlight.registerLanguage("cb", CharlaBotsHighlight);

function Create() {
  const { classes, cx } = useStyles();

  const router = useRouter();
  const { id } = router.query;

  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: "<pre><code></code></pre>",
  });

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },
    validate: {
      name: (value) => (value.length === 0 ? "Name is required" : null),
    },
  });

  const handleCreation = (values, codeText) => {
    
    if (codeText.trim() == "") {
      alert("Bot code cannot be empty");
      return;
    }

    let url = "http://localhost:8000/getLanguageData/?langid=" + id;
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
        updateCanonicalCode(false, canonicalCode, values.name, values.description, null);
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
            {router.isReady ? `Create a Bot` : "Loading"}
          </Title>
        </Group>
        <BotEditor formHandler={handleCreation} isEditing={false} />
      </main>
    </>
  );
}

export default Create;
