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
import Cookies from "js-cookie";
import { clearAuthStorage } from "../lib/utils";

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

  const handleLogout = (e) => {
    e.preventDefault();
    clearAuthStorage();
    router.push("/");
  };

  // Handles state for problem solving accounts
  const [problemSolvingAccounts, setProblemSolvingAccounts] = useState({
    cf: { id: null, handle: "" },
    atcoder: { id: null, handle: "" },
  });
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setAccountsLoading(true);
    setAccountsError("");
    const accountsPromise = authRequest({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/problem_solving_accounts/`,
    });
    accountsPromise
      .then((res) => {
        const accounts = res.data.data || [];
        const cf = accounts.find(
          (acc) => acc.account_type.account_type === "cf"
        );
        const atcoder = accounts.find(
          (acc) => acc.account_type.account_type === "atcoder"
        );
        // Prefer localStorage if present
        let localCfHandle = null;
        let localAtcoderHandle = null;
        if (typeof window !== "undefined") {
          localCfHandle = localStorage.getItem("cfHandle");
          localAtcoderHandle = localStorage.getItem("atcoderHandle");
        }
        const finalCfHandle = localCfHandle ?? (cf ? cf.handle : "");
        const finalAtcoderHandle =
          localAtcoderHandle ?? (atcoder ? atcoder.handle : "");
        setProblemSolvingAccounts({
          cf: { id: cf ? cf.id : null, handle: finalCfHandle },
          atcoder: {
            id: atcoder ? atcoder.id : null,
            handle: finalAtcoderHandle,
          },
        });
        setCfHandle(finalCfHandle);
        setCfHandleInput(finalCfHandle);
        setAtcoderHandle(finalAtcoderHandle);
        setAtcoderHandleInput(finalAtcoderHandle);
        // Save to localStorage to keep in sync
        if (typeof window !== "undefined") {
          localStorage.setItem("cfHandle", finalCfHandle);
          localStorage.setItem("atcoderHandle", finalAtcoderHandle);
        }
      })
      .catch((err) => {
        let message = "Failed to load accounts";
        if (err?.response?.data?.message) {
          message = err.response.data.message;
        } else if (err?.message) {
          message = err.message;
        }
        setAccountsError(message);
      })
      .finally(() => setAccountsLoading(false));
  }, [isOpen]);

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

  // Generic save handle function
  const handleSaveHandle = async (
    type,
    handleInput,
    setHandle,
    setHandleSuccess,
    setHandleError,
    setHandleLoading,
    setHandleEditing
  ) => {
    setHandleLoading(true);
    setHandleError("");
    setHandleSuccess("");

    try {
      const res = await authRequest({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/add_handle/`,
        data: { handle: handleInput, account_type: type },
        headers: { "Content-Type": "application/json" },
      });

      setHandle(handleInput);
      setHandleSuccess("Handle saved successfully!");
      setHandleEditing(false);
      // Save to localStorage
      if (typeof window !== "undefined") {
        if (type === "cf") {
          localStorage.setItem("cfHandle", handleInput);
        } else if (type === "atcoder") {
          localStorage.setItem("atcoderHandle", handleInput);
        }
      }
    } catch (err) {
      console.log(err);
      let message = "Error saving handle";
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      }
      setHandleError(message);
    } finally {
      setHandleLoading(false);
    }
  };

  // Save Codeforces handle
  const handleSaveCfHandle = async () => {
    await handleSaveHandle(
      "cf",
      cfHandleInput,
      setCfHandle,
      setCfHandleSuccess,
      setCfHandleError,
      setCfHandleLoading,
      setCfHandleEditing
    );
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
      const id = problemSolvingAccounts.cf.id;
      if (!id) throw new Error("No Codeforces account to delete");
      await authRequest({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/problem_solving_account/${id}/`,
      });
      setProblemSolvingAccounts((prev) => ({
        ...prev,
        cf: { id: null, handle: "" },
      }));
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

  // Save AtCoder handle
  const handleSaveAtcoderHandle = async () => {
    await handleSaveHandle(
      "atcoder",
      atcoderHandleInput,
      setAtcoderHandle,
      setAtcoderHandleSuccess,
      setAtcoderHandleError,
      setAtcoderHandleLoading,
      setAtcoderHandleEditing
    );
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
      const id = problemSolvingAccounts.atcoder.id;
      if (!id) throw new Error("No AtCoder account to delete");
      await authRequest({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/problem_solving_account/${id}/`,
      });
      setProblemSolvingAccounts((prev) => ({
        ...prev,
        atcoder: { id: null, handle: "" },
      }));
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

      <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-40 ">
        <div className="dark:bg-[#041B2D] bg-[#177AD6] md:dark:bg-[#041B2D] md:bg-[#177AD6] dark:bg-[linear-gradient(40deg,#000001_0%,#082540_75%,#ee4392_100%)] bg-[linear-gradient(40deg,#BAB8B8_0%,#0C5BA4_75%,#EE4392_100%)] md:dark:bg-none md:bg-none scrollbar-thin [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden w-full h-full md:h-auto md:max-h-[90vh] md:max-w-3xl md:rounded-lg shadow-lg overflow-y-auto">
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
          <div className="p-4 md:p-8  border-gray-800">
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
                      className={`dark:bg-gray-800 bg-[#1773C8] text-white rounded px-2 py-1 flex-1 outline-none border transition ${
                        cfHandleEditing
                          ? "border-gray-700 focus:border-blue-500"
                          : "border-blue-500 focus:border-blue-400"
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
                    className="flex text-sm  items-center text-white cursor-pointer transition-all duration-200 
                 hover:bg-blue-800/50 hover:shadow-md rounded-lg py-2 px-4 mx-0 
                 border border-transparent hover:border-blue-500/30"
                    onClick={() => setProblemsModalOpen(true)}
                  >
                    <span className="text-gray-200  group-hover:text-white">
                      Problems solved for each Type of contests{" "}
                    </span>
                    <span className="ml-auto text-blue-400 group-hover:text-white">
                      ▶
                    </span>
                  </div>

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

              <div>
                <div className="mb-4 md:mb-2 relative">
                  {/* <div className="flex items-center justify-between border-b border-gray-700 pb-1">
                    <span className="text-gray-400">AtCoder handle</span>
                  </div> */}

                  {/* AtCoder Handle Input */}
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      className={`dark:bg-gray-800 bg-[#1773C8] text-white rounded px-2 py-1 flex-1 outline-none border transition ${
                        atcoderHandleEditing
                          ? "border-gray-700 focus:border-blue-500"
                          : "border-blue-500 focus:border-blue-400"
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

                  {/* <div
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
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
