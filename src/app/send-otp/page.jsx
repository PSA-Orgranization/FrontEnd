"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [Email, setEmail] = useState("");
  const router = useRouter();

  // On mount, get registration data from sessionStorage
  useEffect(() => {
    const regData = sessionStorage.getItem("registrationData");
    if (regData) {
      const parsed = JSON.parse(regData);
      setEmail(parsed.email);
    }
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }
    try {
      // 1. Verify OTP
      const otpFormData = new FormData();
      otpFormData.append("email", Email);
      otpFormData.append("otp", fullOtp);

      const verifyRes = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/otp/`,
        otpFormData
      );

      console.log("OTP Verification Response:", verifyRes);

      if (verifyRes.status === 200) {
        // 2. Get registration data from sessionStorage
        const regData = sessionStorage.getItem("registrationData");
        if (!regData) {
          toast.error("Registration data not found. Please register again.");
          router.push("/register");
          return;
        }
        const formData = JSON.parse(regData);
        // 3. Register user using FormData
        const registerFormData = new FormData();
        registerFormData.append("username", formData.username);
        registerFormData.append("email", formData.email);
        registerFormData.append("password", formData.password);
        registerFormData.append("first_name", formData.firstName);
        registerFormData.append("last_name", formData.lastName);
        const regRes = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register/`,
          registerFormData
        );
        if (regRes.status === 200) {
          toast.success("Registration successful! Please login.");
          sessionStorage.removeItem("registrationData");
          router.push("/login");
        } else {
          toast.error(regRes.data?.message || "Registration failed.");
        }
      } else {
        toast.error(verifyRes.data?.message || "Invalid OTP.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.message || "Error during registration."
        );
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div
        className="w-full max-w-sm rounded-4xl shadow-md p-8"
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
                className="w-10 h-10 border-2 border-gray-300 bg-white rounded-md text-center text-xl focus:border-blue-500 focus:outline-none"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ))}
          </div>

          <p className="text-white font-thin text-center mb-6">
            Please enter the OTP sent to your email
          </p>

          <div className="flex justify-center">
            <Button
              type="submit"
              className="text-white font-medium py-3 px-4"
              style={{ backgroundColor: "#438BD3" }}
            >
              Done
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
