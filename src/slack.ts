declare const SlackApp: any;

function getOption(): GoogleAppsScript.URL_Fetch.URLFetchRequestOptions {
  const SLACK_KEY = getScriptProperties("SLACK_KEY");
  const headers: GoogleAppsScript.URL_Fetch.HttpHeaders = {
    Authorization: `Bearer ${SLACK_KEY}`,
    "Content-type": "application/json",
  };

  return {
    headers,
    method: "get",
  };
}

function getThreadMessage(channel: string, ts: string): SlackThreadResponse {
  return JSON.parse(
    UrlFetchApp.fetch(
      buildUrl_("https://slack.com/api/conversations.replies", { channel, ts }),
      getOption()
    ).getContentText()
  );
}

/**
 * @param user slackUserId
 */
function getSlackUserInfo(user: string): UserInfoResponse {
  return JSON.parse(
    UrlFetchApp.fetch(
      buildUrl_("https://slack.com/api/users.info", { user }),
      getOption()
    ).getContentText()
  );
}

function postSlackBot(
  channelId: string,
  message: string,
  options: {
    thread_ts: string;
  }
): void {
  const SLACK_KEY = getScriptProperties("SLACK_KEY");
  const slackApp = SlackApp.create(SLACK_KEY);
  slackApp.postMessage(channelId, message, options);
}

function buildUrl_(url: string, params: Record<string, string>): string {
  const paramString = Object.keys(params)
    .map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
    .join("&");
  return url + (url.includes("?") ? "&" : "?") + paramString;
}
