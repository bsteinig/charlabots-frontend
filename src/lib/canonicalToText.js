const NEWLINE = "(nw-ln)";

//translates canonical code to user code
export function translateCanonicalCode(mapping, canonicalCode) {
  let translatedCode = "";
  let linesToTranslate = canonicalCode.split(NEWLINE);
  for (let i = 0; i < linesToTranslate.length; i++) {
    //loops thru each line of code
    let translatedLine = translateLineToUser(mapping, linesToTranslate[i]);
    translatedCode += translatedLine;
    if (i < linesToTranslate.length - 1) {
      translatedCode += "\n";
    }
  }
  return translatedCode;
}

//translates canonical to user code
function translateLineToUser(mapping, line) {
  let translatedLine = "",
    prevKeyword = "",
    keyword = "";

  for (let j = 0; j < line.length; j++) {
    prevKeyword = keyword;
    keyword = "";

    if (line[j] == "{") {
      j++;
      for (; j < line.length; j++) {
        if (line[j] != "}") {
          keyword += line[j];
        } else {
          break;
        }
      }
      let translatedKeyword = mapping[keyword].trim();

      if (keyword.startsWith("reply")) {
        translatedLine += "    " + translatedKeyword;
      } else {
        translatedLine += translatedKeyword;
      }
    }
    //not a keyword
    else {
      if (
        !(
          prevKeyword.startsWith("if") ||
          prevKeyword.startsWith("reply") ||
          prevKeyword.startsWith("and")
        )
      ) {
        translatedLine += "    ";
      }
      while (j < line.length && line[j] != "{") {
        translatedLine += String(line[j]);
        j++;
      }
      j--;
    }
  }
  return translatedLine;
}
