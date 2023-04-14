import { Button, Stack, Text, createStyles } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const useStyles = createStyles((theme) => ({
  menuButton: {
    width: "min(90vw, 600px)",
    fontSize: "2vmin",
    fontWeight: "600",
  },
}));

function SubMenu({ currentMenu, setCurrentMenu }) {
  const { classes } = useStyles();
  const router = useRouter();

  // TODO: Replace with server endpoint
  const requests = {
    bot: {
      url: "http://localhost:8000/getAllBotNames/",
      decorator: "bot",
      tip: `Bot`,
    },

    language: {
      url: "http://localhost:8000/getAllLanguageNames/",
      decorator: "language",
      tip: "Select a Language",
    },
  };

  const options = {
    chat: [
      'bot',
    ],
    create: [
      'language',
    ],
    edit: [
      'language',
      'bot',
    ],
    'bot-chat': [
      'bot',
      'bot',
    ],
  }


  const [list, setList] = useState([]);
  const [stage, setStage] = useState(0);
  const [langId, setLangId] = useState(0);
  const [botId, setBotId] = useState(0);

  useEffect(() => {

    if (currentMenu in options) {
      fetch(requests[options[currentMenu][stage]].url, {})
        .then((response) => response.json())
        .then((data) => {
          let temp = [];

          for (const index in data.data) {
            temp.push({
              label: data.data[index]["name"],
              key: data.data[index]["key"],
            });
          }
          console.log(temp);
          setList(temp);
        });
    }
  }, [currentMenu, stage]);

  const handleClick = (id) => {
    console.log(id);
    if (currentMenu === "create") {
      router.push("/create/" + id);
    }
    if (currentMenu === "chat") {
      router.push("/chat/" + id);
    }
    if (currentMenu === "edit") {
      if (stage === 0) {
        setLangId(id);
        setStage(1);
      } else if (stage === 1) {
        router.push("/edit/" + langId + "?botId=" + id);
      }
    }
    if (currentMenu === "bot-chat") {
      if (stage === 0) {
        setBotId(id);
        setStage(1);
      } else if (stage === 1) {
        router.push("/chat/bots/" + botId + "?botId=" + id);
      }
    }

  };

  return (
    <div>
      <Text size="lg" align="center">
        {requests[options[currentMenu][stage]].tip}{currentMenu == 'bot-chat' ? ` ${stage+1}` : ''}:
      </Text>
      <Stack pb={120}>
        {list.map((item) => {
          return (
            <Button
              className={classes.menuButton}
              size="xl"
              key={item.key}
              label={item.label}
              onClick={() => handleClick(item.key)}
            >
              {item.label}
            </Button>
          );
        })}
      </Stack>
    </div>
  );
}

export default SubMenu;
