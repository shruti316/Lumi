import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { api } from "../../lib/api";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify your password.");
      return;
    }

    setIsLoading(true);
    const { data, error } = await api.auth.signup({ email, password, name });
    setIsLoading(false);

    if (error && !error.includes("Network error") && !error.includes("Failed to fetch")) {
      setErrorMessage(error);
      return;
    }

    if (data?.token) {
      localStorage.setItem("lumi_token", data.token);
      if (data.user) {
        localStorage.setItem("lumi_user", JSON.stringify(data.user));
      }
    }

    navigate("/dashboard");
  }

  return (
    <AuthLayout mode="signup">
      <div className="space-y-6">
        {/* Card Header */}
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#17151C]">
            Create your <span className="font-editorial-italic font-normal text-[#9E96D8]">LUMI</span>
          </h2>
          <p className="mt-1.5 text-sm font-normal text-[#5F5965]">
            Make a space that's completely yours.
          </p>
        </div>

        {/* Validation Notice */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-[#FDF0F4] border border-[#F2D8E4] p-3 text-xs font-medium text-[#D99BB8] animate-lumi-fade-up">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F5965] mb-1.5">
              Your Name
            </label>
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 z-10 flex items-center text-[#8D8792]">
                <User size={16} />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Clara Oswald"
                className="lumi-auth-input has-left-icon"
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F5965] mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 z-10 flex items-center text-[#8D8792]">
                <Mail size={16} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="lumi-auth-input has-left-icon"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F5965] mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 z-10 flex items-center text-[#8D8792]">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min 6 characters)"
                className="lumi-auth-input has-both-icons"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-[#8D8792] hover:text-[#17151C] hover:bg-[#EEEAFE]/60 transition cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F5965] mb-1.5">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 z-10 flex items-center text-[#8D8792]">
                <Lock size={16} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="lumi-auth-input has-both-icons"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-[#8D8792] hover:text-[#17151C] hover:bg-[#EEEAFE]/60 transition cursor-pointer"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#17151C] py-3.5 px-4 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] hover:shadow-md active:scale-98 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin text-[#E8B9CD]" />
              ) : (
                <>
                  <Sparkles size={15} className="text-[#E8B9CD]" />
                  <span>Create account</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Reciprocal Navigation Link to Login */}
        <div className="pt-1 text-center text-xs text-[#5F5965] border-t border-[#E8E3F0]/80">
          <p className="inline">Already have an account? </p>
          <Link
            to="/login"
            onClick={() => navigate("/login")}
            className="inline-block font-semibold text-[#17151C] hover:text-[#9E96D8] underline decoration-[#DDD8F2] underline-offset-4 transition cursor-pointer py-1"
          >
            Log in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
