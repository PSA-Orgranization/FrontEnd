"use client";

import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Image from "next/image";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  type FormFields = keyof typeof formData;
  type ErrorsType = Partial<Record<FormFields, string>>;
  const [errors, setErrors] = useState<ErrorsType>({});

  const router = useRouter();

  const validateUsername = (username, email) => {
    // Rule 1: Allowed characters
    const allowedPattern = /^[\w.@+-]+$/;
    if (!allowedPattern.test(username)) {
      toast.error(
        "Username may contain only letters, numbers, and @/./+/-/_ characters."
      );
      return false;
    }

    // Rule 2: Username ≠ email local part
    const emailLocal = email.split("@")[0];
    if (username === emailLocal) {
      toast.error(
        "Username cannot be the same as the part of your email before the @ sign."
      );
      return false;
    }

    return true;
  };

  const validateName = (name, label) => {
    const namePattern = /^[A-Za-z]+$/;
    if (!namePattern.test(name)) {
      toast.error(`${label} must contain only alphabetic characters.`);
      return false;
    }
    return true;
  };

  const validatePassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match.");
      return false;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Check for empty fields
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "This field is required";
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }
    if (!validateName(formData.firstName, "First Name")) {
      setIsSubmitting(false);
      return;
    }
    if (!validateName(formData.lastName, "Last Name")) {
      setIsSubmitting(false);
      return;
    }
    if (!validateUsername(formData.username, formData.email)) {
      setIsSubmitting(false);
      return;
    }
    if (!validatePassword(formData.password, formData.confirmPassword)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const otpResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/otp/`,
        { email: formData.email }
      );

      if (otpResponse.status === 200) {
        // Store registration data in sessionStorage (stringify for storage)
        sessionStorage.setItem(
          "registrationData",
          JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
          })
        );
        toast.success("OTP sent to your email. Please check your inbox.");
        router.push("/send-otp");
      } else {
        toast.error(otpResponse.data?.message || "Failed to send OTP.");
        setIsSubmitting(false);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Failed to send OTP.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex justify-center mb-12 mt-10  p-8 py-10 rounded-full  dark:bg-[linear-gradient(40deg,#05203d_0%,#004e99_75%,#ee4392_100%)] bg-[linear-gradient(40deg,#BAB8B8_0%,#0C5BA4_75%,#EE4392_100%)]">
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
      <div className="w-4/5 sm:w-full max-w-3xl py-7 px-4 sm:p-7 rounded-4xl text-white shadow-xl bg-[#1773C8] dark:bg-[#082540]">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium mb-2 sm:mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full py-2 px-3 sm:py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/80 bg-[#448CDD] dark:bg-[#1B3A5D]"
                placeholder="First Name"
              />
              {errors.firstName && (
                <div className="text-red-400 text-xs mt-1">
                  {errors.firstName}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium mb-2 sm:mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full py-2 px-3 sm:py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/80 bg-[#448CDD] dark:bg-[#1B3A5D]"
                placeholder="Last Name"
              />
              {errors.lastName && (
                <div className="text-red-400 text-xs mt-1">
                  {errors.lastName}
                </div>
              )}
            </div>

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
                className="w-full py-2 px-3 sm:py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/80 bg-[#448CDD] dark:bg-[#1B3A5D]"
                placeholder="Username"
              />
              {errors.username && (
                <div className="text-red-400 text-xs mt-1">
                  {errors.username}
                </div>
              )}
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
                className="w-full py-2 px-3 sm:py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/80 bg-[#448CDD] dark:bg-[#1B3A5D]"
                placeholder="Email"
              />
              {errors.email && (
                <div className="text-red-400 text-xs mt-1">{errors.email}</div>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
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
                  className="w-full py-2 px-3 sm:py-3 pr-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/80 bg-[#448CDD] dark:bg-[#1B3A5D]"
                  placeholder="Password"
                />
                {errors.password && (
                  <div className="text-red-400 text-xs mt-1">
                    {errors.password}
                  </div>
                )}
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full py-2 px-3 sm:py-3 pr-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/80 bg-[#448CDD] dark:bg-[#1B3A5D]"
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && (
                  <div className="text-red-400 text-xs mt-1">
                    {errors.confirmPassword}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEye className="w-5 h-5 text-white/70 hover:text-white cursor-pointer" />
                  ) : (
                    <AiOutlineEyeInvisible className="w-5 h-5 text-white/70 hover:text-white cursor-pointer" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Button
              backGround="bg-blue-500  "
              className="px-5 py-3 sm:px-8 sm:py-4 rounded-4xl text-xl sm:text-2xl "
              style={{ backgroundColor: "#438BD3" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending OTP..." : "Register"}
            </Button>
          </div>
        </form>
      </div>
      <div className="text-center mt-2 text-sm pb-10">
        <p className="text-white">
          Do you have an account?
          <Link
            href="/login"
            className="ml-1 text-blue-800 hover:text-blue-400"
          >
            Login now!
          </Link>
        </p>
      </div>
    </div>
  );
}
