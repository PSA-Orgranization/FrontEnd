import { Fustat } from "next/font/google";

const fustat = Fustat({
  weight: "600",
  subsets: ["latin"],
});

export default function Button({
  children,
  backGround = "bg-blue-950",
  className = "",
  ...props
}) {
  return (
    <button
      className={`${backGround} text-white tracking-wide rounded-3xl font-semibold text-2xl cursor-pointer transform transition-transform duration-200 hover:scale-105 ${className} ${fustat.className}`}
      {...props}
      // style={{ backgroundColor: "#438BD3" }}
    >
      {children}
    </button>
  );
}
