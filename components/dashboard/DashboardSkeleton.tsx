"use client";

import React from "react";
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse font-sans">
      {/* Top Banner Skeleton */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 w-full max-w-xl">
            <div className="flex items-center gap-2">
              <div className="h-6 w-36 bg-blue-50 rounded-full" />
            </div>
            <div className="h-8 w-3/4 bg-slate-200 rounded-xl" />
            <div className="h-4 w-5/6 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Key Metric Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-slate-200 rounded-md" />
              <div className="w-8 h-8 rounded-xl bg-slate-100" />
            </div>
            <div className="h-7 w-28 bg-slate-200 rounded-lg" />
            <div className="h-3 w-32 bg-slate-100 rounded-md" />
          </div>
        ))}
      </div>

      {/* Analytics Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4 h-64 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="h-4 w-40 bg-slate-200 rounded-md" />
            <div className="h-4 w-20 bg-slate-100 rounded-md" />
          </div>
          <div className="h-40 bg-slate-100/70 rounded-xl w-full" />
        </div>
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4 h-64 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="h-4 w-40 bg-slate-200 rounded-md" />
            <div className="h-4 w-20 bg-slate-100 rounded-md" />
          </div>
          <div className="h-40 bg-slate-100/70 rounded-xl w-full" />
        </div>
      </div>

      {/* Recommended Paths Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-5 w-48 bg-slate-200 rounded-md" />
            <div className="h-3 w-64 bg-slate-100 rounded-md" />
          </div>
          <div className="h-6 w-32 bg-slate-200 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between h-72"
            >
              <div className="space-y-3">
                <div className="h-4 w-20 bg-orange-100 rounded-md" />
                <div className="h-5 w-5/6 bg-slate-200 rounded-md" />
                <div className="h-3 w-full bg-slate-100 rounded-md" />
                <div className="h-3 w-4/5 bg-slate-100 rounded-md" />
              </div>
              <div className="h-8 bg-slate-200 rounded-xl w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
