import { X, LogOut } from "lucide-react";
import Button from "./Button";
import ProblemsLevelCard from "./ProblemsLevelCard";
import { useState } from "react";
import ProblemsContestCard from "./ProblemsContestCard";
import ProblemsTagCard from "./ProblemsTagCard";
import Link from "next/link";

export default function ProfileCard({ isOpen, onClose, user }) {
  if (!isOpen) return null;

  const [problemsModalOpen, setProblemsModalOpen] = useState(false);
  const [levelModalOpen, setLevelModalOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);

  // Default user data if not provided
  const userData = user || {
    email: "User@gmail.com",
    codeHandle: "Code forces handle",
    aiCoderHandle: "AT Coder handle",
  };

  return (
    <>
      <ProblemsContestCard
        isOpen={problemsModalOpen}
        onClose={() => setProblemsModalOpen(false)}
      />

      <ProblemsLevelCard
        isOpen={levelModalOpen}
        onClose={() => setLevelModalOpen(false)}
      />

      <ProblemsTagCard
        isOpen={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
      />

      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-10">
        <div className="bg-[#041B2D] w-full h-full md:h-auto md:max-h-[90vh] md:max-w-3xl md:rounded-lg shadow-lg overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center  px-4 md:px-8 py-5 border-b border-white-400 sticky top-0  z-10">
            <h2 className="text-xl font-medium text-white">Profile</h2>
            <Button onClick={onClose} className="text-gray-400 p-1">
              <X size={20} />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 md:p-8 border-b border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <div className="flex items-center mb-1">
                  <h3 className="text-lg font-medium text-white">User</h3>
                  <Link href="/">
                    <LogOut
                      size={16}
                      className="ml-2 text-gray-400 hover:text-white cursor-pointer"
                    />
                  </Link>
                </div>
                <p className="text-sm text-gray-400">{userData.email}</p>
              </div>
              <Button className="px-4 py-2 bg-blue-900 text-white text-sm rounded-md hover:bg-blue-800 cursor-pointer w-full md:w-auto">
                Reset Password
              </Button>
            </div>

            {/* Handles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16">
              <div>
                <div className="mb-4 md:mb-4 relative">
                  <div className="flex items-center justify-between border-b border-gray-700 mb-4 pb-1">
                    <span className="text-gray-400">Code forces handle</span>
                    <Button className="text-gray-400 p-0.5">
                      <X size={16} />
                    </Button>
                  </div>
                  <div
                    className="flex text-sm items-center text-white cursor-pointer my-2 transition-all duration-200 
               hover:bg-blue-800/50 hover:shadow-md rounded-lg py-2 px-4 mx-0
               border border-transparent hover:border-blue-500/30"
                    onClick={() => setLevelModalOpen(true)}
                  >
                    <span className="text-gray-200 group-hover:text-white">
                      Problems solved for each level{" "}
                    </span>
                    <span className="ml-auto text-blue-400 group-hover:text-white">
                      ▶
                    </span>
                  </div>

                  <div
                    className="flex text-sm items-center text-white cursor-pointer transition-all duration-200 
               hover:bg-blue-800/50 hover:shadow-md rounded-lg py-2 px-4 mx-0 
               border border-transparent hover:border-blue-500/30"
                    onClick={() => setProblemsModalOpen(true)}
                  >
                    <span className="text-gray-200 group-hover:text-white">
                      Problems solved for each Type of contests{" "}
                    </span>
                    <span className="ml-auto text-blue-400 group-hover:text-white">
                      ▶
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4 md:mb-2 relative">
                  <div className="flex items-center justify-between border-b border-gray-700 pb-1">
                    <span className="text-gray-400">AI Coder handle</span>
                    <Button className="text-gray-400 p-0.5">
                      <X size={16} />
                    </Button>
                  </div>
                  <div
                    className="flex  text-sm items-center text-white cursor-pointer transition-all my-2 duration-200 
               hover:bg-blue-800/50 hover:shadow-md rounded-lg py-2 px-4 mx-0 
               border border-transparent hover:border-blue-500/30"
                    onClick={() => setTagModalOpen(true)}
                  >
                    <span className="text-gray-200 group-hover:text-white">
                      Problems solved for each Tag{" "}
                    </span>
                    <span className="ml-auto text-blue-400 group-hover:text-white">
                      ▶
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
