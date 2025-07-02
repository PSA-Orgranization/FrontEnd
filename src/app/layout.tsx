"use client";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      } else {
        setTheme("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  };

  return (
    <html lang="en">
      <body className="dark:bg-[linear-gradient(40deg,#000001_0%,#082540_75%,#ee4392_100%)] bg-[linear-gradient(40deg,#BAB8B8_0%,#0C5BA4_75%,#EE4392_100%)] relative">
        <button
          onClick={toggleTheme}
          className="fixed top-4.5 right-4 rounded-full transition-transform hover:scale-110 z-40"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <MdLightMode size={28} className="text-yellow-400 cursor-pointer" />
          ) : (
            <MdDarkMode size={28} className="text-blue-900 cursor-pointer" />
          )}
        </button>
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
