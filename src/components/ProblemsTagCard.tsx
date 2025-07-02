// components/ProblemsTagCard.jsx
import { ArrowLeft } from "lucide-react";

export default function ProblemsTagCard({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  // Sample data for problems solved by tag (matching the image)

  const tagData = {
    "2-sat": 0,
    "binary search": 0,
    bitmasks: 0,
    "brute force": 0,
    "chinese remainder theorem": 0,
    combinatorics: 0,
    "constructive algorithms": 0,
    "data structures": 0,
    "dfs and similar": 0,
    "divide and conquer": 0,
    dp: 0,
    dsu: 0,
    "expression parsing": 0,
    fft: 0,
    flows: 0,
    games: 0,
    geometry: 0,
    "graph matchings": 0,
    graphs: 0,
    greedy: 0,
    hashing: 0,
    implementation: 0,
    interactive: 0,
    math: 0,
    matrices: 0,
    "meet-in-the-middle": 0,
    "number theory": 0,
    probabilities: 0,
    schedules: 0,
    "shortest paths": 0,
    sortings: 0,
    "string suffix structures": 0,
    strings: 0,
    "ternary search": 0,
    trees: 0,
    "two pointers": 0,
  };

  // Function to render the tags in responsive columns
  const renderTags = () => {
    const tags = Object.keys(tagData);
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
                  {tagData[tag] || " "}
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
      <div className="dark:bg-[#041B2D] bg-[#177AD6] md:dark:bg-[#041B2D] md:bg-[#177AD6] dark:bg-[linear-gradient(40deg,#000001_0%,#082540_75%,#ee4392_100%)] bg-[linear-gradient(40deg,#BAB8B8_0%,#0C5BA4_75%,#EE4392_100%)] md:dark:bg-none md:bg-none scrollbar-thin [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden w-full h-full md:h-auto md:max-h-[90vh] md:max-w-3xl md:rounded-lg shadow-lg overflow-y-auto">
        {/* Header - made sticky for mobile scrolling */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b dark:border-gray-700 sticky top-0 z-10">
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
        <div className="p-4 sm:p-6 pb-6 sm:pb-8">{renderTags()}</div>
      </div>
    </div>
  );
}
