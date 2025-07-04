// components/ProblemsLevelCard.jsx
import { X, ArrowLeft } from "lucide-react";
import Button from "./Button";
import { useEffect, useState } from "react";
import { authRequest } from "../lib/utils";

export default function ProblemsLevelCard({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [levelData, setLevelData] = useState<{ [key: string]: number }>({});
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
          setLevelData({});
          setLoading(false);
          return;
        }

        const res = await authRequest({
          method: "GET",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/oj_insights/cf/`,
          params: { handle: cfHandle },
        });
        // Extract only numeric keys from types
        const types = res.data?.data?.types || {};
        const numericRates: { [key: string]: number } = {};
        Object.keys(types).forEach((key) => {
          if (!isNaN(Number(key))) {
            numericRates[key] = types[key];
          }
        });
        setLevelData(numericRates);
      } catch (err: any) {
        setError(
          "Verify your Codeforces handle or check your internet connection."
        );
        setLevelData({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOpen]);

  if (!isOpen) return null;

  // Function to render the levels in columns
  const renderLevels = () => {
    if (loading) {
      return <div className="text-center text-blue-400">Loading...</div>;
    }
    if (error) {
      return <div className="text-center text-red-400">{error}</div>;
    }
    if (!levelData || Object.keys(levelData).length === 0) {
      return (
        <div className="text-center text-gray-400">No data available.</div>
      );
    }
    const levels = Object.keys(levelData).filter((key) => !isNaN(Number(key)));
    levels.sort((a, b) => Number(a) - Number(b));
    // Split levels into 2 columns for flexibility
    const itemsPerColumn = Math.ceil(levels.length / 2);
    const columns = [
      levels.slice(0, itemsPerColumn),
      levels.slice(itemsPerColumn),
    ];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="space-y-2 md:space-y-3">
            {column.map((level) => (
              <div key={level} className="flex justify-start space-x-2">
                <span className="text-gray-300 text-md md:text-base">
                  {level} :
                </span>
                <span className="text-gray-300 text-md md:text-base">
                  {levelData[level]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="dark:bg-[#041B2D] bg-[#177AD6] md:dark:bg-[#041B2D] md:bg-[#177AD6] dark:bg-[linear-gradient(40deg,#000001_0%,#082540_75%,#ee4392_100%)] bg-[linear-gradient(40deg,#BAB8B8_0%,#0C5BA4_75%,#EE4392_100%)] md:dark:bg-none md:bg-none scrollbar-thin [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden w-full h-full md:h-auto md:max-h-[90vh] md:max-w-3xl md:rounded-lg overflow-y-auto min-h-[45vh]">
        {/* Header - made sticky for mobile scrolling */}
        <div className="flex justify-between items-center px-4 py-3 border-b dark:border-gray-700 sticky top-0 z-10 dark:bg-[#0d2a3d] bg-[#2166b1] md:dark:bg-[#041B2D] md:bg-[#177AD6]">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white mr-2 cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-md font-medium text-white">
              Problems solved for each level
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">{renderLevels()}</div>
      </div>
    </div>
  );
}
