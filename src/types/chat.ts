import { RefObject } from "react";

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

export interface ChangePasswordCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ChatHistoryItemProps {
  text: string;
  date?: Date | null;
  chatId?: string | number;
  onDelete?: () => void;
  onUpdateTitle?: (newTitle: string) => void;
  className?: string;
}

export interface ChatMainAreaProps {
  chatMessages: ChatMessage[];
  loadingMessages: boolean;
  selectedChatId: number | null;
  message: string;
  setMessage: (msg: string) => void;
  handleSubmit: (e: React.FormEvent | string) => void;
  handleNewChat: (msg: string) => void;
  inputRef: RefObject<HTMLInputElement>;
  sidebarOpen: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
}

export interface ChatSidebarProps {
  todayChats: Chat[];
  yesterdayChats: Chat[];
  previous30DaysChats: Chat[];
  selectedChatId: number | null;
  onSelectChat: (id: number) => void;
  onNewChat: () => void;
  onDeleteChat: (id: number) => void;
  onUpdateChatTitle: (chatId: number, newTitle: string) => void;
  sidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface EmptyChatScreenProps {
  handleNewChat: (msg: string) => void;
}

export interface SettingsCardProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteAll?: () => void;
}

export interface ProfileCardProps {
  isOpen: boolean;
  onClose: () => void;
}
