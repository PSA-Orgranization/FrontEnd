// pages/chat.js
"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
import EmptyChatScreen from "@/components/EmptyChatScreen";
import ChatSidebar from "@/components/ChatSidebar";
import { Chat, ChatMessage } from "@/types/chat";
import ChatMainArea from "@/components/ChatMainArea";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ChatPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [todayChats, setTodayChats] = useState<Chat[]>([]);
  const [yesterdayChats, setYesterdayChats] = useState<Chat[]>([]);
  const [previous30DaysChats, setPrevious30DaysChats] = useState<Chat[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [showEmptyChatScreen, setShowEmptyChatScreen] = useState(false);

  // Check authentication on component mount
  const checkAuth = () => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    // Check if essential auth data is missing
    if (!accessToken || !refreshToken || !username || !email) {
      return true;
    } else {
      return false;
    }
  };

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

  const logout = useCallback(() => {
    Cookies.remove("access_token", { path: "/" });
    Cookies.remove("refresh_token", { path: "/" });
    localStorage.clear();
    window.location.href = "/login";
  }, []);

  // Fetch chat history
  const fetchChats = useCallback(async () => {
    setLoadingChats(true);
    try {
      const res = await authRequest(
        {
          method: "GET",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/history/`,
        },
        logout
      );

      // Handle both direct array and wrapped response
      const chatsData = Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data;

      setChats(chatsData);

      // Categorize chats immediately after getting the data
      const today: Chat[] = [];
      const yesterday: Chat[] = [];
      const previous30: Chat[] = [];
      const now = new Date();

      chatsData.forEach((chat: Chat) => {
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
        } else if (diffDays > 1 && diffDays <= 30) {
          previous30.push(chat);
        } else {
          yesterday.push(chat);
        }
      });

      // Sort each category by last_open ascending (oldest first)
      const sortAsc = (a: Chat, b: Chat) => {
        const dateA = new Date(a.last_open!).getTime();
        const dateB = new Date(b.last_open!).getTime();
        if (dateA !== dateB) return dateA - dateB;
        // If dates are equal, sort by id descending
        return b.id - a.id;
      };
      today.sort(sortAsc);
      yesterday.sort(sortAsc);
      previous30.sort(sortAsc);

      setTodayChats(today);
      setYesterdayChats(yesterday);
      setPrevious30DaysChats(previous30);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load chat history.");
    } finally {
      setLoadingChats(false);
    }
  }, [logout]);

  useEffect(() => {
    if (checkAuth()) {
      router.push("/login");
      return;
    }
    fetchChats();
  }, [fetchChats, router]);

  // User data
  const user = {
    email: "User@gmail.com",
    codeHandle: "Code forces handle",
    aiCoderHandle: "AI Coder handle",
  };

  const handleSubmit = async (
    eOrMsg: React.FormEvent | string,
    chatIdOverride?: number
  ) => {
    let msg: string;
    if (typeof eOrMsg === "string") {
      msg = eOrMsg;
    } else {
      eOrMsg.preventDefault();
      msg = message;
    }
    const chatId = chatIdOverride ?? selectedChatId;
    if (!chatId || !msg.trim()) return;
    const userMsg = { markdown_content: msg };
    setChatMessages((prev) => [
      ...prev,
      userMsg,
      { markdown_content: "__LOADING__" },
    ]);
    if (typeof eOrMsg !== "string") setMessage("");
    try {
      const res = await authRequest(
        {
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/send_prompt/${chatId}/`,
          data: { prompt: userMsg.markdown_content },
          headers: { "Content-Type": "application/json" },
        },
        logout
      );
      setChatMessages((prev) => [
        ...prev.slice(0, -1),
        { markdown_content: res.data.response },
      ]);
    } catch (error) {
      setChatMessages((prev) => prev.slice(0, -1));
      console.error(error);
      toast.error("Failed to send message.");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle New Chat button click
  const handleNewChat = async (firstMessage?: string) => {
    setShowEmptyChatScreen(true);
    if (isMobile) setSidebarOpen(false);
    setSelectedChatId(null);
    setChatMessages([]);
    // If a first message is provided (from EmptyChatScreen), create a new chat as before
    if (firstMessage && firstMessage.trim()) {
      try {
        const res = await authRequest(
          {
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/create/`,
            // data: { title: "New Chat" },
          },
          logout
        );
        await fetchChats();
        if (res.data && res.data.chat_id) {
          setShowEmptyChatScreen(false);
          await handleOpenChat(res.data.chat_id);
          handleSubmit(firstMessage, res.data.chat_id);
          // Set chat title to first 10 characters of the first prompt
          handleUpdateChatTitle(res.data.chat_id, firstMessage.slice(0, 20));
        }
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to create chat."
          );
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    }
  };

  // Hide EmptyChatScreen when a chat is selected
  const handleOpenChatWithHide = async (chatId: number) => {
    setShowEmptyChatScreen(false);
    await handleOpenChat(chatId);
  };

  // Handle chat deletion
  const handleDeleteChat = (chatId: number) => async () => {
    try {
      const res = await authRequest(
        {
          method: "DELETE",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/chat/${chatId}/`,
        },
        logout
      );
      await fetchChats();
      setSelectedChatId(null);
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete chat.");
    }
  };

  // Handle update chat title
  const handleUpdateChatTitle = async (chatId: number, newTitle: string) => {
    try {
      await authRequest(
        {
          method: "PUT",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/chat/${chatId}/`,
          data: { title: newTitle },
          headers: { "Content-Type": "application/json" },
        },
        logout
      );
      await fetchChats(); // Refresh the chat list
    } catch (error) {
      console.error(error);
      toast.error("Failed to update chat title.");
    }
  };

  // Handle delete all chats
  const deleteAllChats = async () => {
    if (!chats.length) {
      setSettingsOpen(false);
      return;
    }

    try {
      await authRequest(
        {
          method: "DELETE",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/delete_all/`,
        },
        logout
      );
      await fetchChats();

      setSettingsOpen(false);
      setSelectedChatId(null);
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
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
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/chat/${chatId}/`,
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
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
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
        className={`fixed md:hidden bottom-0 left-0 right-0 flex justify-around items-center h-16 z-50 shadow-t-lg dark:bg-[#041B2D] bg-[#448CDD]`}
      >
        <Link
          href="/chat"
          className="flex flex-col items-center justify-center w-1/3"
          onClick={() => {
            setProfileOpen(false);
            setSettingsOpen(false);
            setSidebarOpen(false);
          }}
        >
          <MessageSquare className=" flex items-center justify-center h-8 cursor-pointer" />
          <span className="text-xs">Chat</span>
        </Link>

        <button
          onClick={() => {
            setProfileOpen(true);
            setSettingsOpen(false);
            setSidebarOpen(false);
          }}
          className="flex flex-col items-center justify-center w-1/3"
        >
          <UserCircle className="flex items-center justify-center h-8 cursor-pointer" />
          <span className="text-xs">Profile</span>
        </button>

        <button
          onClick={() => {
            setSettingsOpen(true);
            setProfileOpen(false);
            setSidebarOpen(false);
          }}
          className="flex flex-col items-center justify-center w-1/3"
        >
          <Settings className="flex items-center justify-center h-8 cursor-pointer" />
          <span className="text-xs">Settings</span>
        </button>
      </div>

      {/* ProfileCard component */}
      <ProfileCard
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        // user={user}
      />

      {/* SettingsCard component */}
      <SettingsCard
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onDeleteAll={deleteAllChats}
      />

      {/* Left Sidebar */}

      <ChatSidebar
        todayChats={todayChats}
        yesterdayChats={yesterdayChats}
        previous30DaysChats={previous30DaysChats}
        selectedChatId={selectedChatId}
        onSelectChat={handleOpenChatWithHide}
        onNewChat={() => handleNewChat()}
        onDeleteChat={(id) => handleDeleteChat(id)()}
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
        onUpdateChatTitle={handleUpdateChatTitle}
      />

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
            <div className="rounded-full p-3 mt-10 dark:bg-[linear-gradient(40deg,#05203d_0%,#004e99_75%,#ee4392_100%)] bg-[linear-gradient(40deg,#BAB8B8_0%,#0C5BA4_75%,#EE4392_100%)]">
              <Image
                src="/Logo.svg"
                alt="PSA Logo"
                width={30}
                height={30}
                priority
                className=""
              />
            </div>
          </button>

          <div className="md:flex hidden mr-10">
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
        {showEmptyChatScreen ? (
          <EmptyChatScreen handleNewChat={handleNewChat} />
        ) : (
          <ChatMainArea
            chatMessages={chatMessages}
            loadingMessages={loadingMessages}
            selectedChatId={selectedChatId}
            message={message}
            setMessage={setMessage}
            handleSubmit={(e) => handleSubmit(e)}
            handleNewChat={handleNewChat}
            inputRef={inputRef}
            sidebarOpen={sidebarOpen}
            messagesEndRef={messagesEndRef}
          />
        )}
      </div>
    </div>
  );
}
