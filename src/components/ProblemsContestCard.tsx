// components/ProblemsContestCard.jsx
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { authRequest } from "../lib/utils";

export default function ProblemsContestCard({ isOpen, onClose }) {
  const [contestData, setContestData] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const cfHandle =
          typeof window !== "undefined"
            ? localStorage.getItem("cfHandle")
            : null;
        if (!cfHandle) {
          setError("No Codeforces handle found.");
          setContestData({});
          setLoading(false);
          return;
        }
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await authRequest({
          method: "GET",
          url: `${backendUrl}/api/profile/oj_insights/cf/`,
          params: { handle: cfHandle },
        });
        const contests = res.data?.data?.contests || {};
        setContestData(contests);
      } catch (err) {
        setError(
          "Verify your Codeforces handle or check your internet connection."
        );
        setContestData({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="min-h-[45vh] dark:bg-[#041B2D] bg-[#177AD6] md:dark:bg-[#041B2D] md:bg-[#177AD6] dark:bg-[linear-gradient(40deg,#000001_0%,#082540_75%,#ee4392_100%)] bg-[linear-gradient(40deg,#BAB8B8_0%,#0C5BA4_75%,#EE4392_100%)] md:dark:bg-none md:bg-none scrollbar-thin [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden w-full h-full md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-lg shadow-lg overflow-y-auto">
        {/* Header - made sticky for mobile scrolling */}
        <div className="flex items-center  px-4 py-3 border-b dark:border-gray-700  sticky top-0 z-10 dark:bg-[#0d2a3d] bg-[#2166b1] md:dark:bg-[#041B2D] md:bg-[#177AD6]">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white mr-3 cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-medium  text-white">
            Problems solved for each Type of contests
          </h2>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {loading ? (
            <div className="text-center text-blue-400">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-400">{error}</div>
          ) : !contestData || Object.keys(contestData).length === 0 ? (
            <div className="text-center text-gray-400">No data available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 md:gap-x-8">
              {Object.entries(contestData).map(([name, count]) => (
                <div key={name} className="text-gray-300 text-sm md:text-base">
                  {name}: {count}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
