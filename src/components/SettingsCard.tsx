// components/SettingsCard.js
"use client";

import Button from "./Button";
import { X, LogOut, Trash2, Key, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ChangePasswordCard from "./ChangePasswordCard";

interface SettingsCardProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteAll?: () => void;
}

export default function SettingsCard({
  isOpen,
  onClose,
  onDeleteAll,
}: SettingsCardProps) {
  const router = useRouter();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const handleChangePassword = () => {
    setChangePasswordOpen(true);
  };

  // Function to clear authentication-related localStorage items
  const clearAuthStorage = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
  };

  const handleLogout = (e) => {
    e.preventDefault();
    clearAuthStorage();
    onClose(); // Close the settings modal
    router.push("/");
  };

  if (!isOpen) return null;

  return (
    <>
      <ChangePasswordCard
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />

      <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-40 ">
        <div className="dark:bg-[#041B2D] bg-[#177AD6] md:dark:bg-[#041B2D] md:bg-[#177AD6] dark:bg-[linear-gradient(40deg,#000001_0%,#082540_75%,#ee4392_100%)] bg-[linear-gradient(40deg,#BAB8B8_0%,#0C5BA4_75%,#EE4392_100%)] md:dark:bg-none md:bg-none scrollbar-thin [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden w-full h-full md:h-auto md:max-h-[90vh] md:max-w-lg md:rounded-lg shadow-lg overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center px-4 md:px-8 py-5 border-b border-white-400 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="hidden md:block p-2 bg-blue-900/20 rounded-lg">
                <Settings size={20} className="text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Settings</h2>
            </div>
            <Button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
            >
              <X size={18} />
            </Button>
          </div>

          {/* Settings Options */}
          <div className="p-6 space-y-3">
            {/* Delete All Chats */}
            <div className="group bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
              <div className="flex justify-between items-center p-4">
                <div>
                  <span className="text-white font-medium">
                    Delete all chats
                  </span>
                  <p className="text-gray-400 text-sm">
                    Permanently remove all conversation history
                  </p>
                </div>
                <button
                  className="p-2 bg-red-600 cursor-pointer hover:bg-red-700 transition-all duration-200 rounded-lg shadow-sm hover:shadow-md"
                  onClick={onDeleteAll}
                  title="Delete all chats"
                >
                  <Trash2 size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div className="group bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
              <div className="flex justify-between items-center p-4">
                <div>
                  <span className="text-white font-medium">
                    Change Password
                  </span>
                  <p className="text-gray-400 text-sm">
                    Change your account password
                  </p>
                </div>
                <button
                  className="p-2 bg-blue-600 cursor-pointer hover:bg-blue-700 transition-all duration-200 rounded-lg shadow-sm hover:shadow-md"
                  onClick={handleChangePassword}
                  title="Change password"
                >
                  <Key size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* Logout */}
            <div className="group bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
              <div className="flex justify-between items-center p-4">
                <div>
                  <span className="text-white font-medium">Logout</span>
                  <p className="text-gray-400 text-sm">
                    Sign out of your account
                  </p>
                </div>
                <button
                  className="p-2 bg-orange-600 cursor-pointer hover:bg-orange-700 transition-all duration-200 rounded-lg shadow-sm hover:shadow-md"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut size={18} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
