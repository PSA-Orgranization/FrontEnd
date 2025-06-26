"use client";
import Link from "next/link";
import { Anta, Anuphan } from "next/font/google";
import Button from "@/components/Button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const anta = Anta({
  weight: "400",
  subsets: ["latin"],
});

const anuphan = Anuphan({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();

  // Function to clear authentication-related localStorage items
  const clearAuthStorage = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const access = localStorage.getItem("access_token");
      const refresh = localStorage.getItem("refresh_token");
      if (!access || !refresh) {
        // No tokens, stay on home
        return;
      }
      try {
        // Check if access token is valid
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/is_auth/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        // If valid, redirect to chat
        router.push("/chat");
      } catch (err) {
        // If access token is expired, try to refresh
        if (err.response && err.response.status === 401) {
          try {
            const refreshRes = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh_token/`,
              { refresh },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (
              refreshRes.status === 200 &&
              refreshRes.data &&
              refreshRes.data.access
            ) {
              // Save new access token and redirect
              localStorage.setItem("access_token", refreshRes.data.access);
              router.push("/chat");
            } else {
              // Refresh failed, stay on home
              return;
            }
          } catch (refreshErr) {
            // If refresh token is expired (401), stay on home

            if (
              refreshErr.response &&
              refreshErr.response.status === 401 &&
              refreshErr.response.data &&
              refreshErr.response.data.detail === "Token is invalid"
            ) {
              clearAuthStorage();
              return;
            }
          }
        }
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden sm:bg-[url('/Background.svg')] bg-center">
      <div className="z-10 flex flex-col items-center pb-10">
        <div className="w-64 h-64 rounded-full flex items-center justify-center mb-8">
          <img src="/PSA-Logo.svg" alt="PSA Logo" className="w-52 h-52" />
        </div>
        <h1
          className={`text-9xl tracking-wider text-blue-200 mb-2 hidden sm:block ${anta.className}`}
        >
          PS<span className="text-pink-300">A</span>
        </h1>
        <h2
          className={`text-2xl text-blue-200 mb-12 tracking-widest text-center ${anuphan.className}`}
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
