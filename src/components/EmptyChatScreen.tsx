import Image from "next/image";
import React, { useState, useRef } from "react";
import { SendHorizontal } from "lucide-react";

interface EmptyChatScreenProps {
  handleNewChat: (msg: string) => void;
}

const EmptyChatScreen: React.FC<EmptyChatScreenProps> = ({ handleNewChat }) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      handleNewChat(message.trim());
      setMessage("");
      // Optionally blur input
      inputRef.current?.blur();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
      <Image
        src="/PSA-LIGHT-LOGO.svg"
        alt="PSA Logo Light"
        width={80}
        height={80}
        priority
        className="block dark:hidden"
      />
      {/* Dark mode logo */}
      <Image
        src="/PSA-Dark-Logo.svg"
        alt="PSA Logo Dark"
        width={80}
        height={80}
        priority
        className="hidden dark:block"
      />
      <h2 className="text-2xl font-bold text-white">
        How can I help you today?
      </h2>
      <p className="text-gray-400">
        Start a new chat by sending your first message!
      </p>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex justify-center"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask PSA something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 placeholder:text-white bg-[#448CDD] dark:bg-gray-800/90 rounded-l-full px-6 py-4 focus:outline-none text-sm "
        />
        <button
          type="submit"
          className="bg-[#448CDD] dark:bg-gray-800/90 rounded-r-full px-6 py-4 flex items-center justify-center"
          aria-label="Send message"
        >
          <SendHorizontal className="h-4 w-4 text-gray-400 cursor-pointer" />
        </button>
      </form>
    </div>
  );
};

export default EmptyChatScreen;
