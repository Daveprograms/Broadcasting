"use client";

import { useState } from "react";
import EmailCard from "@/components/EmailCard";
import SupportForm from "@/components/SupportForm";
import VerifyPaymentForm from "@/components/VerifyPaymentForm";

interface ClientDashboardProps {
  initialEmail1: string;
  initialEmail1Name: string;
  initialEmail2: string;
  initialEmail2Name: string;
}

export default function ClientDashboard({
  initialEmail1,
  initialEmail1Name,
  initialEmail2,
  initialEmail2Name,
}: ClientDashboardProps) {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<{ message: string; subText: string } | null>(null);

  const handleSupportSuccess = () => {
    setIsSupportOpen(false);
    setSuccessToast({
      message: "✓ SUPPORT TICKET REGISTERED",
      subText: "Our admin operators have received your ticket queue. We will check it shortly.",
    });
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleVerifySuccess = () => {
    setIsVerifyOpen(false);
    setSuccessToast({
      message: "✓ TRANSACTION RECEIPT TRANSMITTED",
      subText: "Your payment verification has been uploaded. An administrator will verify the amount.",
    });
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 flex flex-col justify-between">
      {/* Success Notification Alert Toast */}
      {successToast && (
        <div className="fixed top-24 right-6 z-50 p-4 bg-cyber-green/10 border border-cyber-green text-cyber-green rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.2)] font-mono text-sm max-w-md animate-bounce">
          <p className="font-bold">{successToast.message}</p>
          <p className="text-xs text-slate-300 mt-1">{successToast.subText}</p>
        </div>
      )}

      {/* Main Section */}
      <div className="space-y-12">
        {/* Banner Section */}
        <div className="text-center md:text-left space-y-4">
          <div className="inline-flex items-center space-x-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded px-2.5 py-1 text-xs font-mono text-cyber-cyan">
            <span>NETWORK STATUS: SECURE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Receive Payments via{" "}
            <span className="bg-gradient-to-r from-cyber-cyan to-cyber-violet bg-clip-text text-transparent">
              E-Transfer
            </span>
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-slate-400 font-mono">
            Send payments directly to any of the designated email network nodes below. Once sent, settlements will process automatically.
          </p>
        </div>

        {/* Email Node Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <EmailCard label="Primary Settlement Channel" email={initialEmail1} name={initialEmail1Name} />
          <EmailCard label="Secondary Settlement Channel" email={initialEmail2} name={initialEmail2Name} />
        </div>
      </div>

      {/* Verification & Support Footer Section */}
      <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col items-center space-y-6">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest text-center">
          Verify E-transfer transfers or open terminal issues below
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl">
          <button
            onClick={() => setIsVerifyOpen(true)}
            className="w-full sm:w-1/2 px-8 py-4 bg-gradient-to-r from-cyber-cyan to-cyber-violet hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] text-slate-900 font-mono font-bold tracking-wider rounded-xl transition duration-300 transform hover:-translate-y-0.5"
          >
            VERIFY PAYMENT RECEIPT
          </button>
          <button
            onClick={() => setIsSupportOpen(true)}
            className="w-full sm:w-1/2 px-8 py-4 border border-cyber-magenta/40 bg-cyber-magenta/5 text-cyber-magenta hover:bg-cyber-magenta/15 hover:shadow-[0_0_20px_rgba(255,0,127,0.2)] font-mono font-bold tracking-wider rounded-xl transition duration-300 transform hover:-translate-y-0.5"
          >
            OPEN SUPPORT TERMINAL
          </button>
        </div>
      </div>

      {/* Support Form Modal */}
      {isSupportOpen && (
        <SupportForm
          onClose={() => setIsSupportOpen(false)}
          onSuccess={handleSupportSuccess}
        />
      )}

      {/* Verify Payment Modal */}
      {isVerifyOpen && (
        <VerifyPaymentForm
          email1={initialEmail1}
          email1Name={initialEmail1Name}
          email2={initialEmail2}
          email2Name={initialEmail2Name}
          onClose={() => setIsVerifyOpen(false)}
          onSuccess={handleVerifySuccess}
        />
      )}
    </div>
  );
}
