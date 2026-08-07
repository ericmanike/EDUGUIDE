"use client";

import React, { useEffect, useState } from "react";
import { Server, CheckCircle2, AlertCircle } from "lucide-react";
import { checkBackendStatus } from "@/lib/api";

export const BackendStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<"checking" | "connected" | "offline">("checking");

  useEffect(() => {
    const checkBackend = async () => {
      const isOk = await checkBackendStatus();
      setStatus(isOk ? "connected" : "offline");
    };

    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-sm border border-slate-800">
      <Server className="w-3.5 h-3.5 text-orange-400" />
      <span>Spring Boot Backend:</span>
      {status === "checking" && (
        <span className="text-amber-400 animate-pulse">Connecting...</span>
      )}
      {status === "connected" && (
        <span className="flex items-center gap-1 text-emerald-400">
          <CheckCircle2 className="w-3 h-3" /> Connected
        </span>
      )}
      {status === "offline" && (
        <span className="flex items-center gap-1 text-slate-400">
          <AlertCircle className="w-3 h-3 text-orange-400" /> Standby (Local)
        </span>
      )}
    </div>
  );
};
