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
import type { ProfileCardProps } from "@/types/chat";
import { MdVerified } from "react-icons/md";

export default function ProfileCard({ isOpen, onClose }: ProfileCardProps) {
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
    cf: { id: null, handle: "", status: "Unverified" },
    atcoder: { id: null, handle: "", status: "Unverified" },
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
          cf: {
            id: cf ? cf.id : null,
            handle: finalCfHandle,
            status: cf ? cf.status || "Unverified" : "Unverified",
          },
          atcoder: {
            id: atcoder ? atcoder.id : null,
            handle: finalAtcoderHandle,
            status: atcoder ? atcoder.status || "Unverified" : "Unverified",
          },
        });
        setCfHandle(finalCfHandle);
        setCfHandleInput(finalCfHandle);
        setAtcoderHandle(finalAtcoderHandle);
        setAtcoderHandleInput(finalAtcoderHandle);
        setCfHandleVerified(cf ? cf.status === "Approved" : false);
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
  const [cfHandleVerified, setCfHandleVerified] = useState(false);

  // Verification state for Codeforces handle
  const [cfVerifyModalOpen, setCfVerifyModalOpen] = useState(false);
  const [cfVerifyLoading, setCfVerifyLoading] = useState(false);
  const [cfVerifyError, setCfVerifyError] = useState("");
  const [cfVerifyProblemLink, setCfVerifyProblemLink] = useState("");
  const [cfVerifyStep, setCfVerifyStep] = useState("instructions"); // 'instructions' | 'waiting' | 'done'
  const [cfVerifySuccess, setCfVerifySuccess] = useState("");
  const [cfVerifyingHandleId, setCfVerifyingHandleId] = useState(null);

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

      const accountId = res.data.data.account.id;
      setHandle(handleInput);
      setHandleSuccess("Handle saved successfully!");
      setHandleEditing(false);

      // Update problemSolvingAccounts with new id and handle
      setProblemSolvingAccounts((prev) => ({
        ...prev,
        [type]: {
          id: accountId,
          handle: handleInput,
          status:
            type === "cf"
              ? prev.cf?.status || "Unverified"
              : prev.atcoder?.status || "Unverified",
        },
      }));

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
        cf: { id: null, handle: "", status: "Unverified" },
        atcoder: { ...prev.atcoder },
      }));
      setCfHandle("");
      setCfHandleInput("");
      setCfHandleVerified(false); // Reset verified status on deletion
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
        atcoder: { id: null, handle: "", status: "Unverified" },
        cf: { ...prev.cf },
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

  // Codeforces handle verification logic
  const handleStartCfVerification = async () => {
    setCfVerifyLoading(true);
    setCfVerifyError("");
    setCfVerifySuccess("");
    setCfVerifyStep("instructions");
    setCfVerifyProblemLink("");
    const handleId = problemSolvingAccounts.cf.id;
    setCfVerifyingHandleId(handleId);
    try {
      const res = await authRequest({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/verify_handle/${handleId}/`,
      });
      const problemLink = res.data.data.problem.problem_link;
      setCfVerifyProblemLink(problemLink);
      setCfVerifyModalOpen(true);
    } catch (err) {
      setCfVerifyError("Failed to start verification. Try again later.");
    } finally {
      setCfVerifyLoading(false);
    }
  };

  const handleSubmitCfVerification = async () => {
    setCfVerifyLoading(true);
    setCfVerifyError("");
    setCfVerifySuccess("");
    try {
      const res = await authRequest({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/verify_handle/${cfVerifyingHandleId}/`,
      });
      // console.log("Verification response:", res);
      setCfVerifyStep("done");
      setCfVerifySuccess("Your Codeforces account has been verified!");
      setCfHandleVerified(true);
      setProblemSolvingAccounts((prev) => ({
        ...prev,
        cf: {
          ...prev.cf,
          status: "Verified",
        },
      }));
      // Optionally update state to reflect verified status
    } catch (err) {
      setCfVerifyError("Verification failed. Please try again.");
    } finally {
      setCfVerifyLoading(false);
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
                              {cfHandleVerified ? (
                                <span
                                  className="p-1 dark:text-blue-500"
                                  title="Verified"
                                >
                                  <MdVerified size={18} />
                                </span>
                              ) : (
                                <button
                                  onClick={handleStartCfVerification}
                                  className="py-1 px-2 rounded-full dark:text-blue-400 dark:border-blue-400 text-white border border-white hover:scale-105 transition text-sm cursor-pointer"
                                  disabled={
                                    cfVerifyLoading ||
                                    !problemSolvingAccounts.cf.id
                                  }
                                  title="Verify Codeforces handle"
                                >
                                  Verify
                                </button>
                              )}
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

                  {atcoderHandleError && (
                    <div className="text-red-400 text-xs mb-1">
                      {atcoderHandleError}
                    </div>
                  )}
                  {atcoderHandleLoading && (
                    <div className="text-blue-400 text-xs mb-1">Saving...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Codeforces Verification Modal */}
      {cfVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#041B2D] rounded-lg shadow-lg p-6 w-full max-w-md border border-blue-400">
            <h3 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-300">
              Verify Codeforces Handle
            </h3>
            {cfVerifyError && (
              <div className="text-red-500 mb-2">{cfVerifyError}</div>
            )}
            {cfVerifyStep === "instructions" && cfVerifyProblemLink && (
              <>
                <p className="mb-3 text-gray-800 dark:text-gray-200">
                  To verify your Codeforces account, please:
                </p>
                <ol className="list-decimal list-inside mb-3 text-gray-700 dark:text-gray-300">
                  <li>
                    Go to this problem and submit a{" "}
                    <span className="font-semibold">compilation error</span>:
                  </li>
                </ol>
                <a
                  href={cfVerifyProblemLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mb-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Go to Problem
                </a>
                <div className="mb-2 text-gray-600 dark:text-gray-400 text-sm">
                  After submitting a compilation error, return here and click
                  the button below.
                </div>
                <button
                  onClick={() => setCfVerifyStep("waiting")}
                  className="w-full px-4 py-2 bg-green-600 cursor-pointer text-white rounded hover:bg-green-700 transition mb-2"
                >
                  I submitted a compilation error
                </button>
              </>
            )}
            {cfVerifyStep === "waiting" && (
              <>
                <div className="mb-3 text-gray-800 dark:text-gray-200">
                  Click the button below to complete verification.
                </div>
                <button
                  onClick={handleSubmitCfVerification}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-2 cursor-pointer"
                  disabled={cfVerifyLoading}
                >
                  {cfVerifyLoading ? "Verifying..." : "Complete Verification"}
                </button>
                <button
                  onClick={() => setCfVerifyStep("instructions")}
                  className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition cursor-pointer"
                >
                  Back
                </button>
              </>
            )}
            {cfVerifyStep === "done" && (
              <>
                <div className="mb-3 text-green-600 dark:text-green-400 font-semibold">
                  {cfVerifySuccess}
                </div>
                <button
                  onClick={() => setCfVerifyModalOpen(false)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
