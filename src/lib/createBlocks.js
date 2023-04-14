const NEWLINE = "(nw-ln)";

//  blocks is an array of strings. remove empty elements from array
function blocksHelper(blocks) {
  let ret = [];
  for (let i = 0; i < blocks.length; i++) {
    blocks[i] = blocks[i].trim();
    if (blocks[i] != "") {
      ret.push(blocks[i].trim());
    }
  }
  return ret;
}

//  inputs lines of canonical code, returns canonical code as array of 'blocks'
//  deal with pickRandom code differently to differentiate between the different options
// for pickRadom, do not delete the NEWLINEs chars from canonical code
//  TODO: deal with pickRandom
export function getBlocks(lines) {
  // console.log(lines)
  lines = lines.split(NEWLINE);
  let blocks = [];
  let blockString = "";

  // Process Canonical Code Line by Line
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    let keyword = "";
    let pickRandomBlock = false;
    let startReplyBlock = false;

    // Parse line for keywords and removes comments
    for (let j = 0; j < line.length; j++) {
      if (line[j] == "{") {
        j++;
        while (line[j] != "}" && j < line.length) {
          keyword += line[j];
          j++;
        }
        if (keyword == "pickRandom") {
          pickRandomBlock = true;
        } else if (keyword == "startReply") {
          startReplyBlock = true;
        }
      }
      //ignore comments
      if (j < line.length - 1 && line[j] == "/" && line[j + 1] == "/") {
        line = line.slice(0, j - 1);
        break;
      }
    }

    // Process line based on keyword: pickRandom
    if (pickRandomBlock) {
      //for loop till end
      while (i < lines.length) {
        blockString += lines[i] + " " + NEWLINE;
        i++;
      }
      blocks.push(blockString);
      //we have to be at the end
      return blocksHelper(blocks);
    }
    // Process line based on keyword: startReply
    else if (startReplyBlock) {
      blockString += lines[i] + NEWLINE + " ";
      i++;
      while (i < lines.length) {
        blockString += lines[i] + NEWLINE + " ";
        i++;
        if (lines[i] == "{endIf}") {
          blockString += lines[i];
          blocks.push(blockString);
          break;
        }
      }
      blockString = "";
    } else {
      blockString += line + " ";
    }
    if (keyword.startsWith("end")) {
      blocks.push(blockString);
      blockString = "";
    }
  }

  return blocksHelper(blocks);
}
