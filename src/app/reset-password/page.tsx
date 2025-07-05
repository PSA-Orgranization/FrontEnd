"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function NewPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle logic here

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    const email =
      typeof window !== "undefined" ? sessionStorage.getItem("email") : null;
    const access_token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("access_token")
        : null;
    if (!email || !access_token) {
      alert("Session expired or missing data. Please try again.");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset_password/`,
        {
          email,
          new_password: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        toast.success("Password reset successfully.");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("resetPassword");
        router.push("/login");
      } else {
        alert(res.data?.message || "Failed to reset password.");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Failed to reset password.");
      } else {
        alert("An error occurred. Please try again.");
      }
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium mb-2 sm:mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full py-2 px-3 sm:py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/80 pr-10 bg-[#448CDD] dark:bg-[#1B3A5D]"
                placeholder="New Password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowNewPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <Eye
                    size={20}
                    className="w-5 h-5 text-white/70 hover:text-white cursor-pointer"
                  />
                ) : (
                  <EyeOff
                    size={20}
                    className="w-5 h-5 text-white/70 hover:text-white cursor-pointer"
                  />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className="w-full py-2 px-3 sm:py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/80 pr-10 bg-[#448CDD] dark:bg-[#1B3A5D]"
                placeholder="Confirm New Password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={
                  showConfirmNewPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmNewPassword ? (
                  <Eye
                    size={20}
                    className="w-5 h-5 text-white/70 hover:text-white cursor-pointer"
                  />
                ) : (
                  <EyeOff
                    size={20}
                    className="w-5 h-5 text-white/70 hover:text-white cursor-pointer"
                  />
                )}
              </button>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button
              backGround="bg-blue-500"
              className="px-5 py-3 sm:px-8 sm:py-4 rounded-4xl text-lg sm:text-2xl w-8/12"
              style={{ backgroundColor: "#438BD3" }}
            >
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
