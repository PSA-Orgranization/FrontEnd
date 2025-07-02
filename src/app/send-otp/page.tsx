"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [Email, setEmail] = useState("");
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);

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

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          const prevInput = document.getElementById(`otp-${index - 1}`);
          if (prevInput) prevInput.focus();
          const newOtp = [...otp];
          newOtp[index - 1] = "";
          setOtp(newOtp);
        }
        e.preventDefault();
      } else {
        // Clear current field
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        e.preventDefault();
      }
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
    if (paste.length === 6) {
      const otpArr = paste.split("").slice(0, 6);
      setOtp(otpArr);
      setIsVerifying(true);
      // Auto-submit after state update
      setTimeout(() => {
        const form = document.getElementById("otp-form");
        if (form && form instanceof HTMLFormElement) {
          form.requestSubmit();
        }
      }, 0);
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      setIsVerifying(false);
      return;
    }
    try {
      const regData = sessionStorage.getItem("registrationData");
      const resetPassword = sessionStorage.getItem("resetPassword");
      if (regData) {
        // Registration flow (existing)
        // 1. Verify OTP
        const otpFormData = new FormData();
        otpFormData.append("email", Email);
        otpFormData.append("otp", fullOtp);

        const verifyRes = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify_otp/`,
          otpFormData
        );

        if (verifyRes.status === 200) {
          // 2. Get registration data from sessionStorage
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
            setIsVerifying(false);
          }
        } else {
          toast.error(verifyRes.data?.message || "Invalid OTP.");
          setIsVerifying(false);
        }
      } else if (resetPassword === "true") {
        // Reset password flow
        const email = sessionStorage.getItem("email");
        if (!email) {
          toast.error("Email not found. Please try again.");
          setIsVerifying(false);
          return;
        }
        const body = {
          email,
          otp: fullOtp,
          option: "reset_password",
        };
        try {
          const verifyRes = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify_otp/`,
            body,
            { headers: { "Content-Type": "application/json" } }
          );
          if (verifyRes.status === 200) {
            console.log("Reset password verify response:", verifyRes.data);
            if (
              verifyRes.data &&
              verifyRes.data.data &&
              verifyRes.data.data.access
            ) {
              sessionStorage.setItem(
                "access_token",
                verifyRes.data.data.access
              );
            }
            router.push("/reset-password");
          } else {
            toast.error(verifyRes.data?.message || "Invalid OTP.");
            setIsVerifying(false);
          }
        } catch (error) {
          if (error.response) {
            toast.error(error.response.data.message || "Error verifying OTP.");
          } else {
            toast.error("An error occurred. Please try again.");
          }
          setIsVerifying(false);
        }
      } else {
        toast.error("Session expired or invalid. Please try again.");
        setIsVerifying(false);
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.message || "Error during registration."
        );
      } else {
        toast.error("An error occurred. Please try again.");
      }
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="flex justify-center mb-12">
        <Image
          src="/PSA-Light-Logo.svg"
          alt="PSA Logo Light"
          width={208}
          height={208}
          priority
          className="block dark:hidden"
        />
        {/* Dark mode logo */}
        <Image
          src="/PSA-Dark-Logo.svg"
          alt="PSA Logo Dark"
          width={208}
          height={208}
          priority
          className="hidden dark:block"
        />
      </div>
      <div className="w-full max-w-sm rounded-4xl shadow-md p-8 bg-[#1773C8] dark:bg-[#082540]">
        <h1 className="text-2xl font-bold text-center text-white mb-6">OTP</h1>

        <form id="otp-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onPaste={handlePaste}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
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
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Done"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
