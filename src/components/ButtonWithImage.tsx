import { Fustat } from "next/font/google";

const fustat = Fustat({
  weight: "600",
  subsets: ["latin"],
});

export default function ButtonWithImage({
    backGround = "bg-blue-950",
    imageSrc = "",
    className = "",
    ...props
}) {
  return (
    <button
      className={`flex items-center text-white tracking-wide rounded-3xl font-semibold text-2xl cursor-pointer transform transition-transform duration-200 hover:scale-105 ${className} ${fustat.className}`}
      {...props}
    >
      {imageSrc && (
        <img src={imageSrc} alt="icon" className="w-12 h-12" />
      )}
    </button>
  );
}
