import React, { useState } from "react";
import { Trash, Edit, Check, X } from "lucide-react";
import { ChatHistoryItemProps } from "@/types/chat";



const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({
  text,
  onDelete,
  onUpdateTitle,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(text);
  };

  const handleSave = () => {
    if (onUpdateTitle && editValue.trim() && editValue.trim() !== text) {
      onUpdateTitle(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(text);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div
      className={`px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 ${
        className || ""
      }`}
    >
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleSave}
          className="flex-1 max-w-2/3 bg-transparent text-sm text-gray-300 border-none outline-none"
          autoFocus
        />
      ) : (
        <p className="text-sm text-gray-300 truncate">{text}</p>
      )}

      <div className="flex items-center ml-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-1 rounded text-green-500 cursor-pointer mr-1"
              title="Save"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 rounded text-gray-500 cursor-pointer"
              title="Cancel"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            {onUpdateTitle && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click
                  handleEdit();
                }}
                className="p-1 rounded text-blue-500 cursor-pointer mr-1"
                title="Edit chat title"
              >
                <Edit size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click
                  onDelete();
                }}
                className="p-1 rounded text-red-500 cursor-pointer"
                title="Delete chat"
              >
                <Trash size={16} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryItem;
