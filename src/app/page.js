import Link from "next/link";
import { Anta, Anuphan } from "next/font/google";
import Button from "@/components/Button";

const anta = Anta({
  weight: "400",
  subsets: ["latin"],
});

const anuphan = Anuphan({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden sm:bg-[url('/Background.svg')] bg-center">
      <div className="z-10 flex flex-col items-center">
        <div className="w-64 h-64 rounded-full flex items-center justify-center mb-8">
          <img src="/PSA-Logo.svg" alt="PSA Logo" className="w-64 h-64" />
        </div>
        <h1
          className={`text-9xl tracking-wider text-blue-200 mb-2 hidden sm:block ${anta.className}`}
        >
          PS<span className="text-pink-300">A</span>
        </h1>
        <h2
          className={`text-3xl text-blue-200 mb-12 tracking-widest text-center ${anuphan.className}`}
        >
          Problem Solving <span className="block text-pink-300">Assistant</span>
        </h2>
        {/* Buttons in a responsive layout */}
        <div className="flex flex-col sm:flex-row text-center space-y-8 sm:space-y-0 sm:space-x-4">
          <Link href="/login">
            <Button className="px-14 py-5 sm:px-12">Login</Button>
          </Link>
          <Link href="/register">
            <Button className="px-10 py-5">Register</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
