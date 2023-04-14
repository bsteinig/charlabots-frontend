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
import React from "react";

const useStyles = createStyles((theme) => ({
  root: {
    minHeight: "100vh",
    backgroundColor: "#b1c8e9",
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

function BotEditor({ formHandler, name, description, code }) {
  const { classes } = useStyles();

  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: `<pre><code>${code ? code : ""} </code></pre>`,
  });

  const form = useForm({
    initialValues: {
      name: name ? name : "",
      description: description ? description : "",
    },
    validate: {
      name: (value) => (value.length === 0 ? "Name is required" : null),
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
        <form onSubmit={form.onSubmit((values) => formHandler(values))}>
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
              <Button
                type="submit"
                color="blue"
                leftIcon={<IconDeviceFloppy />}
              >
                Save Bot
              </Button>
            </Center>
            <Text size="lg">Add Code Below</Text>
            <RichTextEditor
              editor={editor}
              classNames={{ content: classes.editor }}
              styles={(theme) => ({
                content: {
                  pre: {
                    background: theme.colors.dark[8],
                    borderRadius: theme.fn.radius(),
                    color: theme.colors.dark[0],
                    fontFamily: theme.fontFamilyMonospace,

                    "& code": {
                      background: "none",
                      color: "inherit",
                      fontSize: theme.fontSizes.md,
                      padding: 0,
                    },
                    " & .hljs-comment, & .hljs-quote": {
                      color: theme.colors.green[3],
                    },
                    "& .hljs-keyword, & .hljs-selector-tag, & .hljs-meta-keyword":
                      {
                        color: theme.colors.blue[5],
                      },
                    "& .hljs-number, & .hljs-literal, & .hljs-variable, & .hljs-template-variable, & .hljs-tag .hljs-attr":
                      {
                        color: theme.colors.violet[7],
                      },
                    "& .hljs-built_in": {
                      color: theme.colors.grape[5],
                    },
                  },
                },
              })}
            >
              <RichTextEditor.Toolbar>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.CodeBlock />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>

              <RichTextEditor.Content />
            </RichTextEditor>
          </Container>
        </form>
      </main>
    </>
  );
}

export default BotEditor;
