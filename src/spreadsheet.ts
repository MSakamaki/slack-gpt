function hasBeginMessageId(
  sheet: GoogleAppsScript.Spreadsheet.Sheet | null,
  clientMsgId: string
): boolean {
  const allData = sheet?.getDataRange().getValues() ?? [];
  return allData.some(
    (row) => row[0] === BEGIN_STATE && row[1] === clientMsgId
  );
}

function setChannel(channel: string): void {
  const ss = SpreadsheetApp.openById(getScriptProperties("SPREADSHEET_ID"));
  const sheet = ss.getSheetByName("Channels");
  sheet?.appendRow([BEGIN_STATE, channel]);
}

function getBeginChannels(): string[] {
  const ss = SpreadsheetApp.openById(getScriptProperties("SPREADSHEET_ID"));
  const sheet = ss.getSheetByName("Channels");

  const allData: string[][] = sheet?.getDataRange().getValues() ?? [];
  const beginData = allData
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => row[0] === BEGIN_STATE);

  beginData.forEach(({ row, index }) => {
    sheet?.getRange(index + 1, 1).setValue(DONE_STATE);
  });

  return beginData.map(({ row }) => row[1]);
}

function getSlackEventSubscriptionRequest(
  row: string[]
): SlackEventSubscriptionRequest {
  return JSON.parse(row[3]) as SlackEventSubscriptionRequest;
}

function findText(blocks): string {
  return blocks
    .filter((e) => e.type === "rich_text")
    .reduce((p, block) => {
      return (
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        p +
        block.elements
          .filter((e) => e.type === "rich_text_section")
          .reduce((_p, { elements }) => {
            return (
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              _p +
              elements
                .filter((e) => e.type === "text")
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                .reduce((_, e) => _ + e.text, "")
            );
          }, "")
      );
    }, "");
}

function getMessageId(row: string[]): string {
  return row[1];
}

function getChannel(row: string[]): string {
  return row[2];
}

function getUser(row: string[]): string {
  return getSlackEventSubscriptionRequest(row).event.user;
}

function getThreadTs(row: string[]): string {
  return getSlackEventSubscriptionRequest(row).event.thread_ts;
}

function getTs(row: string[]): string {
  return getSlackEventSubscriptionRequest(row).event.ts;
}

function hasThread(row: string[]): boolean {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return !!getSlackEventSubscriptionRequest(row).event.thread_ts;
}

function getQuestionText(row: string[]): string {
  const SLACK_GPT_ID = getScriptProperties("SLACK_GPT_ID");
  const text = (
    getSlackEventSubscriptionRequest(row).event.text.match(
      /<@[A-Z0-9]{9,11}>/g
    ) ?? []
  )
    .filter((user) => !user.includes(SLACK_GPT_ID))
    .map((user) => ({
      userId: user,
      userName: getSlackUserInfo(user.substr(2, user.length - 3)).user.name,
    }))
    .reduce(
      (text, { userId, userName }) => text.replaceAll(userId, userName),
      getSlackEventSubscriptionRequest(row).event.text
    )
    .replace(`<@${SLACK_GPT_ID}>`, "");

  console.log("getQuestionText", text);

  return text;
}
