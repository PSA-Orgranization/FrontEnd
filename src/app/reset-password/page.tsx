"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Image from "next/image";

export default function NewPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Handle logic here

    if (formData.newPassword !== formData.confirmNewPassword) {
      alert("Passwords don't match!");
      return;
    }
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium mb-2 sm:mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full py-2 px-3 sm:py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/80"
              style={{ backgroundColor: "#1B3A5D" }}
              placeholder="New Password"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              className="w-full py-2 px-3 sm:py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/80"
              style={{ backgroundColor: "#1B3A5D" }}
              placeholder="Confirm New Password"
              required
            />
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
