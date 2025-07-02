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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="dark:bg-[#041B2D] bg-[#177AD6] md:dark:bg-[#041B2D] md:bg-[#177AD6] dark:bg-[linear-gradient(40deg,#000001_0%,#082540_75%,#ee4392_100%)] bg-[linear-gradient(40deg,#BAB8B8_0%,#0C5BA4_75%,#EE4392_100%)] md:dark:bg-none md:bg-none scrollbar-thin [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden w-full h-full md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-lg shadow-lg overflow-y-auto">
        {/* Header - made sticky for mobile scrolling */}
        <div className="flex items-center  px-4 py-3 border-b dark:border-gray-700  sticky top-0 z-10 dark:bg-[#041B2D] bg-[#448CDD] md:dark:bg-[#041B2D] md:bg-[#177AD6]">
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
          {contestData.map((contest) => (
            <div key={contest.name} className="mb-6 md:mb-8">
              <h3 className="text-white text-md mb-3 md:mb-4">
                {contest.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 md:gap-x-8">
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
