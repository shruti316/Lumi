import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setIsLoading(true);
    const { data, error } = await api.auth.login({ email, password });
    setIsLoading(false);

    if (error || !data?.token || !data?.user) {
      setErrorMessage(error || "Invalid email or password. Please try again.");
      return;
    }

    login(data.token, data.user, rememberMe);
    navigate("/dashboard", { replace: true });
  }

  return (
    <AuthLayout mode="login">
      <div className="space-y-6">
        {/* Card Header */}
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#17151C]">
            Welcome <span className="font-editorial-italic font-normal text-[#9E96D8]">back</span>
          </h2>
          <p className="mt-1.5 text-sm font-normal text-[#5F5965]">
            Your little space is waiting for you.
          </p>
        </div>

        {/* Validation Notice */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-[#FDF0F4] border border-[#F2D8E4] p-3 text-xs font-medium text-[#D99BB8] animate-lumi-fade-up">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F5965]">
                Password
              </label>
              <button
                type="button"
                onClick={(e) => e.preventDefault()}
                className="text-xs font-medium text-[#8D8792] hover:text-[#9E96D8] transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 z-10 flex items-center text-[#8D8792]">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="lumi-auth-input has-both-icons"
                autoComplete="current-password"
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

          {/* Remember Me Checkbox */}
          <div className="flex items-center pt-1">
            <label className="flex items-center gap-2.5 text-xs text-[#5F5965] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded-md border-[#E8E3F0] text-[#17151C] focus:ring-0 focus:ring-offset-0 accent-[#17151C] cursor-pointer"
              />
              <span>Remember this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#17151C] py-3.5 px-4 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] hover:shadow-md active:scale-98 cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>Log in</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Reciprocal Navigation Link to Signup */}
        <div className="pt-2 text-center text-xs text-[#5F5965] border-t border-[#E8E3F0]/80">
          <p className="inline">Don't have an account? </p>
          <Link
            to="/signup"
            onClick={() => navigate("/signup")}
            className="inline-block font-semibold text-[#17151C] hover:text-[#9E96D8] underline decoration-[#DDD8F2] underline-offset-4 transition cursor-pointer py-1"
          >
            Create account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
