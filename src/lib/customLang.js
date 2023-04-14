export function CharlaBotsHighlight(hljs) {
  const RESERVED_WORDS = [
    "if",
    "any",
    "and",
    "all",
    "end\sif",
    "not all",
    "and not any",
    "and not all",
    "not any",
    'if any',
    'end',
  ];

  const BUILT_INS = [
    "pick",
    "random",
  ]

  const LITERALS = [
    "reply",
    "start",
    "line",
  ]

  const KEYWORDS = {
    $pattern: /[A-Za-z]\w+|\w+\s+\w+|\w+\s+\w+\s+\w+/,
    keyword: RESERVED_WORDS,
    built_in: BUILT_INS,
    literal: LITERALS,
  };

  
  const COMMENT = {
    className: "comment",
    variants: [
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_LINE_COMMENT_MODE
    ]
  };

  return {
    name: "CharlaBots",
    aliases: ["cb"],
    unicodeRegex: true,
    keywords: KEYWORDS,
    contains: [
      {
        // very common convention
        begin: /\bself\b/,
      },
      COMMENT,
    ],
  };
}
