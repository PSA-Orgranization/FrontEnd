import { X, LogOut, Edit, Check, Trash, Plus, UserCircle } from "lucide-react";
import Button from "./Button";
import ProblemsLevelCard from "./ProblemsLevelCard";
import { useState, useEffect, useRef } from "react";
import ProblemsContestCard from "./ProblemsContestCard";
import ProblemsTagCard from "./ProblemsTagCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authRequest } from "../lib/utils";
import { AiOutlineProfile } from "react-icons/ai";

export default function ProfileCard({ isOpen, onClose, user }) {
  const [problemsModalOpen, setProblemsModalOpen] = useState(false);
  const [levelModalOpen, setLevelModalOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const router = useRouter();

  // Get username and email from localStorage
  const userData = {
    username:
      typeof window !== "undefined" ? localStorage.getItem("username") : "",
    email: typeof window !== "undefined" ? localStorage.getItem("email") : "",
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
    router.push("/");
  };

  // Handles state for Codeforces handle
  const [cfHandle, setCfHandle] = useState("");
  const [cfHandleInput, setCfHandleInput] = useState("");
  const [cfHandleLoading, setCfHandleLoading] = useState(false);
  const [cfHandleError, setCfHandleError] = useState("");
  const [cfHandleSuccess, setCfHandleSuccess] = useState("");
  const [cfHandleEditing, setCfHandleEditing] = useState(false);
  const [cfHandleDeleting, setCfHandleDeleting] = useState(false);

  // Add refs for input focus
  const cfHandleInputRef = useRef(null);

  // Load current handle if available (from user prop or localStorage)
  useEffect(() => {
    if (user && user.cfHandle) {
      setCfHandle(user.cfHandle);
      setCfHandleInput(user.cfHandle);
    } else if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cfHandle");
      if (stored) {
        setCfHandle(stored);
        setCfHandleInput(stored);
      }
    }
  }, [user]);

  // Save Codeforces handle
  const handleSaveCfHandle = async () => {
    setCfHandleLoading(true);
    setCfHandleError("");
    setCfHandleSuccess("");
    try {
      const res = await authRequest({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/add_cf_handle/`,
        data: { handle: cfHandleInput },
        headers: { "Content-Type": "application/json" },
      });
      setCfHandle(cfHandleInput);
      setCfHandleSuccess("Handle saved successfully!");
      setCfHandleEditing(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("cfHandle", cfHandleInput);
      }
    } catch (err) {
      let message = "Error saving handle";
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      }
      setCfHandleError(message);
    } finally {
      setCfHandleLoading(false);
    }
  };

  const handleCfHandleEdit = () => {
    setCfHandleEditing(true);
    setCfHandleError("");
    setCfHandleSuccess("");
    setTimeout(() => {
      if (cfHandleInputRef.current) {
        cfHandleInputRef.current.focus();
      }
    }, 0);
  };

  const handleCfHandleCancel = () => {
    setCfHandleEditing(false);
    setCfHandleInput(cfHandle); // Reset to original value
    setCfHandleError("");
    setCfHandleSuccess("");
  };

  // Add delete logic for Codeforces handle
  const handleDeleteCfHandle = async () => {
    setCfHandleDeleting(true);
    setCfHandleError("");
    setCfHandleSuccess("");
    try {
      // Optionally call backend to delete handle here
      setCfHandle("");
      setCfHandleInput("");
      if (typeof window !== "undefined") {
        localStorage.removeItem("cfHandle");
      }
    } catch (err) {
      setCfHandleError("Failed to delete handle");
    } finally {
      setCfHandleDeleting(false);
    }
  };

  // Handles state for AtCoder handle
  const [atcoderHandle, setAtcoderHandle] = useState("");
  const [atcoderHandleInput, setAtcoderHandleInput] = useState("");
  const [atcoderHandleLoading, setAtcoderHandleLoading] = useState(false);
  const [atcoderHandleError, setAtcoderHandleError] = useState("");
  const [atcoderHandleSuccess, setAtcoderHandleSuccess] = useState("");
  const [atcoderHandleEditing, setAtcoderHandleEditing] = useState(false);
  const [atcoderHandleDeleting, setAtcoderHandleDeleting] = useState(false);

  // Add refs for input focus
  const atcoderHandleInputRef = useRef(null);

  useEffect(() => {
    if (user && user.atcoderHandle) {
      setAtcoderHandle(user.atcoderHandle);
      setAtcoderHandleInput(user.atcoderHandle);
    } else if (typeof window !== "undefined") {
      const stored = localStorage.getItem("atcoderHandle");
      if (stored) {
        setAtcoderHandle(stored);
        setAtcoderHandleInput(stored);
      }
    }
  }, [user]);

  // Save AtCoder handle
  const handleSaveAtcoderHandle = async () => {
    setAtcoderHandleLoading(true);
    setAtcoderHandleError("");
    setAtcoderHandleSuccess("");
    try {
      const res = await authRequest({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/add_atcoder_handle/`,
        data: { handle: atcoderHandleInput },
        headers: { "Content-Type": "application/json" },
      });
      setAtcoderHandle(atcoderHandleInput);
      setAtcoderHandleSuccess("Handle saved successfully!");
      setAtcoderHandleEditing(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("atcoderHandle", atcoderHandleInput);
      }
    } catch (err) {
      let message = "Error saving handle";
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      }
      setAtcoderHandleError(message);
    } finally {
      setAtcoderHandleLoading(false);
    }
  };

  const handleAtcoderHandleEdit = () => {
    setAtcoderHandleEditing(true);
    setAtcoderHandleError("");
    setAtcoderHandleSuccess("");
    setTimeout(() => {
      if (atcoderHandleInputRef.current) {
        atcoderHandleInputRef.current.focus();
      }
    }, 0);
  };

  const handleAtcoderHandleCancel = () => {
    setAtcoderHandleEditing(false);
    setAtcoderHandleInput(atcoderHandle); // Reset to original value
    setAtcoderHandleError("");
    setAtcoderHandleSuccess("");
  };

  // Add delete logic for AtCoder handle
  const handleDeleteAtcoderHandle = async () => {
    setAtcoderHandleDeleting(true);
    setAtcoderHandleError("");
    setAtcoderHandleSuccess("");
    try {
      // Optionally call backend to delete handle here
      setAtcoderHandle("");
      setAtcoderHandleInput("");
      if (typeof window !== "undefined") {
        localStorage.removeItem("atcoderHandle");
      }
    } catch (err) {
      setAtcoderHandleError("Failed to delete handle");
    } finally {
      setAtcoderHandleDeleting(false);
    }
  };

  return !isOpen ? null : (
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

      <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-10 ">
        <div className="bg-[#041B2D] scrollbar-thin [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden w-full h-full md:h-auto md:max-h-[90vh] md:max-w-3xl md:rounded-lg shadow-lg overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center px-4 md:px-8 py-5 border-b border-white-400 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="hidden md:block p-2 bg-blue-900/20 rounded-lg">
                <UserCircle size={20} className="text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Profile</h2>
            </div>
            <Button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
            >
              <X size={18} />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 md:p-8 border-b border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <div className="flex items-center mb-1">
                  <h3 className="text-lg font-medium text-white">
                    {userData.username || "User"}
                  </h3>
                  <Link href="/" onClick={handleLogout}>
                    <LogOut
                      size={16}
                      className="ml-2 text-gray-400 hover:text-white cursor-pointer"
                    />
                  </Link>
                </div>
                <p className="text-sm text-gray-400">
                  {userData.email || "Email not found"}
                </p>
              </div>
            </div>

            {/* Handles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16">
              <div>
                <div className="mb-4 md:mb-4 relative">
                  {/* <div className="flex items-center justify-between border-b border-gray-700 mb-4 pb-1">
                    <span className="text-gray-400">Code forces handle</span>
                  </div> */}

                  {/* Codeforces Handle Input */}
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      className={`bg-gray-800 text-white rounded px-2 py-1 flex-1 outline-none border transition ${
                        cfHandleEditing
                          ? "border-blue-500 focus:border-blue-400"
                          : "border-gray-700 focus:border-blue-500"
                      } ${
                        !cfHandleEditing && cfHandle ? "cursor-default" : ""
                      }`}
                      placeholder="Enter Codeforces handle"
                      value={cfHandleInput}
                      onChange={(e) => setCfHandleInput(e.target.value)}
                      disabled={cfHandleLoading || !cfHandleEditing}
                      readOnly={!cfHandleEditing}
                      style={{ minWidth: 0 }}
                      ref={cfHandleInputRef}
                    />

                    {/* Action Icons */}
                    <div className="flex items-center gap-1">
                      {cfHandleEditing ? (
                        <>
                          <button
                            onClick={handleSaveCfHandle}
                            disabled={cfHandleLoading || !cfHandleInput.trim()}
                            className="p-1 rounded text-green-500 hover:text-green-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Save handle"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={handleCfHandleCancel}
                            disabled={cfHandleLoading}
                            className="p-1 rounded text-red-500 hover:text-red-400 cursor-pointer disabled:opacity-50"
                            title="Cancel edit"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          {!cfHandleEditing && cfHandle && (
                            <>
                              <button
                                onClick={handleCfHandleEdit}
                                className="p-1 rounded text-blue-500 hover:text-blue-400 cursor-pointer"
                                title="Edit handle"
                                disabled={cfHandleDeleting}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={handleDeleteCfHandle}
                                className="p-1 rounded text-red-500 hover:text-red-400 cursor-pointer"
                                title="Delete handle"
                                disabled={cfHandleDeleting}
                              >
                                <Trash size={16} />
                              </button>
                            </>
                          )}
                          {!cfHandleEditing && !cfHandle && (
                            <button
                              onClick={handleCfHandleEdit}
                              className="p-1 rounded text-green-500 hover:text-green-400 cursor-pointer"
                              title="Add handle"
                              disabled={cfHandleDeleting}
                            >
                              <Plus size={16} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* {cfHandle && !cfHandleEditing && (
                    <div className="text-xs text-gray-400 mb-1">
                      Current: <span className="text-blue-400">{cfHandle}</span>
                    </div>
                  )}
                  {cfHandleSuccess && (
                    <div className="text-green-400 text-xs mb-1">
                      {cfHandleSuccess}
                    </div>
                  )} */}
                  {cfHandleError && (
                    <div className="text-red-400 text-xs mb-1">
                      {cfHandleError}
                    </div>
                  )}
                  {cfHandleLoading && (
                    <div className="text-blue-400 text-xs mb-1">Saving...</div>
                  )}

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
                  {/* <div className="flex items-center justify-between border-b border-gray-700 pb-1">
                    <span className="text-gray-400">AtCoder handle</span>
                  </div> */}

                  {/* AtCoder Handle Input */}
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      className={`bg-gray-800 text-white rounded px-2 py-1 flex-1 outline-none border transition ${
                        atcoderHandleEditing
                          ? "border-blue-500 focus:border-blue-400"
                          : "border-gray-700 focus:border-blue-500"
                      } ${
                        !atcoderHandleEditing && atcoderHandle
                          ? "cursor-default"
                          : ""
                      }`}
                      placeholder="Enter AtCoder handle"
                      value={atcoderHandleInput}
                      onChange={(e) => setAtcoderHandleInput(e.target.value)}
                      disabled={atcoderHandleLoading || !atcoderHandleEditing}
                      readOnly={!atcoderHandleEditing}
                      style={{ minWidth: 0 }}
                      ref={atcoderHandleInputRef}
                    />

                    {/* Action Icons */}
                    <div className="flex items-center gap-1">
                      {atcoderHandleEditing ? (
                        <>
                          <button
                            onClick={handleSaveAtcoderHandle}
                            disabled={
                              atcoderHandleLoading || !atcoderHandleInput.trim()
                            }
                            className="p-1 rounded text-green-500 hover:text-green-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Save handle"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={handleAtcoderHandleCancel}
                            disabled={atcoderHandleLoading}
                            className="p-1 rounded text-red-500 hover:text-red-400 cursor-pointer disabled:opacity-50"
                            title="Cancel edit"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          {!atcoderHandleEditing && atcoderHandle && (
                            <>
                              <button
                                onClick={handleAtcoderHandleEdit}
                                className="p-1 rounded text-blue-500 hover:text-blue-400 cursor-pointer"
                                title="Edit handle"
                                disabled={atcoderHandleDeleting}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={handleDeleteAtcoderHandle}
                                className="p-1 rounded text-red-500 hover:text-red-400 cursor-pointer"
                                title="Delete handle"
                                disabled={atcoderHandleDeleting}
                              >
                                <Trash size={16} />
                              </button>
                            </>
                          )}
                          {!atcoderHandleEditing && !atcoderHandle && (
                            <button
                              onClick={handleAtcoderHandleEdit}
                              className="p-1 rounded text-green-500 hover:text-green-400 cursor-pointer"
                              title="Add handle"
                              disabled={atcoderHandleDeleting}
                            >
                              <Plus size={16} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* {atcoderHandle && !atcoderHandleEditing && (
                    <div className="text-xs text-gray-400 mb-1">
                      Current:{" "}
                      <span className="text-blue-400">{atcoderHandle}</span>
                    </div>
                  )}
                  {atcoderHandleSuccess && (
                    <div className="text-green-400 text-xs mb-1">
                      {atcoderHandleSuccess}
                    </div>
                  )} */}
                  {atcoderHandleError && (
                    <div className="text-red-400 text-xs mb-1">
                      {atcoderHandleError}
                    </div>
                  )}
                  {atcoderHandleLoading && (
                    <div className="text-blue-400 text-xs mb-1">Saving...</div>
                  )}

                  <div
                    className="flex text-sm items-center text-white cursor-pointer my-2 transition-all duration-200 
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
