export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://eduguider.up.railway.app/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface JwtTokenPayload {
  id?: string;
  email?: string;
  role?: "STUDENT" | "ADMIN";
  name?: string;
  sub?: string;
  iat?: number;
  exp?: number;
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

/**
 * Decode JWT token payload on the frontend without needing the secret key
 */
export function decodeJwtToken(token: string): JwtTokenPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

/**
 * Retrieve the current JWT token exclusively from document cookies
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  const cookieMatch = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token=") || row.startsWith("edtech_token="));

  return cookieMatch ? cookieMatch.split("=")[1] : null;
}

/**
 * Store JWT token strictly in document cookies (24-hour expiration)
 */
export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `edtech_token=${token}; path=/; max-age=86400; SameSite=Lax`;
  }
}

/**
 * Remove token cookies (no localStorage used)
 */
export function logoutUser(): void {
  if (typeof window !== "undefined") {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    document.cookie = "edtech_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  }
}

/**
 * Retrieve authorization headers with Bearer token if available
 */
export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Retrieve current user directly from decoded JWT token claims (no localStorage)
 */
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const token = getToken();
  if (token) {
    const decoded = decodeJwtToken(token);
    if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
      return {
        id: decoded.id || "",
        email: decoded.email || decoded.sub || "",
        name: decoded.name || (decoded.email ? decoded.email.split("@")[0] : "User"),
        role: decoded.role || "STUDENT",
      };
    }
  }
  return null;
}


export async function checkBackendStatus(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    // 200 OK, 401 Unauthorized, or 403 Forbidden means the Spring Boot server is online
    return res.ok || res.status === 401 || res.status === 403;
  } catch (error) {
    console.warn("Backend connection failed:", error);
    return false;
  }
}


export async function fetchUsers(): Promise<User[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
  try {
    const res = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password: pass }),
    });

    if (!res.ok) {
      let errorMessage = "Invalid email or password!";
      console.log("Backend response:", res);
      try {
        const errText = await res.text();
        if (errText) errorMessage = errText;
      } catch (e) {
        console.log("Backend response:", res , "Error message" , e);
      }

    
    }

    const data = await res.json();
    if (data.token) {
      setToken(data.token);
    }

    const user: User = {
      id: data.id || `u-${Date.now()}`,
      name: data.name || email.split("@")[0],
      email: data.email || email,
      role: data.role || "STUDENT",
    };

    return user;
  } catch (error: any) {
    console.error("Login request failed:", error);
    throw error;
  }
}

export async function registerUser(userData: {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role?: "STUDENT" | "ADMIN";
}): Promise<User> {
  try {
    const res = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email.trim(),
        password: userData.password || "password123",
        role: userData.role || "STUDENT",
      }),
    });

    if (!res.ok) {
      let errorMessage = "Registration failed!";
      try {
        const errText = await res.text();
        if (errText) errorMessage = errText;
      } catch (e) {}
      throw new Error(errorMessage);
    }

    // Auto-login upon successful registration if password was supplied
    if (userData.password) {
      return await loginUser(userData.email, userData.password);
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || "STUDENT",
    };
    return newUser;
  } catch (error: any) {
    console.error("Registration request failed:", error);
    throw error;
  }
}


export interface PathModule {
  id: string;
  pathId: string;
  moduleId: string;
  sequenceOrder: number;
  moduleTitle?: string;
  pathTitle?: string;
  createdAt?: string;
}

export async function createLearningPath(pathData: {
  title: string;
  description: string;
  level: string;
  estimatedHours: number;
}): Promise<LearningPath | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/learning-paths`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: pathData.title,
        description: pathData.description,
        level: pathData.level.toUpperCase(),
        estimatedHours: pathData.estimatedHours,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to create learning path on backend:", error);
    return null;
  }
}

export async function updateLearningPath(
  id: string,
  pathData: {
    title?: string;
    description?: string;
    level?: string;
    estimatedHours?: number;
  }
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/learning-paths/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(pathData),
    });
    return res.ok;
  } catch (error) {
    console.error("Failed to update learning path:", error);
    return false;
  }
}

export async function deleteLearningPath(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/learning-paths/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return res.ok;
  } catch (error) {
    console.error("Failed to delete learning path:", error);
    return false;
  }
}

export async function createModule(moduleData: {
  title: string;
  topic: string;
  description: string;
  durationMinutes: number;
}): Promise<CourseModule | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/modules`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(moduleData),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to create module:", error);
    return null;
  }
}

export async function updateModule(
  id: string,
  moduleData: {
    title?: string;
    topic?: string;
    description?: string;
    durationMinutes?: number;
  }
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/modules/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(moduleData),
    });
    return res.ok;
  } catch (error) {
    console.error("Failed to update module:", error);
    return false;
  }
}

export async function deleteModule(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/modules/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return res.ok;
  } catch (error) {
    console.error("Failed to delete module:", error);
    return false;
  }
}

export async function fetchPathModules(): Promise<PathModule[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/path-modules`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch path-modules:", error);
    return [];
  }
}

export async function fetchPathModulesByPath(pathId: string): Promise<PathModule[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/path-modules/path/${pathId}`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch modules for path:", error);
    return [];
  }
}

export async function createPathModule(mappingData: {
  pathId: string;
  moduleId: string;
  sequenceOrder: number;
}): Promise<PathModule | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/path-modules`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(mappingData),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to map module to path:", error);
    return null;
  }
}

export async function updatePathModule(id: string, sequenceOrder: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/path-modules/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ sequenceOrder }),
    });
    return res.ok;
  } catch (error) {
    console.error("Failed to update path-module sequence:", error);
    return false;
  }
}

export async function deletePathModule(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/path-modules/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return res.ok;
  } catch (error) {
    console.error("Failed to remove module from path:", error);
    return false;
  }
}

export function getStoredAIRecommendations() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("edtech_ai_recommendations");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
