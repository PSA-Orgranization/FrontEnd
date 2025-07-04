// components/ProblemsTagCard.jsx
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { authRequest } from "@/lib/utils";

export default function ProblemsTagCard({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [tagData, setTagData] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const cfHandle =
          typeof window !== "undefined"
            ? localStorage.getItem("cfHandle")
            : null;
        if (!cfHandle) {
          setError("No Codeforces handle found.");
          setLoading(false);
          return;
        }
        const res = await authRequest({
          method: "GET",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/oj_insights/cf/?handle=${cfHandle}`,
        });
        const json = res.data;
        if (json.status !== 200 || !json.data?.types)
          throw new Error(json.message || "Invalid response");
        setTagData(json.data.types);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOpen]);

  // Function to render the tags in responsive columns
  const renderTags = () => {
    // Filter out numeric keys
    const tags = Object.keys(tagData).filter((key) => isNaN(Number(key)));
    if (tags.length === 0) {
      return <div className="text-gray-300">No tag data available.</div>;
    }
    const itemsPerColumn = Math.ceil(tags.length / 2);
    const columns = [tags.slice(0, itemsPerColumn), tags.slice(itemsPerColumn)];
    return (
      <div className="grid grid-cols-1  sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="space-y-2 sm:space-y-3">
            {column.map((tag) => (
              <div key={tag} className="flex items-center space-x-1">
                <span className="text-gray-300 text-md sm:text-md">
                  {tag}:{" "}
                </span>
                <span className="text-gray-300 text-md sm:text-md">
                  {tagData[tag] ?? " "}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="min-h-[45vh] dark:bg-[#041B2D] bg-[#177AD6] md:dark:bg-[#041B2D] md:bg-[#177AD6] dark:bg-[linear-gradient(40deg,#000001_0%,#082540_75%,#ee4392_100%)] bg-[linear-gradient(40deg,#BAB8B8_0%,#0C5BA4_75%,#EE4392_100%)] md:dark:bg-none md:bg-none scrollbar-thin [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden w-full h-full md:h-auto md:max-h-[90vh] md:max-w-3xl md:rounded-lg shadow-lg overflow-y-auto">
        {/* Header - made sticky for mobile scrolling */}
        <div className="flex justify-between items-center px-4 py-3 border-b dark:border-gray-700 sticky top-0 z-10 dark:bg-[#0d2a3d] bg-[#2166b1] md:dark:bg-[#041B2D] md:bg-[#177AD6]">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white mr-2 sm:mr-3 cursor-pointer"
            >
              <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <h2 className="text-base sm:text-lg font-medium text-white">
              Problems solved for each tag
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 pb-6 sm:pb-8">
          {loading ? (
            <div className="text-center text-blue-400">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-400">{error}</div>
          ) : (
            renderTags()
          )}
        </div>
      </div>
    </div>
  );
}
