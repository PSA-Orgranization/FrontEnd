// components/ProblemsLevelCard.jsx
import { X, ArrowLeft } from "lucide-react";
import Button from "./Button";

export default function ProblemsLevelCard({ isOpen, onClose, title }) {
  if (!isOpen) return null;

  // Sample data for problems solved by level
  const levelData = {
    // First column
    800: 5,
    900: 3,
    1000: 7,
    1100: 2,
    1200: 4,
    1300: 1,
    1400: 3,
    1500: 6,
    1600: 2,
    1700: 4,
    // Second column
    1800: 3,
    1900: 2,
    2000: 1,
    2100: 5,
    2200: 0,
    2300: 2,
    2400: 1,
    2500: 0,
    2600: 3,
    2700: 1,
    // Third column
    2800: 2,
    2900: 0,
    3000: 1,
    3100: 0,
    3200: 0,
    3300: 0,
    3400: 0,
    3500: 0,
  };

  // Function to render the levels in columns
  const renderLevels = () => {
    const levels = Object.keys(levelData);
    const itemsPerColumn = Math.ceil(levels.length / 3);

    const columns = [
      levels.slice(0, itemsPerColumn),
      levels.slice(itemsPerColumn, itemsPerColumn * 2),
      levels.slice(itemsPerColumn * 2),
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
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
      <div className="bg-[#041B2D] w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl md:rounded-lg shadow-lg overflow-y-auto">
        {/* Header - made sticky for mobile scrolling */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700 sticky top-0 bg-[#041B2D] z-10">
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
