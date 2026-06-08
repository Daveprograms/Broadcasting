"use client";

import { useState } from "react";

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

interface AdminTicketListProps {
  initialTickets: Ticket[];
}

export default function AdminTicketList({ initialTickets }: AdminTicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const toggleStatus = async (ticketId: string, currentStatus: string) => {
    setUpdatingId(ticketId);
    const newStatus = currentStatus === "PENDING" ? "RESOLVED" : "PENDING";

    try {
      const res = await fetch("/api/tickets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update ticket status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 font-mono">
          NO ACTIVE SUPPORT TICKETS FOUND.
        </div>
      ) : (
        <div className="grid gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`glass-panel rounded-2xl p-6 border transition ${
                ticket.status === "RESOLVED"
                  ? "border-slate-800 opacity-60"
                  : "border-cyber-magenta/30"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                {/* Meta details */}
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-cyber-magenta/10 text-cyber-magenta border border-cyber-magenta/20">
                      {ticket.issueType}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
                        ticket.status === "PENDING"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse"
                          : "bg-cyber-green/10 border-cyber-green/30 text-cyber-green"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <div className="text-sm font-mono text-slate-300">
                    User:{" "}
                    <span className="text-slate-100 font-semibold">
                      {ticket.user.name || "N/A"}
                    </span>{" "}
                    ({ticket.user.email})
                  </div>
                  <div className="text-xs font-mono text-slate-500 mt-1">
                    Received: {new Date(ticket.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Status Toggle Action Button */}
                <div>
                  <button
                    onClick={() => toggleStatus(ticket.id, ticket.status)}
                    disabled={updatingId === ticket.id}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wide transition border ${
                      ticket.status === "PENDING"
                        ? "bg-cyber-green/5 border-cyber-green/30 text-cyber-green hover:bg-cyber-green/20"
                        : "bg-amber-500/5 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                    }`}
                  >
                    {updatingId === ticket.id
                      ? "PROCESSING..."
                      : ticket.status === "PENDING"
                      ? "MARK RESOLVED"
                      : "REOPEN TICKET"}
                  </button>
                </div>
              </div>

              {/* Ticket Description */}
              <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                <p className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
