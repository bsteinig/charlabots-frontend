const NEWLINE = "(nw-ln)";

//interpretedCode = rules dict mapping what we should say
export function chat(interpretedCode, input) {
  //depending on what interpretedCode.keyword is, we call different functions
  input = input.toLowerCase();
  input = input.split(" ");
  switch (interpretedCode.keyword.toLowerCase()) {
    case "ifany":
      return chat_ifAny(interpretedCode, input);
    case "ifall":
      return chat_ifAll(interpretedCode, input);
    case "pickrandom":
      return chat_pickRandom(interpretedCode);
    default:
      return "";
  }
}

export function splitOnNewline(input) {
  let responseArr = String(input).split(NEWLINE + " ");
  let output = "";
  for (let i = 0; i < responseArr.length - 1; i++) {
    output += responseArr[i] + "\n";
  }
  output += responseArr[responseArr.length - 1];
  return output;
}

/* SECTION: Helper functions for chat() */

//returns true if arr contains ALL elements of target
//arr is the words in the input
//target is the words in dict
function contains_all(inputWords, listWords) {
  for (let i = 0; i < listWords.length; i++) {
    if (!inputWords.includes(listWords[i])) return false;
  }
  return true;
}

//if the input has any of the NOT words, return true
//else return false
function chat_notAny(interpretedCode, inputArr) {
  for (let i = 0; i < interpretedCode.wordsNOT.length; i++) {
    if (inputArr.includes(interpretedCode.wordsNOT[i])) return true;
  }
  return false;
}

//if the input has all of the NOT words, return true
//else return false
function chat_notAll(interpretedCode, inputArr) {
  return contains_all(inputArr, interpretedCode.wordsNOT);
}

function chat_ifAny(interpretedCode, input) {
  for (let i = 0; i < interpretedCode.words.length; i++) {
    if (input.includes(interpretedCode.words[i])) {
      if (
        (interpretedCode.keywordNOT == "andnotany" &&
          chat_notAny(interpretedCode, input)) ||
        (interpretedCode.keywordNOT == "andnotall" &&
          chat_notAll(interpretedCode, input))
      ) {
        return ""; //don't respond yet
      } else {
        return interpretedCode.response;
      }
    }
  }
  return "";
}

function chat_ifAll(interpretedCode, input) {
  if (contains_all(input, interpretedCode.words)) {
    //we have a NOT word, dont respond
    if (
      (interpretedCode.keywordNOT == "andnotany" &&
        chat_notAny(interpretedCode, input)) ||
      (interpretedCode.keywordNOT == "andnotall" &&
        chat_notAll(interpretedCode, input))
    ) {
      return ""; //don't respond yet
    } else {
      return interpretedCode.response;
    }
  }
  return "";
}

function chat_pickRandom(interpretedCode) {
  //see how large response is, pick a random one
  let idx = Math.floor(Math.random() * interpretedCode.response.length);
  return interpretedCode.response[idx];
}
