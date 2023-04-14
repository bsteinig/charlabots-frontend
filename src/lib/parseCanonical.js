const NEWLINE = "(nw-ln)";

//input: array of 'blocks' of canonical code
//returns: array of dictionary of rules
export function createCanonicalArray(blocks) {
  let interpretedCode = [];
  for (let i = 0; i < blocks.length; i++) {
    let rulesDict = {
      keyword: "",
      words: [],
      keywordNOT: "",
      wordsNOT: [],
      response: [],
    };
    let words = blocks[i].split(" ");
    //for every word remove capitalization and grammar
    for (let i = 0; i < words.length; i++) {
      //words[i] = words[i].toLowerCase(); //TODO: should not tolowercase responses, just input words
      words[i] = words[i].replace(/[.,\/#!$%\^&\*;:=\_`~]/g, "");
    }

    let keyword = checkForKeyword(words[0]);
    //error checking
    if (keyword == false) {
      alert("ERROR: no keyword at start, check code for assistance");
      return;
    } else if (keyword == "pickRandom") {
      interpretedCode.push(createDictForPickRandom(blocks[i]));
      continue;
    } else {
      rulesDict["keyword"] = keyword; //gets the first keyword as keyword
    }

    let endloop = false;
    let j = 1; //don't delete, j is used outside of the for loop
    for (; j < words.length; j++) {
      if (endloop == true) {
        break;
      }
      //while it's not a keyword, add word to "words"
      let innerKeyword = checkForKeyword(words[j]);
      if (!innerKeyword) {
        rulesDict["words"].push(removeComma(words[j]).toLowerCase());
      }
      //it is a NOT keyword
      else if (innerKeyword.startsWith("and")) {
        rulesDict["keywordNOT"] = checkForKeyword(words[j]);
        //loop through the not keywords
        for (j = j + 1; j < words.length; j++) {
          //if it IS a keyword, we are at the response, end the loop
          if (!checkForKeyword(words[j])) {
            rulesDict["wordsNOT"].push(removeComma(words[j]).toLowerCase());
          } else {
            endloop = true;
            break;
          }
        }
      } else {
        break;
      }
    }
    //all other code except for end statements are the response
    let responseStr = "";
    //check if theres a start reply

    for (; j < words.length - 1; j++) {
      if (words[j].startsWith("{")) continue;
      //if we see {stuff} delete it from words[j] (nw-ln){endif}
      responseStr += words[j] + " ";
    }
    rulesDict["response"].push(responseStr);
    interpretedCode.push(rulesDict);
  }

  return interpretedCode;
}

/* SECTION: Helper Functions */

//returns the keyword if found, false if not, empty string if start/end long response
function checkForKeyword(word) {
  if (word[0] == "{" && word[word.length - 1] == "}") {
    return word.slice(1, -1);
  }
  //case where {keyword}(nw-ln)
  else if (word[0] == "{" && word[word.length - 1] == ")")
    return "long response";
  return false;
}

//removes comma and puts it in lower case
function removeComma(word) {
  if (word[word.length - 1] == ",") {
    word = word.slice(0, -1);
  }
  return word.toLowerCase();
}

// TODO: not tested
function createDictForPickRandom(block) {
  let rulesDict = {
    keyword: "",
    words: [],
    keywordNOT: "",
    wordsNOT: [],
    response: [],
  };

  rulesDict["keyword"] = "pickRandom";

  const responseArr = block.split(" " + NEWLINE);
  //remove first and last 2 elements of responseArr

  while (
    responseArr[responseArr.length - 1] == "" ||
    responseArr[responseArr.length - 1] == "{endPick}"
  ) {
    responseArr.pop();
  }

  responseArr.shift();
  rulesDict["response"] = responseArr;
  return rulesDict;
}
