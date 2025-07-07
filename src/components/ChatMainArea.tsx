import React, { RefObject, useState, useEffect } from "react";
import { ChatMainAreaProps, ChatMessage } from "@/types/chat";
import EmptyChatScreen from "./EmptyChatScreen";
import DotLoader from "./DotLoader";
import { SendHorizontal, Copy, Check, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaArrowDown } from "react-icons/fa";

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
  messagesEndRef,
}) => {
  // State for copied code block index
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  // State for scroll-to-bottom arrow visibility
  const [showScrollArrow, setShowScrollArrow] = useState(false);

  // Check if user is at the bottom of the chat
  const checkScrollPosition = () => {
    const chatContainer = document.querySelector(
      ".chat-messages-container"
    ) as HTMLElement;
    if (chatContainer) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
      setShowScrollArrow(!isAtBottom);
    }
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const chatContainer = document.querySelector(".chat-messages-container");
    if (chatContainer) {
      chatContainer.addEventListener("scroll", checkScrollPosition);
      // Initial check
      checkScrollPosition();

      return () => {
        chatContainer.removeEventListener("scroll", checkScrollPosition);
      };
    }
  }, [chatMessages]);

  return (
    <div
      className={`flex-1 flex flex-col max-w-7xl w-full pb-20 md:pb-4 overflow-y-auto mx-auto ${
        !sidebarOpen ? "items-center" : ""
      }`}
    >
      {/* Chat Messages */}
      <div
        className={`chat-messages-container flex-1 flex flex-col space-y-4 pt-4 px-4 md:px-8 w-full pb-14 md:pb-0 ${
          !sidebarOpen ? "max-w-7xl" : ""
        } overflow-y-auto scrollbar-thin [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden`}
      >
        {selectedChatId === null ? (
          <EmptyChatScreen handleNewChat={handleNewChat} />
        ) : loadingMessages ? (
          <div className="flex justify-center items-center h-full text-gray-400">
            Loading messages...
          </div>
        ) : (
          <>
            {chatMessages.map((msg, idx) => {
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
                    <div className="py-2 px-3 sm:ml-2 sm:mt-2 rounded-2xl rounded-tl-none max-w-xs md:max-w-2xl bg-[#1773C8] dark:bg-[#0D263D]">
                      <div className="text-white text-sm space-y-1">
                        {msg.markdown_content === "__LOADING__" ? (
                          <DotLoader />
                        ) : (
                          <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                // Custom styling for different markdown elements
                                h1: ({ children }) => (
                                  <h1 className="text-lg font-bold text-white mb-2">
                                    {children}
                                  </h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="text-base font-bold text-white mb-2">
                                    {children}
                                  </h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="text-sm font-bold text-white mb-1">
                                    {children}
                                  </h3>
                                ),
                                p: ({ children }) => (
                                  <p className="text-gray-200 mb-2 leading-relaxed">
                                    {children}
                                  </p>
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc list-inside text-gray-200 mb-2 space-y-1">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal list-inside text-gray-200 mb-2 space-y-1">
                                    {children}
                                  </ol>
                                ),
                                li: ({ children }) => (
                                  <li className="text-gray-200">{children}</li>
                                ),
                                code: ({ children, className, ...props }) => {
                                  const isInline = !className;
                                  // For code blocks, add copy button
                                  if (isInline) {
                                    return (
                                      <code className="bg-gray-700 text-white px-1 py-0.5 rounded text-xs">
                                        {children}
                                      </code>
                                    );
                                  }
                                  // Extract code string
                                  const codeString = String(children).replace(
                                    /\n$/,
                                    ""
                                  );
                                  // Unique key for this code block
                                  const codeBlockKey = `${idx}-${codeString.slice(
                                    0,
                                    10
                                  )}`;
                                  return (
                                    <div className="relative group">
                                      <button
                                        type="button"
                                        className="absolute top-2 right-2 z-10 p-1 rounded bg-gray-700 hover:bg-gray-600 transition text-gray-300 hover:text-white"
                                        onClick={() => {
                                          navigator.clipboard.writeText(
                                            codeString
                                          );
                                          setCopiedIdx(idx);
                                          setTimeout(
                                            () => setCopiedIdx(null),
                                            1500
                                          );
                                        }}
                                        title="Copy code"
                                      >
                                        {copiedIdx === idx ? (
                                          <Check
                                            size={16}
                                            className="text-text-white"
                                          />
                                        ) : (
                                          <Copy
                                            size={16}
                                            className="cursor-pointer"
                                          />
                                        )}
                                      </button>
                                      <code className="block bg-gray-800 text-text-white p-3 rounded-lg text-xs overflow-x-auto">
                                        {children}
                                      </code>
                                    </div>
                                  );
                                },
                                pre: ({ children }) => (
                                  <pre className="bg-gray-800 p-3 rounded-lg overflow-x-auto mb-2">
                                    {children}
                                  </pre>
                                ),
                                blockquote: ({ children }) => (
                                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 mb-2">
                                    {children}
                                  </blockquote>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-bold text-white">
                                    {children}
                                  </strong>
                                ),
                                em: ({ children }) => (
                                  <em className="italic text-gray-300">
                                    {children}
                                  </em>
                                ),
                                a: ({ children, href }) => (
                                  <a
                                    href={href}
                                    className="text-blue-400 hover:text-blue-300 underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {children}
                                  </a>
                                ),
                                table: ({ children }) => (
                                  <div className="overflow-x-auto mb-2">
                                    <table className="min-w-full border border-gray-600">
                                      {children}
                                    </table>
                                  </div>
                                ),
                                th: ({ children }) => (
                                  <th className="border border-gray-600 px-3 py-2 text-left bg-gray-700 text-white font-bold">
                                    {children}
                                  </th>
                                ),
                                td: ({ children }) => (
                                  <td className="border border-gray-600 px-3 py-2 text-gray-200">
                                    {children}
                                  </td>
                                ),
                              }}
                            >
                              {msg.markdown_content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
            {/* Scroll target element */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input - fixed at bottom for mobile, normal for desktop */}
      {selectedChatId !== null && (
        <div
          className={`fixed bottom-16 md:relative md:bottom-auto left-0 right-0 px-4 py-2 md:px-8 md:py-4 bg-transparent w-full ${
            !sidebarOpen ? "flex justify-center" : ""
          }`}
        >
          {/* Scroll to Bottom Arrow */}
          {showScrollArrow && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-18 md:bottom-22 cursor-pointer left-1/2 transform -translate-x-1/2 z-50 p-3 bg-blue-800 hover:bg-blue-700 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              title="Scroll to bottom"
            >
              <FaArrowDown size={16} className="text-white" />
            </button>
          )}

          <form
            onSubmit={handleSubmit}
            className={`flex w-full  ${!sidebarOpen ? "max-w-7xl" : ""}`}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask PSA Something..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 text-white placeholder:text-white bg-[#448CDD] dark:bg-gray-800/90 rounded-l-full px-6 py-4 focus:outline-none text-sm max-w-7xl"
            />
            <button
              type="submit"
              className="bg-[#448CDD] dark:bg-gray-800/90 rounded-r-full px-6 py-4 flex items-center justify-center"
            >
              <SendHorizontal className="h-4 w-4 text-gray-400 cursor-pointer" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatMainArea;
