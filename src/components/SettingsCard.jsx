// components/SettingsCard.js
"use client";

import Button from "./Button";
import { X } from "lucide-react";

export default function SettingsCard({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div
        className="bg-gray-800 rounded-lg p-6 w-96 "
        style={{ backgroundColor: "#041B2D" }}
      >
        <div className="flex justify-between items-center pb-4 px-6 -mx-6">
          <h2 className="text-xl font-semibold text-white">Settings</h2>

          <Button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl p-1"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Full-width white divider line */}
        <div className="border-t border-white -mx-6"></div>

        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center p-3 bg-gray-700 rounded-md">
            <span className="text-white">Delete all chats</span>
            <Button
              className="font-medium cursor-pointer text-base py-2 px-3 bg-red-500"
              onClick={() => {
                // Add delete functionality here
                console.log("Delete all chats clicked");
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
