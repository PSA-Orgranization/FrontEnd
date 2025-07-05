"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send OTP to email
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/otp/`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      if (typeof window !== "undefined") {
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("resetPassword", "true");
      }
      router.push("/send-otp");
    } catch (err) {
      alert("Failed to send OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex justify-center mb-12 rounded-full p-8 py-10 dark:bg-[linear-gradient(40deg,#05203d_0%,#004e99_75%,#ee4392_100%)] bg-[linear-gradient(40deg,#BAB8B8_0%,#0C5BA4_75%,#EE4392_100%)]">
        <div className="">
          <Image
            src="/Logo.svg"
            alt="PSA Logo Light"
            width={196}
            height={196}
            priority
          />
        </div>
      </div>
      <div className="w-4/5 sm:w-full max-w-md py-7 px-4 sm:p-7 rounded-4xl text-white shadow-xl bg-[#1773C8] dark:bg-[#082540]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-center text-sm sm:text-xl font-medium mb-4">
            Enter your Email to reset the password
          </h2>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 sm:mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full py-2 px-3 sm:py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/80 bg-[#448CDD] dark:bg-[#1B3A5D]"
              // style={{ backgroundColor: "#1B3A5D" }}
              placeholder="Email"
              required
            />
          </div>

          <div className="text-center mt-8">
            <Button
              backGround="bg-blue-500"
              className="px-5 py-3 sm:px-8 sm:py-4 rounded-4xl text-lg sm:text-2xl w-8/12"
              style={{ backgroundColor: "#438BD3" }}
            >
              Check account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
