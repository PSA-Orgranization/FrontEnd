import React from "react";
import Link from "next/link";
import Button from "./Button";
import ChatHistoryItem from "./ChatHistoryItem";
import { ChevronLeft } from "lucide-react";
import { Chat } from "@/types/chat";

interface ChatSidebarProps {
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

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  todayChats,
  yesterdayChats,
  previous30DaysChats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onUpdateChatTitle,
  sidebarOpen,
  isMobile,
  toggleSidebar,
}) => (
  <div
    className={`$${
      sidebarOpen
        ? isMobile
          ? "fixed inset-0 w-full z-30 "
          : "md:w-64 w-64"
        : "md:w-0 w-0"
    }  flex flex-col overflow-hidden transition-all duration-300 z-20 bg-blue-900/10 `}
  >
    {/* Mobile Back Button */}
    {isMobile && sidebarOpen && (
      <button
        onClick={toggleSidebar}
        className="flex items-center p-4 text-white cursor-pointer"
      >
        <ChevronLeft className="h-6 w-6 mr-2" />
        <span>Back</span>
      </button>
    )}
    {/* New Chat Button */}
    <div className="m-3">
      <Link href="/chat">
        <Button
          className="sm:w-full py-3 px-4 rounded-md text-left hover:bg-blue-800"
          backGround="bg-[#448CDD] dark:bg-[#082540]"
          onClick={onNewChat}
        >
          New Chat
        </Button>
      </Link>
    </div>
    {/* Chat History */}
    <div className="flex-1 overflow-y-auto scrollbar-thin [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
      {/* Today's Chats */}
      {todayChats.length > 0 && (
        <div className="mb-2 mx-4">
          <div className="px-1 py-2 text-lg font-semibold text-white">
            Today
          </div>
          {todayChats.map((chat) => (
            <div key={chat.id} onClick={() => onSelectChat(chat.id)}>
              <ChatHistoryItem
                text={chat.title}
                onDelete={() => onDeleteChat(chat.id)}
                onUpdateTitle={(newTitle) =>
                  onUpdateChatTitle(chat.id, newTitle)
                }
                className={selectedChatId === chat.id ? "bg-blue-900/40" : ""}
              />
            </div>
          ))}
        </div>
      )}
      {/* Yesterday's Chats */}
      {yesterdayChats.length > 0 && (
        <div className="mb-2 mx-4 border-t border-b sm:border-none border-white-800">
          <div className="px-1 py-2 text-lg font-semibold text-white">
            Yesterday
          </div>
          {yesterdayChats.map((chat) => (
            <div key={chat.id} onClick={() => onSelectChat(chat.id)}>
              <ChatHistoryItem
                text={chat.title}
                onDelete={() => onDeleteChat(chat.id)}
                onUpdateTitle={(newTitle) =>
                  onUpdateChatTitle(chat.id, newTitle)
                }
                className={selectedChatId === chat.id ? "bg-blue-900/40" : ""}
              />
            </div>
          ))}
        </div>
      )}
      {/* Previous 30 Days */}
      {previous30DaysChats.length > 0 && (
        <div className="mx-4">
          <div className="px-1 py-2 text-lg font-semibold text-white">
            Previous 30 days
          </div>
          {previous30DaysChats.map((chat) => (
            <div key={chat.id} onClick={() => onSelectChat(chat.id)}>
              <ChatHistoryItem
                text={chat.title}
                onDelete={() => onDeleteChat(chat.id)}
                onUpdateTitle={(newTitle) =>
                  onUpdateChatTitle(chat.id, newTitle)
                }
                className={selectedChatId === chat.id ? "bg-blue-900/40" : ""}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default ChatSidebar;
