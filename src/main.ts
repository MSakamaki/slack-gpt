function doPost(e): any {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (e?.postData?.getDataAsString) {
    const params = JSON.parse(e.postData.getDataAsString());

    if (params.type !== "url_verification") {
      try {
        const SPREADSHEET_ID = getScriptProperties("SPREADSHEET_ID");
        const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

        let sheet = ss.getSheetByName(params.event.channel);
        if (sheet === null) {
          ss.insertSheet(params.event.channel);
          sheet = ss.getSheetByName(params.event.channel);
        }

        if (!hasBeginMessageId(sheet, params.event.client_msg_id)) {
          setChannel(params.event.channel);
          sheet?.appendRow([
            BEGIN_STATE,
            params.event.client_msg_id,
            params.event.channel,
            JSON.stringify(params),
            JSON.stringify(params.event.blocks),
          ]);
          ScriptApp.newTrigger("runEventTrigger")
            .timeBased()
            .after(200)
            .create();
        }
      } catch (e) {
        PropertiesService.getScriptProperties().setProperty("ERR", e.message);
      }
    }

    return ContentService.createTextOutput(params.challenge);
  } else {
    throw new Error("Invalid parameter");
  }
}

function getThreadingQuestion(row: string[]): ChatGptMessage[] {
  const SLACK_GPT_ID =
    PropertiesService.getScriptProperties().getProperty("SLACK_GPT_ID");

  const res = getThreadMessage(getChannel(row), getThreadTs(row));

  console.log(res.messages);

  const messages: ChatGptMessage[] = res.messages.map(({ user, blocks }) => ({
    role: user === SLACK_GPT_ID ? "assistant" : "user",
    content: findText(blocks),
  }));

  console.log(messages);
  return messages;
}

function isChatGptApiSuccess(row: string[], choices: GptResponse): boolean {
  if ((choices?.choices?.length ?? 0) === 0) {
    postSlackBot(
      getChannel(row),
      `ChatGPT APIでエラーが発生しました[${JSON.stringify(choices)}]`,
      {
        thread_ts: getTs(row),
      }
    );
    return false;
  }
  return true;
}

function runEventTrigger(): void {
  const channels = getBeginChannels();
  const SPREADSHEET_ID =
    PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (SPREADSHEET_ID === null) {
    throw Error("SPREADSHEET_ID not found!");
  }
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  channels.forEach((cannel) => {
    const sheet = ss.getSheetByName(cannel);
    const allData = sheet?.getDataRange().getValues() ?? [];
    const beginData = allData
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => row[0] === BEGIN_STATE);

    beginData.forEach(({ row, index }) => {
      console.log("hasThread", hasThread(row));
      if (hasThread(row)) {
        const choices = requestChatThreading([
          SLACK_CHART_FORMAT,
          ...getThreadingQuestion(row),
        ]);

        const mgWord = getThreadingQuestion(row).reduce(
          (p, msg) => expectNgWords(msg.content) ?? p,
          null
        );

        if (mgWord !== null) {
          postSlackBot(
            getChannel(row),
            `利用不可能な[${mgWord}]が発言に見つかりました。`,
            {
              thread_ts: getTs(row),
            }
          );
        } else if (isChatGptApiSuccess(row, choices)) {
          postSlackBot(getChannel(row), choices.choices[0].message.content, {
            thread_ts: getThreadTs(row),
          });
        }
      } else {
        const question = getQuestionText(row);
        const choices = requestChatCompletion(question);
        const mgWord = expectNgWords(question);
        if (mgWord !== null) {
          postSlackBot(
            getChannel(row),
            `利用不可能な[${mgWord}]が発言に見つかりました。`,
            {
              thread_ts: getTs(row),
            }
          );
        } else if (isChatGptApiSuccess(row, choices)) {
          postSlackBot(getChannel(row), choices.choices[0].message.content, {
            thread_ts: getTs(row),
          });
        }
      }

      sheet?.getRange(index + 1, 1).setValue(DONE_STATE);
    });
  });

  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === "runEventTrigger") {
      ScriptApp.deleteTrigger(trigger);
    }
  }
}
