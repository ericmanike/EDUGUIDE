# EduGuide 🎓
> **Abstracted Student Learning Path Recommender**
> *Model learning as essential skills; build an edtech app with progress analytics.*

---

## 📌 Project Overview

**EduGuide** is an AI-powered EdTech web application designed to abstract complex learning domains into granular skill nodes and dynamically recommend personalized learning paths for students based on their goals and proficiency levels.

---

## 🎯 How EduGuide Solves the Core Requirements

### 1. Abstracting Learning into Essential Skills
- **Skill Graph Node Model**: Breaks down high-level career goals (e.g., *Full-Stack Developer*) into ordered skill nodes (e.g., *Java 21 Core* → *Spring Boot REST* → *PostgreSQL JPA* → *Next.js 16* → *Docker & Deployment*).
- **Competency Radar (`SkillRadarChart`)**: Maps student proficiency across 6 core skill vectors against target career benchmarks.
- **Skill Taxonomy Explorer (`/dashboard/explore`)**: Categorizes learning modules into *Backend Architecture*, *Database Systems*, *Frontend Frameworks*, and *DevOps & Security*.

### 2. Personalization & Recommendation Engine
- **Match Score Engine**: Calculates a percentage match for each learning track (e.g. *98% Match for Full-Stack Spring Boot + Next.js*).
- **Adaptive Roadmap (`PathVisualizer`)**: An interactive step-by-step roadmap where students can mark milestones complete and track active nodes.
- **Configurable Recommender Settings (`/dashboard/settings`)**: Allows students to tune their target career role, weekly study hours commitment, and recommendation intensity (*Adaptive*, *Steady*, *Accelerated*).

### 3. Comprehensive Progress Analytics (`Recharts`)
- 📈 **Weekly Activity Trend (`AreaChart`)**: Visualizes daily study hours and milestone completion velocity.
- 🎯 **Skill Competency Radar (`RadarChart`)**: Compares student skill levels against industry targets.
- 📊 **Module Completion Comparison (`BarChart`)**: Tracks completed vs remaining modules per path.
- 🍩 **Domain Time Distribution (`PieChart`)**: Displays time spent across Backend, Frontend, Database, and DevOps.

---

## 🎨 Design System

- **Primary Canvas**: Clean White (`#FFFFFF` / `bg-slate-50`)
- **Headers & Accents**: Slate-900 (`#0F172A`)
- **Action Buttons & Highlights**: Vibrant Orange (`#F97316`)

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Charts**: Recharts
- **Backend Ready**: Configured for Spring Boot REST API (`http://localhost:8080`) & PostgreSQL

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the EduGuide Dashboard.
