"use client";

import React, { useState } from "react";

interface SupportFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function SupportForm({ onClose, onSuccess }: SupportFormProps) {
  const [issueType, setIssueType] = useState("Payment Processing");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueType, description }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit support ticket");
      }

      onSuccess();
    } catch (err: unknown) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="w-full max-w-lg glass-panel rounded-2xl p-8 border border-cyber-cyan/30 relative">
        {/* Glow Line Decoration */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-magenta to-transparent opacity-80" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-wider text-slate-100 font-mono">
            // OPEN SUPPORT TICKET
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-cyber-magenta transition-colors font-bold font-mono"
          >
            [ESC]
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Type */}
          <div>
            <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-2">
              ISSUE CLASSIFICATION
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-cyber-cyan transition font-mono"
            >
              <option className="bg-slate-950" value="Payment Processing">Payment Processing</option>
              <option className="bg-slate-950" value="Account Security">Account Security</option>
              <option className="bg-slate-950" value="Dashboard Display">Dashboard Display</option>
              <option className="bg-slate-950" value="Other">Other Issues</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-2">
              TICKET DETAILS / EXPLANATION
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed log or description of the issue..."
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-cyber-cyan transition placeholder-slate-500"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 border border-slate-700 rounded-xl text-slate-300 font-mono text-sm tracking-wider font-semibold hover:bg-slate-800/40 transition"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 py-3 cyber-btn rounded-xl font-mono text-sm tracking-wider font-semibold"
            >
              {loading ? "TRANSMITTING..." : "SUBMIT TICKET"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
