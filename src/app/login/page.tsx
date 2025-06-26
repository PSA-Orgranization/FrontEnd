"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Image from "next/image";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to clear authentication-related localStorage items
  const clearAuthStorage = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthStorage(); // Clear localStorage before login
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login/`,
        {
          username_or_email: formData.email,
          password: formData.password,
        }
      );
      const result = response.data;

      if (response.status === 200 && result.status === 200) {
        const { access, refresh, user } = result.data;
        // Save tokens and user info to localStorage
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("username", user.username);
        localStorage.setItem("email", user.email);
        localStorage.setItem("first_name", user.first_name);
        localStorage.setItem("last_name", user.last_name);
        // Redirect to /chat after successful login
        router.push("/chat");
      } else {
        toast.error(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex justify-center mb-12 pt-10">
        <Image src="/PSA-Logo.svg" alt="PSA Logo" width={208} height={208} />
      </div>
      <div
        className="w-4/5 sm:w-full max-w-md py-7 px-4 sm:p-7 rounded-4xl text-white shadow-xl"
        style={{ backgroundColor: "#082540" }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-md font-medium mb-2 sm:mb-1"
            >
              Email
            </label>
            <input
              type="text"
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
              className="block text-md font-medium mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full py-2 px-3 sm:py-3 pr-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/80"
                style={{ backgroundColor: "#1B3A5D" }}
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <AiOutlineEye className="w-5 h-5 text-white/70 hover:text-white cursor-pointer" />
                ) : (
                  <AiOutlineEyeInvisible className="w-5 h-5 text-white/70 hover:text-white cursor-pointer" />
                )}
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <Button
              backGround="bg-blue-500"
              className="px-8 py-3 sm:px-8 sm:py-4 rounded-4xl text-xl sm:text-2xl"
              style={{ backgroundColor: "#438BD3" }}
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </div>
      <div className="text-center mt-2 text-sm space-y-1 pb-10">
        <p className="text-white">
          Don&apos;t have an account?{" "}
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
