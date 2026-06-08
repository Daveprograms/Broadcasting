"use client";

import { useState } from "react";

interface EmailCardProps {
  label: string;
  email: string;
  name?: string;
}

export default function EmailCard({ label, email, name }: EmailCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <div className="relative glass-panel rounded-2xl p-6 flex flex-col justify-between overflow-hidden animate-float">
      {/* Decorative Top Accent Glow line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-80" />

      {/* Cyber decoration/indicator */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono font-bold tracking-widest text-cyber-cyan bg-cyber-cyan/10 px-2.5 py-1 rounded">
          {label}
        </span>
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-ping" />
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
        </div>
      </div>

      <div className="my-4 space-y-4">
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1">
            Registered Recipient Name
          </p>
          <p className="text-sm font-mono text-cyber-cyan font-bold tracking-wide">
            {name || "Not Configured"}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1">
            E-Transfer Email Address
          </p>
          <p className="text-base md:text-lg font-mono text-slate-100 font-semibold select-all break-all selection:bg-cyber-cyan/30">
            {email || "Not Configured"}
          </p>
        </div>
      </div>

      <button
        onClick={handleCopy}
        disabled={!email}
        className={`w-full py-3 px-4 rounded-xl font-mono text-sm tracking-wider font-semibold uppercase transition-all duration-300 border ${
          copied
            ? "bg-cyber-green/10 border-cyber-green text-cyber-green shadow-[0_0_15px_rgba(57,255,20,0.3)]"
            : "bg-cyber-cyan/5 border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan"
        }`}
      >
        {copied ? (
          <span className="flex items-center justify-center space-x-2">
            <span>✓ COPIED TO CLIPBOARD</span>
          </span>
        ) : (
          <span>COPY EMAIL NODE</span>
        )}
      </button>
    </div>
  );
}
