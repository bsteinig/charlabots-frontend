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
  const options = {
    chat: {
      url: "http://localhost:8000/getAllBotNames/",
      decorator: "bot",
      tip: "Bot:",
    },

    create: {
      url: "http://localhost:8000/getAllLanguageNames/",
      decorator: "language",
      tip: "Select a Language:",
    },

    edit: {
      url: "http://localhost:8000/getAllLanguageNames/",
      decorator: "language",
      tip: "Select a Language:",
    },

    "bot-chat": {
      url: "http://localhost:8000/getAllBotNames/",
      decorator: "bot",
      tip: "Bot:",
    },
  };

  const [list, setList] = useState([]);

  useEffect(() => {
    console.log("SubMenu:", currentMenu);

    if (currentMenu in options) {
      fetch(options[currentMenu].url, {})
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
  }, [currentMenu]);

  const handleClick = (id) => {
    console.log(id);
    router.push("/chat/" + id)
  }

  return (
    <div>
      <Text size="lg" align="center">
        {options[currentMenu].tip}
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
