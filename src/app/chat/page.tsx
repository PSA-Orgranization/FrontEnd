// pages/chat.js
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  UserCircle,
  Settings,
  SendHorizontal,
  MessageSquare,
  ChevronLeft,
} from "lucide-react";
import Button from "@/components/Button";
import SettingsCard from "@/components/SettingsCard";
import ProfileCard from "@/components/ProfileCard";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import ChatHistoryItem from "@/components/ChatHistoryItem";
import { authRequest } from "@/lib/utils";
import DotLoader from "@/components/DotLoader";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [chats, setChats] = useState([]); // [{ chat_id, title }]
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<
    { markdown_content: string }[]
  >([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      // Only auto-close sidebar on initial load for mobile
      if (isMobileView && document.readyState !== "complete") {
        setSidebarOpen(false);
      }
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // Fetch chat history
  const fetchChats = async () => {
    try {
      const res = await authRequest(
        {
          method: "GET",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/history/`,
        },
        logout
      );
      setChats(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load chat history.");
    }
  };
  useEffect(() => {
    fetchChats();
  }, []);

  // User data
  const user = {
    email: "User@gmail.com",
    codeHandle: "Code forces handle",
    aiCoderHandle: "AI Coder handle",
  };

  // Categorize chats by last_open
  const { todayChats, yesterdayChats, previous30DaysChats } = useMemo(() => {
    const today: any[] = [];
    const yesterday: any[] = [];
    const previous30: any[] = [];
    const now = new Date();
    chats.forEach((chat) => {
      if (!chat.last_open) return;
      const chatDate = new Date(chat.last_open);
      const diffTime = now.getTime() - chatDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (
        chatDate.getDate() === now.getDate() &&
        chatDate.getMonth() === now.getMonth() &&
        chatDate.getFullYear() === now.getFullYear()
      ) {
        today.push(chat);
      } else if (
        diffDays === 1 &&
        chatDate.getMonth() === now.getMonth() &&
        chatDate.getFullYear() === now.getFullYear()
      ) {
        yesterday.push(chat);
      } else if (diffDays > 1 && diffDays <= 30) {
        previous30.push(chat);
      }
    });
    // Sort each category by last_open ascending (oldest first)
    const sortAsc = (a: any, b: any) => {
      const dateA = new Date(a.last_open).getTime();
      const dateB = new Date(b.last_open).getTime();
      if (dateA !== dateB) return dateA - dateB;
      // If dates are equal, sort by id descending
      return b.id - a.id;
    };
    today.sort(sortAsc);
    yesterday.sort(sortAsc);
    previous30.sort(sortAsc);

    return {
      todayChats: today,
      yesterdayChats: yesterday,
      previous30DaysChats: previous30,
    };
  }, [chats]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedChatId || !message.trim()) return;
    const userMsg = { markdown_content: message };
    setChatMessages((prev) => [
      ...prev,
      userMsg,
      { markdown_content: "__LOADING__" },
    ]);
    setMessage("");
    try {
      const res = await authRequest(
        {
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/send_prompt/${selectedChatId}/`,
          data: { prompt: userMsg.markdown_content },
          headers: { "Content-Type": "application/json" },
        },
        logout
      );

      // Replace the last message (the loading message) with the real AI response
      setChatMessages((prev) => [
        ...prev.slice(0, -1),
        { markdown_content: res.data.response },
      ]);
    } catch (error) {
      // Remove the loading message
      setChatMessages((prev) => prev.slice(0, -1));
      console.error(error);
      toast.error("Failed to send message.");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle New Chat button click
  const handleNewChat = async () => {
    try {
      const res = await authRequest(
        {
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/create/`,
          data: { title: "New Chat" },
        },
        logout
      );
      // Fetch chat history again to get the latest chats
      await fetchChats();
      // Open the new chat if id is returned

      if (res.data && res.data.chat_id) {
        await handleOpenChat(res.data.chat_id);
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create chat.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
    toggleSidebar();
  };

  // Handle chat deletion
  const handleDeleteChat = (chatId: number) => async () => {
    try {
      const res = await authRequest(
        {
          method: "DELETE",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/delete/${chatId}/`,
        },
        logout
      );
      toast.success(res.data.message || "Chat deleted successfully.");
      await fetchChats();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete chat.");
    }
  };

  // Handle delete all chats
  const deleteAllChats = async () => {
    if (!chats.length) return;
    try {
      await Promise.all(
        chats.map((chat) =>
          authRequest(
            {
              method: "DELETE",
              url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/delete/${chat.id}/`,
            },
            logout
          )
        )
      );
      toast.success("All chats deleted successfully.");
      await fetchChats();

      setSettingsOpen(false);
      toggleSidebar();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete all chats.");
    }
  };

  // Fetch messages for a chat
  const handleOpenChat = async (chatId: number) => {
    setSelectedChatId(chatId);
    setLoadingMessages(true);
    try {
      const res = await authRequest(
        {
          method: "GET",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/get_chat/${chatId}/`,
        },
        logout
      );
      setChatMessages(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load chat messages.");
      setChatMessages([]);
    } finally {
      setLoadingMessages(false);
      toggleSidebar();
      // Focus the input field after opening a chat
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  // Scroll to bottom when chatMessages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  return (
    <div className="flex h-screen text-white">
      {/* Mobile Bottom Nav */}
      <div
        className={`fixed md:hidden bottom-0 left-0 right-0 border-t border-gray-800 flex justify-around items-center h-16 z-40 shadow-t-lg ${
          sidebarOpen ? "bg-[#071830] " : "bg-transparent"
        }`}
      >
        <Link
          href="/chat"
          className="flex flex-col items-center justify-center w-1/3"
          onClick={() => {
            setProfileOpen(false);
            setSidebarOpen(false);
          }}
        >
          <MessageSquare
            className=" flex items-center justify-center h-8 cursor-pointer"
            // style={{ fill: "currentColor", stroke: "none" }}
          />

          <span className="text-xs">Chat</span>
        </Link>
        <button
          onClick={() => {
            setProfileOpen(true);
            setSidebarOpen(false);
          }}
          className="flex flex-col items-center justify-center w-1/3"
        >
          <UserCircle className="text-gray-400 flex items-center justify-center h-8 cursor-pointer" />

          <span className="text-xs">Profile</span>
        </button>
        <button
          onClick={() => {
            setSettingsOpen(true);
            setSidebarOpen(false);
          }}
          className="flex flex-col items-center justify-center w-1/3"
        >
          <Settings className="text-gray-400 flex items-center justify-center h-8 cursor-pointer" />

          <span className="text-xs">Settings</span>
        </button>
      </div>

      {/* ProfileCard component */}
      <ProfileCard
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
      />

      {/* SettingsCard component */}
      <SettingsCard
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onDeleteAll={deleteAllChats}
      />

      {/* Left Sidebar */}
      <div
        className={`${
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
            className="flex items-center p-4 text-white"
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
              backGround="bg-[#082540]"
              onClick={handleNewChat}
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
                <div key={chat.id} onClick={() => handleOpenChat(chat.id)}>
                  <ChatHistoryItem
                    text={chat.title}
                    onDelete={handleDeleteChat(chat.id)}
                    className={
                      selectedChatId === chat.id ? "bg-blue-900/40" : ""
                    }
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
                <div key={chat.id} onClick={() => handleOpenChat(chat.id)}>
                  <ChatHistoryItem
                    text={chat.title}
                    onDelete={handleDeleteChat(chat.id)}
                    className={
                      selectedChatId === chat.id ? "bg-blue-900/40" : ""
                    }
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
                <div key={chat.id} onClick={() => handleOpenChat(chat.id)}>
                  <ChatHistoryItem
                    text={chat.title}
                    onDelete={handleDeleteChat(chat.id)}
                    className={
                      selectedChatId === chat.id ? "bg-blue-900/40" : ""
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col h-full ${
          sidebarOpen && isMobile ? "hidden" : ""
        }`}
      >
        {/* Top Navigation Bar for Desktop */}
        <div className="flex justify-between items-center h-16 px-4">
          {/* Logo + Toggle Button */}
          <button onClick={toggleSidebar} className="cursor-pointer">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <Image
                src="/PSA-Logo.svg"
                alt="PSA Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
          </button>

          <div className="md:flex hidden">
            <UserCircle
              className="h-6 w-6 text-white mr-4 cursor-pointer"
              onClick={() => setProfileOpen(true)}
            />
            <Settings
              className="h-6 w-6 text-white cursor-pointer"
              onClick={() => setSettingsOpen(true)}
            />
          </div>
        </div>

        {/* Content Container - Wraps both messages and input field */}
        <div
          className={`flex-1 flex flex-col w-full pb-20 md:pb-4 overflow-y-auto ${
            !sidebarOpen ? "items-center" : ""
          }`}
        >
          {/* Chat Messages */}
          <div
            className={`flex-1 flex flex-col space-y-4 pt-4 px-4 md:px-8 w-full pb-10 md:pb-4  ${
              !sidebarOpen ? "max-w-7xl" : ""
            } overflow-y-auto scrollbar-thin [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden`}
          >
            {loadingMessages ? (
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
                      {/* <div className="bg-blue-800 rounded-full h-6 w-6 md:h-10 md:w-10 flex items-center justify-center mb-2">
                        <Image
                          src="/PSA-Logo.svg"
                          alt="Bot"
                          width={48}
                          height={48}
                        />
                      </div> */}
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
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input - fixed at bottom for mobile, normal for desktop */}
        <div
          className={`fixed bottom-16 md:relative md:bottom-auto left-0 right-0 px-4 py-2 md:px-8 md:py-4 bg-transparent ${
            !sidebarOpen ? "flex justify-center " : ""
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
              className="flex-1 bg-gray-800/90 text-white placeholder-gray-400 rounded-l-full px-6 py-4 focus:outline-none text-sm"
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
      </div>
    </div>
  );
}
