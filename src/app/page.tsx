import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  // If user is already authenticated, send them to the dashboard immediately
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-6 py-16 relative">
      {/* Decorative Glow Dots */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyber-cyan/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyber-magenta/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl w-full text-center space-y-8 relative z-10">
        {/* Futuristic Badge */}
        <div className="inline-flex items-center space-x-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-full px-4 py-1.5 text-xs font-mono tracking-widest text-cyber-cyan uppercase animate-pulse">
          <span>● SYSTEM ONLINE</span>
          <span className="text-slate-500">|</span>
          <span>V2.6 NODE</span>
        </div>

        {/* Main Hero Header */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-sans">
          Welcome to the{" "}
          <span className="block mt-2 bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-magenta bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            Broadcasting Network
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-400 font-mono leading-relaxed">
          The next-generation distributed payment settlement channel. Securely
          receive and process e-transfers with cryptographic verification and
          instant notifications.
        </p>

        {/* Actions buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-center font-mono font-bold tracking-wider bg-gradient-to-r from-cyber-cyan to-cyber-violet text-slate-900 hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] transition duration-300 transform hover:-translate-y-0.5"
          >
            CREATE ACCOUNT [SIGNUP]
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-center font-mono font-bold tracking-wider border border-slate-700 bg-slate-900/50 text-slate-200 hover:border-cyber-cyan/50 hover:bg-slate-800/60 transition duration-300"
          >
            ACCESS TERMINAL [LOGIN]
          </Link>
        </div>

        {/* Features Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          <div className="glass-panel p-6 rounded-2xl border-slate-800 text-left">
            <div className="text-cyber-cyan font-mono font-bold text-lg mb-2">⚡ 01. INSTANT ROUTING</div>
            <p className="text-xs font-mono text-slate-400 leading-relaxed">
              Payments are immediately checked and updated across our system. Zero latency between transmission and display.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border-slate-800 text-left">
            <div className="text-cyber-magenta font-mono font-bold text-lg mb-2">🛡️ 02. CYBER SECURE</div>
            <p className="text-xs font-mono text-slate-400 leading-relaxed">
              Fully isolated accounts, custom encrypted endpoints, and robust database constraints keeping your assets safe.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border-slate-800 text-left">
            <div className="text-cyber-green font-mono font-bold text-lg mb-2">🌐 03. GLOBAL ACCESS</div>
            <p className="text-xs font-mono text-slate-400 leading-relaxed">
              A simplified, lightweight user interface optimized for all viewport widths, devices, and internet speeds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
