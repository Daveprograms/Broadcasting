"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid access credentials. Check email and password.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error("Login failure", err);
      setError("Unable to reach authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
      {/* Decorative Glow Dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyber-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel rounded-2xl p-8 border border-cyber-cyan/30 relative z-10">
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-80" />

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-widest text-slate-100 font-mono mb-2">
            // TERMINAL ACCESS
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            INPUT VERIFICATION CREDENTIALS
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email field */}
          <div>
            <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-2">
              USER IDENTIFIER [EMAIL]
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. operator@domain.com"
              className="w-full bg-slate-950/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-cyber-cyan transition font-mono placeholder-slate-600"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-2">
              ACCESS CRYPTOKEY [PASSWORD]
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/60 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-slate-100 focus:outline-none focus:border-cyber-cyan transition font-mono placeholder-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 hover:text-cyber-cyan transition-colors uppercase focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 cyber-btn rounded-xl font-mono text-sm tracking-wider font-semibold"
          >
            {loading ? "INITIALIZING SECURE SESSION..." : "CONNECT SECURE SESSION"}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center border-t border-slate-800/80 pt-6">
          <p className="text-xs font-mono text-slate-400">
            First time logging into terminal?{" "}
            <Link
              href="/signup"
              className="text-cyber-cyan hover:underline transition font-bold"
            >
              REGISTER CREDENTIALS
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
