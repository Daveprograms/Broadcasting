"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TERMS_AND_CONDITIONS } from "@/lib/terms";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!agreedToTerms) {
      setError("You must read and agree to the Terms and Conditions to proceed.");
      setLoading(false);
      return;
    }

    try {
      // Create user request
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email.toLowerCase(),
          password,
          agreedToTerms,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create user session.");
      }

      // Automatically sign in the user
      const result = await signIn("credentials", {
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created, but autologin failed. Proceed to login manually.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("Signup error", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
      {/* Decorative Glow Dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyber-magenta/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel rounded-2xl p-8 border border-cyber-magenta/30 relative z-10">
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-magenta to-transparent opacity-80" />

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-widest text-slate-100 font-mono mb-2">
            // REGISTER NODE
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            INITIALIZE CRYPTO-VERIFIED ID
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name field */}
          <div>
            <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-1.5">
              OPERATOR CODENAME [FULL NAME]
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-slate-950/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyber-magenta transition font-mono placeholder-slate-600 text-sm"
            />
          </div>

          {/* Email field */}
          <div>
            <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-1.5">
              COMMUNICATION ENDPOINT [EMAIL]
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. operator@domain.com"
              className="w-full bg-slate-950/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyber-magenta transition font-mono placeholder-slate-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-1.5">
              SECURITY KEY [PASSWORD]
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/60 border border-slate-700 rounded-xl pl-4 pr-12 py-2.5 text-slate-100 focus:outline-none focus:border-cyber-magenta transition font-mono placeholder-slate-600 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 hover:text-cyber-magenta transition-colors uppercase focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="flex items-start space-x-2 py-2">
            <input
              id="agreedToTerms"
              type="checkbox"
              required
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyber-magenta focus:ring-cyber-magenta focus:ring-offset-slate-900 focus:outline-none"
            />
            <label
              htmlFor="agreedToTerms"
              className="text-xs font-mono text-slate-400 select-none cursor-pointer leading-tight"
            >
              I have read and agree to the{" "}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-cyber-magenta hover:underline font-bold focus:outline-none"
              >
                Terms and Conditions
              </button>
            </label>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyber-magenta to-cyber-violet hover:shadow-[0_0_20px_rgba(255,0,127,0.4)] text-slate-900 font-mono text-sm tracking-wider font-semibold uppercase transition duration-300 rounded-xl"
          >
            {loading ? "CONFIGURING PROFILE..." : "ESTABLISH ACCOUNT NODE"}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center border-t border-slate-800/80 pt-6">
          <p className="text-xs font-mono text-slate-400">
            Already possess verified credentials?{" "}
            <Link
              href="/login"
              className="text-cyber-magenta hover:underline transition font-bold"
            >
              AUTHENTICATE SESSION
            </Link>
          </p>
        </div>
      </div>

      {/* Terms and Conditions Legal Modal Overlay */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-slate-950 border border-cyber-magenta/40 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <h2 className="text-lg font-bold font-mono tracking-wider text-slate-100 mb-4 text-center border-b border-slate-800 pb-3">
              ⬡ TERMS & CONDITIONS AGREEMENT
            </h2>
            <div className="flex-1 overflow-y-auto bg-slate-900/60 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {TERMS_AND_CONDITIONS}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setAgreedToTerms(true);
                  setShowTermsModal(false);
                }}
                className="px-6 py-2 bg-gradient-to-r from-cyber-magenta to-cyber-violet text-slate-900 font-mono font-bold text-xs rounded-xl hover:shadow-[0_0_10px_rgba(255,0,127,0.3)] transition"
              >
                ACCEPT & CLOSE
              </button>
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-6 py-2 border border-slate-700 text-slate-300 font-mono text-xs rounded-xl hover:bg-slate-900 transition"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
