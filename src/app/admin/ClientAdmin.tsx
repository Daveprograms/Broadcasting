"use client";

import React, { useState } from "react";
import AdminTicketList from "@/components/AdminTicketList";

interface Ticket {
  id: string;
  issueType: string;
  description: string;
  status: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface Verification {
  id: string;
  senderName: string;
  amount: number;
  phoneNumber: string;
  notes: string | null;
  screenshot: string;
  status: string; // PENDING | VERIFIED | REJECTED
  adminNote: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface Settings {
  email1: string;
  email1Name: string;
  email2: string;
  email2Name: string;
}

interface ClientAdminProps {
  initialSettings: Settings;
  initialTickets: Ticket[];
  initialVerifications: Verification[];
}

export default function ClientAdmin({
  initialSettings,
  initialTickets,
  initialVerifications,
}: ClientAdminProps) {
  const [email1, setEmail1] = useState(initialSettings.email1);
  const [email1Name, setEmail1Name] = useState(initialSettings.email1Name || "");
  const [email2, setEmail2] = useState(initialSettings.email2);
  const [email2Name, setEmail2Name] = useState(initialSettings.email2Name || "");
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [settingsError, setSettingsError] = useState("");

  // Tabs Management
  const [activeTab, setActiveTab] = useState<"TICKETS" | "VERIFICATIONS">("VERIFICATIONS");

  // Broadcast Alert Section
  const [broadcastTarget, setBroadcastTarget] = useState("PRIMARY");
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastErr, setBroadcastErr] = useState("");

  // Verifications Management
  const [verifications, setVerifications] = useState<Verification[]>(initialVerifications);
  const [updatingVerId, setUpdatingVerId] = useState<string | null>(null);
  const [noteInputs, setNoteInputs] = useState<{ [key: string]: string }>({});
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess("");
    setSettingsError("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email1, email1Name, email2, email2Name }),
      });

      if (!res.ok) {
        throw new Error("Failed to update settlement channels");
      }

      setSettingsSuccess("Settlement nodes updated successfully.");
      setTimeout(() => setSettingsSuccess(""), 4000);
    } catch (err: unknown) {
      console.error(err);
      setSettingsError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleStopBroadcast = async () => {
    const emailToStop = broadcastTarget === "PRIMARY" ? email1 : email2;
    if (!emailToStop) {
      setBroadcastErr("Target email node is not configured.");
      return;
    }

    const confirmHalt = window.confirm(
      `🚨 WARNING: You are about to initiate an URGENT STOP BROADCAST blast to all users for: ${emailToStop}. This will send 5 consecutive emails. Proceed?`
    );
    if (!confirmHalt) return;

    setBroadcasting(true);
    setBroadcastMsg("");
    setBroadcastErr("");

    try {
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailToStop }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to trigger broadcast alert blast");
      }

      const result = await res.json();
      setBroadcastMsg(`✓ ALERT BROADCAST BLASTED: ${result.message}`);
    } catch (err: unknown) {
      console.error(err);
      setBroadcastErr(err instanceof Error ? err.message : "Failed to broadcast urgent message.");
    } finally {
      setBroadcasting(false);
    }
  };

  const handleUpdateVerificationStatus = async (
    verificationId: string,
    status: "VERIFIED" | "REJECTED"
  ) => {
    setUpdatingVerId(verificationId);
    const adminNote = noteInputs[verificationId] || "";

    try {
      const res = await fetch("/api/verifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationId, status, adminNote }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status");
      }

      setVerifications((prev) =>
        prev.map((v) =>
          v.id === verificationId ? { ...v, status, adminNote } : v
        )
      );
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setUpdatingVerId(null);
    }
  };

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 space-y-12">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center space-x-2 bg-cyber-magenta/10 border border-cyber-magenta/30 rounded px-2.5 py-1 text-xs font-mono text-cyber-magenta mb-4">
          <span>SECURE SYSTEM CONTROL MODULE</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          System{" "}
          <span className="bg-gradient-to-r from-cyber-magenta to-cyber-violet bg-clip-text text-transparent">
            Control Panel
          </span>
        </h1>
        <p className="max-w-2xl text-sm md:text-base text-slate-400 font-mono mt-2">
          Halt compromised addresses, verify receipts, and resolve client support transmissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Side: Configurations & Broadcast Control */}
        <div className="lg:col-span-1 space-y-8">
          {/* Settings Section */}
          <div className="glass-panel rounded-2xl p-6 border-cyber-cyan/20">
            <h2 className="text-sm font-bold font-mono text-slate-100 tracking-wider mb-6">
              // SETTLEMENT CONFIG
            </h2>

            {settingsSuccess && (
              <div className="mb-4 p-3 bg-cyber-green/10 border border-cyber-green/30 text-cyber-green text-xs rounded-lg font-mono">
                {settingsSuccess}
              </div>
            )}
            {settingsError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg font-mono">
                {settingsError}
              </div>
            )}

            <form onSubmit={handleUpdateSettings} className="space-y-5">
              <div>
                <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-2">
                  PRIMARY EMAIL NODE
                </label>
                <input
                  type="email"
                  required
                  value={email1}
                  onChange={(e) => setEmail1(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyber-cyan transition font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-2">
                  PRIMARY RECIPIENT NAME
                </label>
                <input
                  type="text"
                  required
                  value={email1Name}
                  onChange={(e) => setEmail1Name(e.target.value)}
                  placeholder="e.g. James"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyber-cyan transition font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-2">
                  SECONDARY EMAIL NODE
                </label>
                <input
                  type="email"
                  required
                  value={email2}
                  onChange={(e) => setEmail2(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyber-cyan transition font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-2">
                  SECONDARY RECIPIENT NAME
                </label>
                <input
                  type="text"
                  required
                  value={email2Name}
                  onChange={(e) => setEmail2Name(e.target.value)}
                  placeholder="e.g. Sarah"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyber-cyan transition font-mono text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="w-full py-3 cyber-btn rounded-xl font-mono text-xs tracking-wider font-semibold"
              >
                {savingSettings ? "SAVING CHANNELS..." : "UPDATE CHANNELS"}
              </button>
            </form>
          </div>

          {/* Stop Broadcast Section */}
          <div className="glass-panel rounded-2xl p-6 border-red-500/20">
            <h2 className="text-sm font-bold font-mono text-red-400 tracking-wider mb-2">
              ⚠️ URGENT STOP BROADCAST
            </h2>
            <p className="text-xs text-slate-400 font-mono mb-6 leading-relaxed">
              Triggers a system-wide security alert loop blasting 5 notifications to all users to immediately halt transfers to the target email.
            </p>

            {broadcastMsg && (
              <div className="mb-4 p-3 bg-cyber-green/10 border border-cyber-green/30 text-cyber-green text-xs rounded-lg font-mono">
                {broadcastMsg}
              </div>
            )}
            {broadcastErr && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg font-mono">
                {broadcastErr}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono tracking-widest text-slate-400 uppercase mb-2">
                  SELECT TARGET NODE
                </label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-red-500 transition font-mono text-sm"
                >
                  <option className="bg-slate-950" value="PRIMARY">
                    Primary: {email1 || "Not Set"}
                  </option>
                  <option className="bg-slate-950" value="SECONDARY">
                    Secondary: {email2 || "Not Set"}
                  </option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleStopBroadcast}
                disabled={broadcasting}
                className="w-full py-3.5 bg-red-600/10 border border-red-500 text-red-400 hover:bg-red-600/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:text-white rounded-xl font-mono text-xs tracking-wider font-bold transition duration-300 uppercase animate-pulse"
              >
                {broadcasting ? "BROADCAST BLASTING..." : "🔴 TRIGGER STOP BROADCAST SIGNAL"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Active Queue Monitors */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs Navigation Header */}
          <div className="flex border-b border-slate-800 space-x-2">
            <button
              onClick={() => setActiveTab("VERIFICATIONS")}
              className={`px-6 py-3 font-mono text-sm tracking-wider font-bold transition ${
                activeTab === "VERIFICATIONS"
                  ? "border-b-2 border-cyber-cyan text-cyber-cyan"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              PAYMENT VERIFICATIONS
            </button>
            <button
              onClick={() => setActiveTab("TICKETS")}
              className={`px-6 py-3 font-mono text-sm tracking-wider font-bold transition ${
                activeTab === "TICKETS"
                  ? "border-b-2 border-cyber-magenta text-cyber-magenta"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              SUPPORT TICKETS QUEUE
            </button>
          </div>

          {/* Tab 1: Payment Verifications Queue */}
          {activeTab === "VERIFICATIONS" && (
            <div className="space-y-6">
              {verifications.length === 0 ? (
                <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 font-mono">
                  NO E-TRANSFER VERIFICATIONS PENDING IN THE QUEUE.
                </div>
              ) : (
                <div className="space-y-6">
                  {verifications.map((verification) => (
                    <div
                      key={verification.id}
                      className={`glass-panel rounded-2xl p-6 border transition ${
                        verification.status === "VERIFIED"
                          ? "border-cyber-green/20 bg-cyber-green/5 opacity-70"
                          : verification.status === "REJECTED"
                          ? "border-red-500/20 bg-red-500/5 opacity-70"
                          : "border-cyber-cyan/30"
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Screenshot thumbnail section */}
                        <div className="md:col-span-1 flex flex-col items-center justify-center">
                          <p className="text-[10px] font-mono text-slate-400 mb-1">SCREENSHOT</p>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={verification.screenshot}
                            alt="Receipt"
                            onClick={() => setSelectedScreenshot(verification.screenshot)}
                            className="max-h-24 max-w-full rounded border border-slate-700 cursor-zoom-in hover:border-cyber-cyan transition object-cover"
                          />
                          <p className="text-[9px] font-mono text-slate-500 mt-1">CLICK TO ZOOM</p>
                        </div>

                        {/* Details section */}
                        <div className="md:col-span-3 space-y-4">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                                verification.status === "PENDING"
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                  : verification.status === "VERIFIED"
                                  ? "bg-cyber-green/10 border-cyber-green/30 text-cyber-green"
                                  : "bg-red-500/10 border-red-500/30 text-red-400"
                              }`}
                            >
                              {verification.status}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              Received: {new Date(verification.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                            <div>
                              <p className="text-slate-400 uppercase text-[10px]">Sender Name</p>
                              <p className="text-slate-100 font-semibold">{verification.senderName}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 uppercase text-[10px]">Amount Sent</p>
                              <p className="text-cyber-cyan font-bold text-sm">${verification.amount.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 uppercase text-[10px]">Registered User</p>
                              <p className="text-slate-300 truncate">{verification.user.email}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 uppercase text-[10px]">Phone Contact</p>
                              <p className="text-slate-100">{verification.phoneNumber}</p>
                            </div>
                          </div>

                          {verification.notes && (
                            <div className="p-2.5 bg-slate-950/40 rounded border border-slate-800 text-xs font-mono text-slate-400">
                              <span className="text-[10px] text-slate-500 uppercase block mb-0.5">Notes:</span>
                              {verification.notes}
                            </div>
                          )}

                          {/* Action panel */}
                          <div className="space-y-3 pt-2 border-t border-slate-800/80">
                            <div>
                              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                                Add Admin Audit Note
                              </label>
                              <input
                                type="text"
                                placeholder={verification.adminNote || "Add an audit trail note..."}
                                value={noteInputs[verification.id] ?? verification.adminNote ?? ""}
                                onChange={(e) =>
                                  setNoteInputs({ ...noteInputs, [verification.id]: e.target.value })
                                }
                                className="w-full bg-slate-950/60 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyber-cyan transition font-mono"
                              />
                            </div>

                            <div className="flex space-x-3 justify-end">
                              <button
                                onClick={() => handleUpdateVerificationStatus(verification.id, "REJECTED")}
                                disabled={updatingVerId === verification.id}
                                className="px-3.5 py-1.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-mono rounded-lg transition"
                              >
                                REJECT RECEIPT
                              </button>
                              <button
                                onClick={() => handleUpdateVerificationStatus(verification.id, "VERIFIED")}
                                disabled={updatingVerId === verification.id}
                                className="px-3.5 py-1.5 bg-cyber-green text-slate-900 font-bold hover:shadow-[0_0_10px_rgba(57,255,20,0.3)] text-xs font-mono rounded-lg transition"
                              >
                                VERIFY RECEIPT
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Support Tickets Queue */}
          {activeTab === "TICKETS" && (
            <div className="glass-panel rounded-2xl p-6 border-cyber-magenta/20">
              <h2 className="text-lg font-bold font-mono text-slate-100 tracking-wider mb-6">
                // SUPPORT TICKETS QUEUE
              </h2>
              <AdminTicketList initialTickets={initialTickets} />
            </div>
          )}
        </div>
      </div>

      {/* Full Size Image Modal Overlay */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedScreenshot}
              alt="Zoomed Receipt"
              className="max-h-[80vh] max-w-full rounded-lg border border-slate-700 object-contain shadow-2xl"
            />
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="mt-6 px-6 py-2 border border-cyber-cyan text-cyber-cyan font-mono text-sm tracking-wider font-semibold rounded-xl hover:bg-cyber-cyan/15 transition"
            >
              CLOSE TERMINAL IMAGE [ESC]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
