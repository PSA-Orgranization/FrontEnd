import React, { RefObject } from "react";
import { ChatMessage } from "@/types/chat";
import EmptyChatScreen from "./EmptyChatScreen";
import DotLoader from "./DotLoader";
import { SendHorizontal } from "lucide-react";

interface ChatMainAreaProps {
  chatMessages: ChatMessage[];
  loadingMessages: boolean;
  selectedChatId: number | null;
  message: string;
  setMessage: (msg: string) => void;
  handleSubmit: (e: React.FormEvent | string) => void;
  handleNewChat: (msg: string) => void;
  inputRef: RefObject<HTMLInputElement>;
  sidebarOpen: boolean;
}

const ChatMainArea: React.FC<ChatMainAreaProps> = ({
  chatMessages,
  loadingMessages,
  selectedChatId,
  message,
  setMessage,
  handleSubmit,
  handleNewChat,
  inputRef,
  sidebarOpen,
}) => (
  <div
    className={`flex-1 flex flex-col max-w-7xl w-full pb-20 md:pb-4 overflow-y-auto mx-auto ${
      !sidebarOpen ? "items-center" : ""
    }`}
  >
    {/* Chat Messages */}
    <div
      className={`flex-1 flex flex-col space-y-4 pt-4 px-4 md:px-8 w-full pb-10 md:pb-4  ${
        !sidebarOpen ? "max-w-7xl" : ""
      } overflow-y-auto scrollbar-thin [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden`}
    >
      {selectedChatId === null ? (
        <EmptyChatScreen handleNewChat={handleNewChat} />
      ) : loadingMessages ? (
        <div className="flex justify-center items-center h-full text-gray-400">
          Loading messages...
        </div>
      ) : chatMessages.length > 0 ? (
        chatMessages.map((msg, idx) => {
          // User message (right)
          if (idx % 2 === 0) {
            return (
              <div key={idx} className="flex justify-end">
                <div className="bg-pink-500 px-3 py-2 rounded-2xl rounded-tr-none max-w-xs md:max-w-md">
                  <p className="text-white text-sm">
                    {msg.markdown_content === "__LOADING__" ? (
                      <DotLoader />
                    ) : (
                      msg.markdown_content
                    )}
                  </p>
                </div>
              </div>
            );
          } else {
            // AI message (left)
            return (
              <div key={idx} className="flex flex-col items-start">
                <div
                  className="py-2 px-3 sm:ml-2 sm:mt-2 rounded-2xl rounded-tl-none max-w-xs md:max-w-2xl"
                  style={{ backgroundColor: "#0D263D" }}
                >
                  <div className="text-white text-sm space-y-1">
                    <p>
                      {msg.markdown_content === "__LOADING__" ? (
                        <DotLoader />
                      ) : (
                        msg.markdown_content
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        })
      ) : (
        <div className="flex justify-center items-center h-full text-gray-400">
          No messages yet.
        </div>
      )}
    </div>
    {/* Message Input - fixed at bottom for mobile, normal for desktop */}
    {selectedChatId !== null && (
      <div
        className={`fixed bottom-16 md:relative md:bottom-auto left-0 right-0 px-4 py-2 md:px-8 md:py-4 bg-transparent w-full ${
          !sidebarOpen ? "flex justify-center" : ""
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className={`flex w-full ${!sidebarOpen ? "max-w-7xl" : ""}`}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Send a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-gray-800/90 text-white placeholder-gray-400 rounded-l-full px-6 py-4 focus:outline-none text-sm max-w-7xl"
            style={{ backgroundColor: "#1E2933" }}
          />
          <button
            type="submit"
            className="bg-gray-800/90 rounded-r-full px-6 py-4 flex items-center justify-center"
            style={{ backgroundColor: "#1E2933" }}
          >
            <SendHorizontal className="h-4 w-4 text-gray-400 cursor-pointer" />
          </button>
        </form>
      </div>
    )}
  </div>
);

export default ChatMainArea;
