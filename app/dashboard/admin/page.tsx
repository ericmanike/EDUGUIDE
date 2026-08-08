"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/curriculum");
  }, [router]);

  return (
    <div className="py-12 text-center text-slate-500 font-semibold text-sm">
      Redirecting to Curriculum Management...
    </div>
  );
}
