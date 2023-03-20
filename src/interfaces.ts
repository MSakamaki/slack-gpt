interface ChatGptMessage {
  role: "assistant" | "user" | "system";
  content: string;
}

interface SlackEventSubscriptionRequest {
  token: string;
  team_id: string;
  api_app_id: string;
  event: {
    client_msg_id: string;
    type: string;
    text: string;
    user: string;
    ts: string;
    blocks: Block[];
    team: string;
    thread_ts: string;
    parent_user_id: string;
    channel: string;
    event_ts: string;
  };
  type: string;
  event_id: string;
  event_time: number;
  authorizations: Array<{
    enterprise_id: any;
    team_id: string;
    user_id: string;
    is_bot: boolean;
    is_enterprise_install: boolean;
  }>;
  is_ext_shared_channel: boolean;
  event_context: string;
}

interface UserInfoResponse {
  ok: boolean;
  user: User;
}
interface User {
  id: string;
  team_id: string;
  name: string;
  deleted: boolean;
  color: string;
  real_name: string;
  tz: string;
  tz_label: string;
  tz_offset: number;
  is_admin: boolean;
  is_owner: boolean;
  is_primary_owner: boolean;
  is_restricted: boolean;
  is_ultra_restricted: boolean;
  is_bot: boolean;
  is_app_user: boolean;
  updated: number;
  is_email_confirmed: boolean;
  who_can_share_contact_card: string;
}

interface SlackThreadResponse {
  ok: boolean;
  messages: Array<BotMessage | UserMessage>;
  has_more: boolean;
}

interface BotMessage {
  bot_id: string;
  type: string;
  text: string;
  user: string;
  ts: string;
  app_id: string;
  blocks: Block[];
  team: string;
  bot_profile: any[];
  thread_ts: string;
  parent_user_id: string;
}

interface UserMessage {
  client_msg_id: string;
  type: string;
  text: string;
  user: string;
  ts: string;
  blocks: Block[];
  team: string;
  thread_ts: string;
  parent_user_id: string;
}

interface Block {
  type: string;
  block_id: string;
  elements: Element[];
}

interface Element {
  type: string;
  elements: Array<ChildElementUser | ChildElementText>;
}

interface ChildElementUser {
  type: "user";
  user_id: string;
}

interface ChildElementText {
  type: "text";
  text: string;
}

interface Choice {
  message: {
    content: string;
  };
  finish_reason: string;
  index: number;
}

interface GptResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: Choice[];
}
