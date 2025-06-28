export interface Chat {
  id: number;
  title: string;
  last_open?: string;
}

export interface ChatMessage {
  markdown_content: string;
}

export interface ChatHistoryResponse {
  data: Chat[];
}

export interface ChatMessagesResponse {
  data: ChatMessage[];
}

export interface NewChatResponse {
  chat_id: number;
}
