"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle logic here

    router.push("/reset-password");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex justify-center mb-12">
        <Image src="/PSA-Logo.svg" alt="PSA Logo" width={208} height={208} />
      </div>
      <div
        className="w-4/5 sm:w-full max-w-md py-7 px-4 sm:p-7 rounded-4xl text-white shadow-xl"
        style={{ backgroundColor: "#082540" }}
      >
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
              className="w-full py-2 px-3 sm:py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/80"
              style={{ backgroundColor: "#1B3A5D" }}
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
