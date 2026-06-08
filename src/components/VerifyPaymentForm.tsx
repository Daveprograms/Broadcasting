"use client";

import React, { useState } from "react";

interface VerifyPaymentFormProps {
  email1: string;
  email1Name: string;
  email2: string;
  email2Name: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VerifyPaymentForm({
  email1,
  email1Name,
  email2,
  email2Name,
  onClose,
  onSuccess,
}: VerifyPaymentFormProps) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [notes, setNotes] = useState("");
  const [screenshotBase64, setScreenshotBase64] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (.png, .jpg, .jpeg)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setScreenshotBase64(base64String);
      setImagePreview(base64String);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!screenshotBase64) {
      setError("Please upload a transaction screenshot.");
      setLoading(false);
      return;
    }

    if (!recipientEmail) {
      setError("Please select the email node you sent the payment to.");
      setLoading(false);
      return;
    }

    // Combine parameters into notes field to show clearly in Admin panel notes
    const combinedNotes = `[SENT TO NODE]: ${recipientEmail}\n[VERIFICATION TYPE]: ${
      isUrgent ? "URGENT (5% Fee Accepted)" : "STANDARD (First-Come, First-Served)"
    }\n` + (notes ? `[USER COMMENT]: ${notes}` : "");

    try {
      const res = await fetch("/api/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName,
          amount,
          phoneNumber,
          notes: combinedNotes,
          screenshot: screenshotBase64,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit verification");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4 overflow-y-auto py-8">
      <div className="w-full max-w-lg glass-panel rounded-2xl p-8 border border-cyber-cyan/30 relative my-auto">
        {/* Glow Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-80" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-wider text-slate-100 font-mono">
            // VERIFY E-TRANSFER PAYMENT
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-cyber-cyan transition-colors font-bold font-mono"
          >
            [ESC]
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Destination Email Dropdown */}
          <div>
            <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-1.5">
              WHICH EMAIL NODE DID YOU SEND THE PAYMENT TO?
            </label>
            <select
              required
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyber-cyan transition font-mono text-sm"
            >
              <option className="bg-slate-950" value="">-- Select Target Email Address --</option>
              <option className="bg-slate-950" value={email1}>
                {email1Name ? `${email1Name} (${email1})` : email1}
              </option>
              <option className="bg-slate-950" value={email2}>
                {email2Name ? `${email2Name} (${email2})` : email2}
              </option>
            </select>
          </div>

          {/* File Upload / Screenshot */}
          <div>
            <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-2">
              TRANSACTION SCREENSHOT (REQUIRED)
            </label>
            <div className="relative border-2 border-dashed border-slate-700 hover:border-cyber-cyan rounded-xl p-4 transition text-center cursor-pointer bg-slate-900/40">
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {imagePreview ? (
                <div className="space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Receipt preview"
                    className="max-h-32 mx-auto rounded-lg object-contain border border-slate-800"
                  />
                  <p className="text-xs text-cyber-cyan font-mono">
                    ✓ IMAGE ATTACHED. CLICK OR DRAG TO REPLACE
                  </p>
                </div>
              ) : (
                <div className="py-4 space-y-1">
                  <span className="text-2xl">📁</span>
                  <p className="text-sm text-slate-300 font-mono font-semibold">
                    SELECT TRANSACTION IMAGE
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    PNG, JPG, JPEG (Base64 encoded)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sender's Full Name */}
          <div>
            <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-1.5">
              SENDER FULL NAME
            </label>
            <input
              type="text"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyber-cyan transition font-mono placeholder-slate-600 text-sm"
            />
          </div>

          {/* Amount Sent */}
          <div>
            <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-1.5">
              AMOUNT SENT ($)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyber-cyan transition font-mono placeholder-slate-600 text-sm"
            />
          </div>

          {/* Phone Number Input Label (Friendly Text requested) */}
          <div>
            <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-1.5">
              what phone number do you want us to contact you at when the payment is verified?
            </label>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyber-cyan transition font-mono placeholder-slate-600 text-sm"
            />
          </div>

          {/* First-come first-served & Urgent Processing 5% Fee checkbox */}
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
            <div className="flex items-start space-x-2">
              <input
                id="isUrgent"
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyber-cyan focus:ring-cyber-cyan focus:ring-offset-slate-900 focus:outline-none"
              />
              <label
                htmlFor="isUrgent"
                className="text-xs font-mono text-slate-300 font-bold select-none cursor-pointer leading-tight"
              >
                REQUEST URGENT PROCESSING (+5% FEE APPLIED)
              </label>
            </div>
            <p className="text-[10px] font-mono text-slate-400 leading-normal">
              Note: Settlement verification is standardly first-come, first-served. If you want your verification to be expedited immediately, you can request an urgent verification check by checking the box above, subject to an extra 5% processing fee.
            </p>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-1.5">
              ADDITIONAL NOTES / METADATA (OPTIONAL)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E-Transfer reference codes, transaction timestamps, etc..."
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyber-cyan transition placeholder-slate-600 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-2">
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
              {loading ? "PROCESSING..." : "TRANSMIT RECEIPT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
