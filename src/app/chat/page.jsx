// pages/chat.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserCircle,
  Settings,
  SendHorizonal,
  MessageSquare,
  ChevronLeft,
} from "lucide-react";
import Button from "@/components/Button";
import SettingsCard from "@/components/SettingsCard";
import ProfileCard from "@/components/ProfileCard";
import { customStyle } from "../layout";

// Helper component for chat history items
const ChatHistoryItem = ({ text, date }) => (
  <div className="px-4 py-2 cursor-pointer hover:bg-slate-800/30">
    <p className="text-sm text-gray-300 truncate">{text}</p>
  </div>
);

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      // Only auto-close sidebar on initial load for mobile
      if (isMobileView && !document.readyState !== "complete") {
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

  // User data
  const user = {
    email: "User@gmail.com",
    codeHandle: "Code forces handle",
    aiCoderHandle: "AI Coder handle",
  };

  // Sample chat history data
  const todayChats = [
    { id: 1, text: "How to use a chatbot (briefly)", date: new Date() },
    { id: 2, text: "Lorem Ipsum Dolor Sit...", date: new Date() },
  ];

  const yesterdayChats = [
    {
      id: 3,
      text: "Lorem Ipsum Dolor Sit...",
      date: new Date(Date.now() - 86400000),
    },
    {
      id: 4,
      text: "Lorem Ipsum Dolor Sit...",
      date: new Date(Date.now() - 86400000),
    },
  ];

  const olderChats = Array.from({ length: 30 }, (_, i) => ({
    id: i + 5,
    text: "Lorem Ipsum Dolor Sit...",
    date: new Date(Date.now() - (i + 2) * 86400000),
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle message submission
    console.log("Message submitted:", message);
    setMessage("");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
              onClick={toggleSidebar}
            >
              New Chat
            </Button>
          </Link>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto scrollbar-thin [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
          {/* Today's Chats */}
          <div className="mb-2 mx-4">
            <div className="px-1 py-2 text-lg font-semibold text-white">
              Today
            </div>
            {todayChats.map((chat) => (
              <ChatHistoryItem
                key={chat.id}
                text={chat.text}
                date={chat.date}
              />
            ))}
          </div>
          {/* Yesterday's Chats */}
          <div className="mb-2 mx-4 border-t border-b sm:border-none border-white-800">
            <div className="px-1 py-2 text-lg font-semibold text-white">
              Yesterday
            </div>
            {yesterdayChats.map((chat) => (
              <ChatHistoryItem
                key={chat.id}
                text={chat.text}
                date={chat.date}
              />
            ))}
          </div>
          {/* Previous 30 Days */}
          <div className="mx-4">
            <div className="px-1 py-2 text-lg font-semibold text-white">
              Previous 30 days
            </div>
            {olderChats.map((chat) => (
              <ChatHistoryItem
                key={chat.id}
                text={chat.text}
                date={chat.date}
              />
            ))}
          </div>
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
              <img src="/PSA-Logo.svg" alt="PSA Logo" className="w-12 h-12" />
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
            className={`flex-1 flex flex-col space-y-4 py-4 px-4 md:px-8 w-full ${
              !sidebarOpen ? "max-w-7xl" : ""
            }`}
          >
            {/* User's "How to use a chatbot" query */}
            <div className="flex justify-end">
              <div
                className="bg-blue-950/50 px-3 py-2 rounded-2xl rounded-tr-none max-w-xs md:max-w-md"
                style={{ backgroundColor: "#0D263D" }}
              >
                <p className="text-white text-sm">
                  How to use a chatbot (briefly)
                </p>
              </div>
            </div>

            {/* Bot Message */}
            <div className="flex flex-col items-start">
              <div className="flex flex-col items-start">
                <div className="bg-blue-800 rounded-full h-6 w-6 md:h-10 md:w-10 flex items-center justify-center mb-2">
                  <img src="/PSA-Logo.svg" alt="Bot" />
                </div>
                <div
                  className="py-2 px-3 rounded-2xl rounded-tl-none max-w-xs md:max-w-2xl"
                  style={{ backgroundColor: "#0D263D" }}
                >
                  <div className="text-white text-sm space-y-1">
                    <p>Using A Chatbot Is Simple:</p>
                    <ol className="space-y-1 pl-5 list-decimal">
                      <li>
                        Start A Conversation – Type Your Question Or Command In
                        The Chat.
                      </li>
                      <li>
                        Receive A Response – The Bot Replies With Relevant
                        Information Or Actions.
                      </li>
                      <li>
                        Clarify If Needed – If The Response Isn't Accurate,
                        Refine Your Input.
                      </li>
                      <li>
                        Follow Instructions – The Bot May Guide You Through
                        Steps Or Provide Links.
                      </li>
                      <li>
                        End The Session – Close The Chat When You're Done.
                      </li>
                    </ol>
                    <p>
                      Chatbots Can Assist With FAQs, Troubleshooting, And
                      Automation Tasks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
              <SendHorizonal className="h-4 w-4 text-gray-400" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
