import React from "react";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#0056D2] selection:text-white">
      {/* Sticky Home Navigation Bar */}
      <HomeNavbar />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Coursera Plus-Style Hero Section */}
        <HeroSection />

        {/* Feature Grid: Why SkillsBank Plus */}
        <FeatureGrid />
      </main>

      {/* Comprehensive Site Footer */}
      <Footer />
    </div>
  );
}
