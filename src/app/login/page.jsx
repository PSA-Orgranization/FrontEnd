"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex justify-center mb-12">
        <img src="/PSA-Logo.svg" alt="PSA Logo" className="w-52 h-52" />
      </div>
      <div
        className="w-4/5 sm:w-full max-w-md py-7 px-4 sm:p-7 rounded-4xl text-white shadow-xl"
        style={{ backgroundColor: "#082540" }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-md font-medium mb-2 sm:mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full py-2 px-3 sm:py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/80"
              style={{ backgroundColor: "#1B3A5D" }}
              placeholder="Username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-md font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full py-2 px-3 sm:py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/80"
              style={{ backgroundColor: "#1B3A5D" }}
              placeholder="Password"
              required
            />
          </div>

          <div className="text-center mt-6">
            <Button
              backGround="bg-blue-500"
              className="px-8 py-3 sm:px-8 sm:py-4 rounded-4xl text-xl sm:text-2xl"
              style={{ backgroundColor: "#438BD3" }}
            >
              Login
            </Button>
          </div>
        </form>
      </div>
      <div className="text-center mt-2 text-sm space-y-1">
        <p className="text-white">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:text-blue-300">
            Sign up now!
          </Link>
        </p>
        <p className="text-white">
          Forgot your password?{" "}
          <Link
            href="/check-account"
            className="text-blue-400 hover:text-blue-300"
          >
            Reset your Password now!
          </Link>
        </p>
      </div>
    </div>
  );
}
