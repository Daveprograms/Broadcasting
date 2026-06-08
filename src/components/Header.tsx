"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const user = session?.user as { name?: string; email?: string; role?: string } | undefined;
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-cyber-cyan/15 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="text-2xl font-bold tracking-widest text-cyber-cyan hover:text-cyber-magenta transition-colors duration-300 drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            ⬡ PBN
          </span>
          <span className="hidden md:inline-block text-xs font-semibold uppercase tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors">
            Payment Broadcasting Network
          </span>
        </Link>

        {/* User Stats & Navigation */}
        {session && (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 text-sm">
              <span className="text-slate-400">Node:</span>
              <span className="font-mono text-slate-100 bg-slate-800/40 px-2.5 py-1 rounded border border-slate-700/50">
                {user?.name || user?.email}
              </span>
              {isAdmin && (
                <span className="text-xs bg-cyber-green/10 text-cyber-green border border-cyber-green/30 px-2 py-0.5 rounded font-mono font-bold tracking-wider animate-pulse">
                  SYSTEM ADMIN
                </span>
              )}
            </div>

            <nav className="flex items-center space-x-4">
              {isAdmin && (
                <>
                  {pathname.startsWith("/admin") ? (
                    <Link
                      href="/dashboard"
                      className="px-4 py-1.5 rounded text-sm font-semibold tracking-wide border border-cyber-cyan/40 bg-cyber-cyan/5 text-cyber-cyan hover:bg-cyber-cyan/10 transition"
                    >
                      User View
                    </Link>
                  ) : (
                    <Link
                      href="/admin"
                      className="px-4 py-1.5 rounded text-sm font-semibold tracking-wide border border-cyber-magenta/40 bg-cyber-magenta/5 text-cyber-magenta hover:bg-cyber-magenta/10 transition drop-shadow-[0_0_8px_rgba(255,0,127,0.2)]"
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              )}

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="px-4 py-1.5 rounded text-sm font-semibold tracking-wide border border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition duration-300"
              >
                Disconnect
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
