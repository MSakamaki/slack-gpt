function requestChatCompletion(content): GptResponse {
  console.log(content);
  const OPEN_API_KEY = getScriptProperties("APIKEY");
  if (OPEN_API_KEY === null) {
    throw Error("OPEN_API_KEY empty !");
  }
  const apiUrl = "https://api.openai.com/v1/chat/completions";
  const messages = [SLACK_CHART_FORMAT, { role: "user", content }];

  const headers: GoogleAppsScript.URL_Fetch.HttpHeaders = {
    Authorization: `Bearer ${OPEN_API_KEY}`,
    "Content-type": "application/json",
    "X-Slack-No-Retry": "1",
  };
  console.log("requestChatCompletion", messages);
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    muteHttpExceptions: true,
    headers,
    method: "post",
    payload: JSON.stringify({
      model: "gpt-3.5-turbo",
      max_tokens: 1024,
      temperature: 0.9,
      messages,
    }),
  };

  const response = JSON.parse(
    UrlFetchApp.fetch(apiUrl, options).getContentText()
  );

  console.log(JSON.stringify(response));
  return response as GptResponse;
  // return response.choices[0].message.content as string;
}

function requestChatThreading(messages: ChatGptMessage[]): GptResponse {
  const OPEN_API_KEY = getScriptProperties("APIKEY");
  if (OPEN_API_KEY === null) {
    throw Error("OPEN_API_KEY empty !");
  }

  const apiUrl = "https://api.openai.com/v1/chat/completions";

  const headers: GoogleAppsScript.URL_Fetch.HttpHeaders = {
    Authorization: "Bearer " + OPEN_API_KEY,
    "Content-type": "application/json",
    "X-Slack-No-Retry": "1",
  };

  console.log("requestChatThreading", messages);
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    muteHttpExceptions: true,
    headers,
    method: "post",
    payload: JSON.stringify({
      model: "gpt-3.5-turbo",
      max_tokens: 1024,
      temperature: 0.9,
      messages,
    }),
  };

  const response = JSON.parse(
    UrlFetchApp.fetch(apiUrl, options).getContentText()
  );
  console.log(JSON.stringify(response));
  return response as GptResponse;
  // return response.choices[0].message.content as string;
}
