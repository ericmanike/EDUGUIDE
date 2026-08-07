export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://eduguider.up.railway.app/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | string;
  estimatedHours: number;
  totalModules?: number;
  completedModules?: number;
  matchScore?: number;
  skillsCovered?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  topic: string;
  description: string;
  durationMinutes: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  createdAt?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  description: string;
  createdAt?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  activityDate: string;
  hoursSpent: number;
  createdAt?: string;
}

export async function checkBackendStatus(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    return res.ok;
  } catch (error) {
    console.warn("Backend connection failed:", error);
    return false;
  }
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch users from backend:", error);
    return [];
  }
}

export async function fetchLearningPaths(): Promise<LearningPath[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/learning-paths`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch learning paths from backend:", error);
    return [];
  }
}

export async function fetchModules(): Promise<CourseModule[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/modules`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch modules from backend:", error);
    return [];
  }
}

export async function fetchSkills(): Promise<Skill[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/skills`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch skills from backend:", error);
    return [];
  }
}

export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/transactions`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch transactions from backend:", error);
    return [];
  }
}

export async function fetchActivityLogs(): Promise<ActivityLog[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/activity-logs`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch activity logs from backend:", error);
    return [];
  }
}

export async function loginUser(email: string, pass: string): Promise<User> {
  const users = await fetchUsers();
  const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (found) {
    if (typeof window !== "undefined") {
      localStorage.setItem("edtech_user", JSON.stringify(found));
    }
    return found;
  }
  const user: User = {
    id: `u-${Date.now()}`,
    name: email.split("@")[0],
    email: email.trim(),
    role: "STUDENT",
  };
  if (typeof window !== "undefined") {
    localStorage.setItem("edtech_user", JSON.stringify(user));
  }
  return user;
}

export async function registerUser(userData: {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}): Promise<User> {
  const user: User = {
    id: `u-${Date.now()}`,
    name: userData.name,
    email: userData.email,
    role: "STUDENT",
  };
  if (typeof window !== "undefined") {
    localStorage.setItem("edtech_user", JSON.stringify(user));
  }
  return user;
}
