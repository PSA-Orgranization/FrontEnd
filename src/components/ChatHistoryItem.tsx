import React from "react";
import { Trash } from "lucide-react";

interface ChatHistoryItemProps {
  text: string;
  date?: Date | null;
  chatId?: string | number;
  onDelete?: () => void;
  className?: string;
}

const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({
  text,
  onDelete,
  className,
}) => (
  <div
    className={`px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 ${
      className || ""
    }`}
  >
    <p className="text-sm text-gray-300 truncate">{text}</p>
    {onDelete && (
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent parent click
          onDelete();
        }}
        className="ml-2 p-1 rounded text-red-500 cursor-pointer"
        title="Delete chat"
      >
        <Trash size={16} />
      </button>
    )}
  </div>
);

export default ChatHistoryItem;
