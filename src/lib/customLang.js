export function CharlaBotsHighlight(hljs) {
  const regex = hljs.regex;
  const IDENT_RE = /[\p{XID_Start}_]\p{XID_Continue}*/u;
  const RESERVED_WORDS = [
    "ifAny",
    "ifAll",
    "andNotAny",
    "andNotAll",
  ];

  const KEYWORDS = {
    $pattern: /[A-Za-z]\w+|__\w+__/,
    keyword: RESERVED_WORDS,
  };

  const PROMPT = {
    className: "meta",
    begin: /^(>>>|\.\.\.) /,
  };

  const SUBST = {
    className: "subst",
    begin: /\{/,
    end: /\}/,
    keywords: KEYWORDS,
    illegal: /#/,
  };

  const LITERAL_BRACKET = {
    begin: /\{\{/,
    relevance: 0,
  };

  const STRING = {
    className: "string",
    contains: [hljs.BACKSLASH_ESCAPE],
    variants: [
      {
        begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
        end: /'''/,
        contains: [hljs.BACKSLASH_ESCAPE, PROMPT],
        relevance: 10,
      },
      {
        begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
        end: /"""/,
        contains: [hljs.BACKSLASH_ESCAPE, PROMPT],
        relevance: 10,
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])'''/,
        end: /'''/,
        contains: [hljs.BACKSLASH_ESCAPE, PROMPT, LITERAL_BRACKET, SUBST],
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])"""/,
        end: /"""/,
        contains: [hljs.BACKSLASH_ESCAPE, PROMPT, LITERAL_BRACKET, SUBST],
      },
      {
        begin: /([uU]|[rR])'/,
        end: /'/,
        relevance: 10,
      },
      {
        begin: /([uU]|[rR])"/,
        end: /"/,
        relevance: 10,
      },
      {
        begin: /([bB]|[bB][rR]|[rR][bB])'/,
        end: /'/,
      },
      {
        begin: /([bB]|[bB][rR]|[rR][bB])"/,
        end: /"/,
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])'/,
        end: /'/,
        contains: [hljs.BACKSLASH_ESCAPE, LITERAL_BRACKET, SUBST],
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])"/,
        end: /"/,
        contains: [hljs.BACKSLASH_ESCAPE, LITERAL_BRACKET, SUBST],
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
    ],
  };

  const digitpart = "[0-9](_?[0-9])*";
  const pointfloat = `(\\b(${digitpart}))?\\.(${digitpart})|\\b(${digitpart})\\.`;
  const lookahead = `\\b|${RESERVED_WORDS.join("|")}`;
  const NUMBER = {
    className: "number",
    relevance: 0,
    variants: [
      {
        begin: `(\\b(${digitpart})|(${pointfloat}))[eE][+-]?(${digitpart})[jJ]?(?=${lookahead})`,
      },
      {
        begin: `(${pointfloat})[jJ]?`,
      },
      {
        begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${lookahead})`,
      },
      {
        begin: `\\b0[bB](_?[01])+[lL]?(?=${lookahead})`,
      },
      {
        begin: `\\b0[oO](_?[0-7])+[lL]?(?=${lookahead})`,
      },
      {
        begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${lookahead})`,
      },
      {
        begin: `\\b(${digitpart})[jJ](?=${lookahead})`,
      },
    ],
  };
  const JSDOC_COMMENT = hljs.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
    relevance: 0,
    contains: [
      {
        begin: "(?=@[A-Za-z]+)",
        relevance: 0,
        contains: [
          {
            className: "doctag",
            begin: "@[A-Za-z]+",
          },
          {
            className: "type",
            begin: "\\{",
            end: "\\}",
            excludeEnd: true,
            excludeBegin: true,
            relevance: 0,
          },
          {
            className: "variable",
            begin: IDENT_RE$1 + "(?=\\s*(-)|$)",
            endsParent: true,
            relevance: 0,
          },
          // eat spaces (not newlines) so we can find
          // types or variables
          {
            begin: /(?=[^\n])\s/,
            relevance: 0,
          },
        ],
      },
    ],
  });
  const COMMENT = {
    className: "comment",
    variants: [
      JSDOC_COMMENT,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_LINE_COMMENT_MODE,
    ],
  };
  const PARAMS = {
    className: "params",
    variants: [
      // Exclude params in functions without params
      {
        className: "",
        begin: /\(\s*\)/,
        skip: true,
      },
      {
        begin: /\(/,
        end: /\)/,
        excludeBegin: true,
        excludeEnd: true,
        keywords: KEYWORDS,
        contains: ["self", PROMPT, NUMBER, STRING, hljs.HASH_COMMENT_MODE],
      },
    ],
  };
  SUBST.contains = [STRING, NUMBER, PROMPT];

  return {
    name: "CharlaBots",
    aliases: ["cb"],
    unicodeRegex: true,
    keywords: KEYWORDS,
    illegal: /(<\/|->|\?)|=>/,
    contains: [
      PROMPT,
      NUMBER,
      {
        // very common convention
        begin: /\bself\b/,
      },
      {
        // eat "if" prior to string so that it won't accidentally be
        // labeled as an f-string
        beginKeywords: "if",
        relevance: 0,
      },
      STRING,
      COMMENT_TYPE,
      {
        match: [/\bdef/, /\s+/, IDENT_RE],
        scope: {
          1: "keyword",
          3: "title.function",
        },
        contains: [PARAMS],
      },
      {
        variants: [
          {
            match: [
              /\bclass/,
              /\s+/,
              IDENT_RE,
              /\s*/,
              /\(\s*/,
              IDENT_RE,
              /\s*\)/,
            ],
          },
          {
            match: [/\bclass/, /\s+/, IDENT_RE],
          },
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          6: "title.class.inherited",
        },
      },
      {
        className: "meta",
        begin: /^[\t ]*@/,
        end: /(?=#)|$/,
        contains: [NUMBER, PARAMS, STRING],
      },
    ],
  };
}
