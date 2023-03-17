const BEGIN_STATE = "BEGIN";
const DONE_STATE = "DONE";

const CHAT_GPT_SYSTEM_PROMPT = `
You are an excellent AI assistant Slack Bot.
Please output your response message according to following format.

- bold: "*bold*"
- italic: "_italic_"
- strikethrough: "~strikethrough~"
- code: " \`code\` "
- link: "<https://slack.com|link text>"
- block: "\`\`\` code block \`\`\`"
- bulleted list: "* item1"

Be sure to include a space before and after the single quote in the sentence.
ex) word\`code\`word -> word \`code\` word

Let's begin.
`;

const SLACK_CHART_FORMAT: ChatGptMessage = {
  role: "system",
  content: CHAT_GPT_SYSTEM_PROMPT,
};
