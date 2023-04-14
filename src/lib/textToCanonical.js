export function translateLineToCanonical(mapping, line) {
  let mappingKeys = [
    "ifAny",
    "andNotAny",
    "ifAll",
    "andNotAll",
    "replyLine",
    "startReply",
    "endReply",
    "endIf",
    "pickRandom",
    "endPick",
  ];
  let notKeys = ["andNotAny", "andNotAll"];
  //check if line starts with any of the keywords
  let canonical_str = "";
  for (let i = 0; i < mappingKeys.length; i++) {
    if (line.startsWith(mapping[mappingKeys[i]])) {
      let lastWords = line.slice(mapping[mappingKeys[i]].length);
      canonical_str = "{" + mappingKeys[i] + "}" + lastWords;
      break;
    }
  }

  for (let i = 0; i < notKeys.length; i++) {
    let index = canonical_str.indexOf(mapping[notKeys[i]]);
    if (index != -1) {
      let before = canonical_str.slice(0, index);
      let key = notKeys[i];
      let after = canonical_str.slice(index + mapping[notKeys[i]].length);
      canonical_str = before + "{" + key + "}" + after;
      break;
    }
  }
  if (canonical_str == "") {
    return line;
  }
  return canonical_str;
}

export function updateCanonicalCode(
  isEditor,
  canonicalCode,
  botName,
  description,
  botID
) {
  //check the botname field
  //if the botname already exists on a different botID, then tell them that the name is taken
  if (!botID) {
    botID = -1;
  }

  let url = "http://localhost:8000/getAllBotNames";
  fetch(url, {})
    .then((response) => response.json())
    .then((data) => {
      // can't make bot name empty
      //checks for duplicate name
      let isNameMatch = false;
      for (let i = 0; i < data.data.length; i++) {
        if (botName == data.data[i].name && botID != data.data[i].key) {
          alert("That name is already taken, please choose another one");
          isNameMatch = true;
          return;
        }
      }

      // does not allow you to edit a bot name to match another one
      if (!isNameMatch) {
        if (isEditor) {
          let body = {
            botid: botID,
            name: botName,
            description: description,
            code: canonicalCode,
          };

          let url = "http://localhost:8000/updateBot/";
          fetch(url, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
        } else {
          let body = {
            name: botName,
            description: description,
            code: canonicalCode,
          };

          let url = "http://localhost:8000/createBot/";
          fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
        }
        alert("Update Code Success!");
      }
    });
}
