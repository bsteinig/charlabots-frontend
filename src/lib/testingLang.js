export function testingLang(hljs) {
    return {
        case_insensitive: true, // language is case-insensitive
        keywords: 'for if while',
        contains: [
          {
            scope: 'string',
            begin: '"', end: '"'
          },
          hljs.COMMENT(
            '/\\*', // begin
            '\\*/', // end
            {
              contains: [
                {
                  scope: 'doc', begin: '@\\w+'
                }
              ]
            }
          )
        ]
    }
}