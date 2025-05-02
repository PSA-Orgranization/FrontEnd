// components/ProblemsContestCard.jsx
import { ArrowLeft } from "lucide-react";

export default function ProblemsContestCard({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Sample data for problems solved by contest type
  const contestData = [
    {
      name: "AtCoder Beginner Contest :-",
      problems: [
        "Problem A: 1",
        "Problem B: 2",
        "Problem C: 3",
        "Problem D: 4",
        "Problem E: 5",
        "Problem F: 6",
        "Problem G: 7",
        "Problem H: 8",
      ],
    },
    {
      name: "AtCoder Grand Contest :-",
      problems: [
        "Problem A: 1",
        "Problem B: 2",
        "Problem C: 3",
        "Problem D: 4",
        "Problem E: 5",
        "Problem F: 6",
      ],
    },
    {
      name: "AtCoder Regular Contest :-",
      problems: [
        "Problem A: 1",
        "Problem B: 2",
        "Problem C: 3",
        "Problem D: 4",
        "Problem E: 5",
        "Problem F: 6",
      ],
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20">
      <div className="bg-[#041B2D] w-full h-full md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-lg shadow-lg overflow-y-auto">
        {/* Header - made sticky for mobile scrolling */}
        <div className="flex items-center px-4 md:px-6 py-4 border-b border-gray-700 sticky top-0 bg-[#041B2D] z-10">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white mr-3 cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-medium text-white">
            Problems solved for each Type of contests
          </h2>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {contestData.map((contest) => (
            <div key={contest.name} className="mb-6 md:mb-8">
              <h3 className="text-white text-md mb-3 md:mb-4">
                {contest.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 md:gap-x-8">
                {contest.problems.map((problem) => (
                  <div
                    key={problem}
                    className="text-gray-300 text-sm md:text-base"
                  >
                    {problem}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
