"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    // const { username, email, password, confirmPassword } = formData;
    // console.log(username, email, password, confirmPassword);
    // console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex justify-center mb-12">
        <img src="/PSA-Logo.svg" alt="PSA Logo" className="w-52 h-52" />
      </div>
      <div
        className="w-4/5 sm:w-full max-w-3xl py-7 px-4 sm:p-7 rounded-4xl text-white shadow-xl"
        style={{ backgroundColor: "#082540" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2 sm:mb-1"
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
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-2 px-3 sm:py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/80"
                style={{ backgroundColor: "#1B3A5D" }}
                placeholder="Email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full py-2 px-3 sm:py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/80"
                style={{ backgroundColor: "#1B3A5D" }}
                placeholder="Confirm Password"
                required
              />
            </div>
          </div>

          <div className="text-center mt-6">
            <Button
              backGround="bg-blue-500  "
              className="px-5 py-3 sm:px-8 sm:py-4 rounded-4xl text-xl sm:text-2xl "
              style={{ backgroundColor: "#438BD3" }}
            >
              Register
            </Button>
          </div>
        </form>
      </div>
      <div className="text-center mt-2 text-sm">
        <p className="text-white">
          Do you have an account?
          <Link
            href="/login"
            className="ml-1 text-blue-400 hover:text-blue-300"
          >
            Login now!
          </Link>
        </p>
      </div>
    </div>
  );
}
