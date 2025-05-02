"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("user@example.com"); // Pre-filled with example

  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    console.log("Submitted OTP:", fullOtp);
    // Add your OTP verification logic here
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div
        className="w-full max-w-md rounded-4xl shadow-md p-8"
        style={{ backgroundColor: "#082540" }}
      >
        <h1 className="text-2xl font-bold text-center text-white mb-6">OTP</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-12 h-12 border-2 border-gray-300 bg-white rounded-md text-center text-xl focus:border-blue-500 focus:outline-none"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ))}
          </div>

          <p className="text-white font-thin text-center mb-6">
            Please enter the OTP sent to your email
          </p>

          <div className="flex justify-center">
            <Link href="/chat">
              <Button
                type="submit"
                className="text-white font-medium py-3 px-4"
                style={{ backgroundColor: "#438BD3" }}
              >
                Done
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
