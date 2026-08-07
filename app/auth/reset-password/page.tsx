"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, CheckCircle } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 800));
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/signIn");
      }, 1500);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full rounded-[24px] border border-slate-100 bg-white p-7 shadow-[0_10px_35px_rgba(0,0,0,0.04)] sm:p-9 text-center">
        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-emerald-600" size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Password Reset Successful!</h2>
        <p className="text-xs text-slate-500 mb-4">Redirecting to sign in page...</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-[24px] border border-slate-100 bg-white p-7 shadow-[0_10px_35px_rgba(0,0,0,0.04)] sm:p-9 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 space-y-1">
        <h1 className="text-[22px] font-bold tracking-tight text-[#0f172a]">Reset Password</h1>
        <p className="text-[13px] font-medium text-slate-500">
          Enter your new password below.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-xs font-semibold text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative flex items-center">
          <div className="pointer-events-none absolute left-4 text-slate-400">
            <Lock className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-[#f4f5f7] py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-[#1e3a8a] focus:bg-white focus:ring-1 focus:ring-[#1e3a8a]"
            placeholder="Enter new password"
            minLength={6}
          />
        </div>

        <div className="relative flex items-center">
          <div className="pointer-events-none absolute left-4 text-slate-400">
            <Lock className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-[#f4f5f7] py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-[#1e3a8a] focus:bg-white focus:ring-1 focus:ring-[#1e3a8a]"
            placeholder="Confirm new password"
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] py-3.5 px-4 text-sm font-bold text-white shadow-md shadow-[#1e3a8a]/25 transition-all duration-200 cursor-pointer select-none active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-white" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>

        <div className="text-center pt-2">
          <Link href="/auth/signIn" className="text-xs font-bold text-slate-600 hover:text-slate-900">
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
