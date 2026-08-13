"use client";

import React from "react";
import { RecommendedCourses } from "@/components/dashboard/RecommendedCourses";

export const CoursesView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Main Course Modules Grid */}
      <RecommendedCourses />
    </div>
  );
};
