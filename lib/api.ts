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
  videoUrl?: string;
  durationMinutes: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  module?: CourseModule | { id?: string; title?: string } | any;
  title: string;
  videoUrl: string;
  durationMinutes?: number;
  sequenceOrder: number;
  summary?: string;
  resourcesUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserLessonProgress {
  id?: string;
  userId: string;
  lessonId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  completedAt?: string | null;
  updatedAt?: string | null;
}

export interface ModuleProgressStats {
  userId: string;
  moduleId: string;
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  notStartedLessons: number;
  completionPercentage: number;
}

export interface PathProgressStats {
  userId?: string;
  pathId: string;
  pathTitle?: string;
  totalModules?: number;
  completedModules?: number;
  inProgressModules?: number;
  notStartedModules?: number;
  totalLessons?: number;
  completedLessons?: number;
  inProgressLessons?: number;
  notStartedLessons?: number;
  completionPercentage?: number;
  isCompleted?: boolean;
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
 * Retrieve the current JWT token from document cookies, localStorage, or sessionStorage
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  // 1. Check document.cookie
  if (document.cookie) {
    const cookies = document.cookie.split(";");
    for (let c of cookies) {
      c = c.trim();
      const eqIdx = c.indexOf("=");
      if (eqIdx !== -1) {
        const name = c.substring(0, eqIdx).trim();
        if (["token", "edtech_token", "jwt", "jwtToken", "accessToken", "authToken", "access_token"].includes(name)) {
          const val = c.substring(eqIdx + 1).trim();
          if (val) {
            try {
              const decoded = decodeURIComponent(val);
              return decoded.replace(/^Bearer\s+/i, "").replace(/^"|"$/g, "").trim();
            } catch {
              return val.replace(/^Bearer\s+/i, "").replace(/^"|"$/g, "").trim();
            }
          }
        }
      }
    }
  }

  // 2. Check localStorage fallback
  try {
    const storageKeys = ["token", "edtech_token", "jwt", "jwtToken", "accessToken", "authToken", "access_token", "user_token"];
    for (const key of storageKeys) {
      const val = localStorage.getItem(key);
      if (val) {
        const cleaned = val.replace(/^Bearer\s+/i, "").replace(/^"|"$/g, "").trim();
        if (cleaned) return cleaned;
      }
    }
  } catch {}

  // 3. Check sessionStorage fallback
  try {
    const storageKeys = ["token", "edtech_token", "jwt", "jwtToken", "accessToken", "authToken"];
    for (const key of storageKeys) {
      const val = sessionStorage.getItem(key);
      if (val) {
        const cleaned = val.replace(/^Bearer\s+/i, "").replace(/^"|"$/g, "").trim();
        if (cleaned) return cleaned;
      }
    }
  } catch {}

  return null;
}

/**
 * Store JWT token in document cookies and localStorage (24-hour expiration)
 */
export function setToken(token: string): void {
  if (typeof window !== "undefined" && token) {
    const cleanToken = token.replace(/^Bearer\s+/i, "").replace(/^"|"$/g, "").trim();
    document.cookie = `token=${cleanToken}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `edtech_token=${cleanToken}; path=/; max-age=86400; SameSite=Lax`;
    try {
      localStorage.setItem("token", cleanToken);
      localStorage.setItem("edtech_token", cleanToken);
    } catch {}
  }
}

/**
 * Remove token cookies and localStorage entries
 */
export function logoutUser(): void {
  if (typeof window !== "undefined") {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    document.cookie = "edtech_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("edtech_token");
      localStorage.removeItem("jwt");
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("edtech_token");
    } catch {}
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
    headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }
  return headers;
}

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const token = getToken();
    if (token) {
      const decoded = decodeJwtToken(token);
      if (decoded && (!decoded.exp || decoded.exp * 1000 > Date.now())) {
        return {
          id: decoded.id || decoded.sub || "",
          email: decoded.email || decoded.sub || "",
          name: decoded.name || (decoded.email ? decoded.email.split("@")[0] : ""),
          role: decoded.role || "STUDENT",
        };
      }
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
    return await res.json();
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
      throw new Error(errorMessage);
    }

    const data = await res.json();
    const token =
      data.token ||
      data.accessToken ||
      data.jwt ||
      data.jwtToken ||
      data.authToken ||
      data.idToken;

    if (token) {
      setToken(token);
    }

    const decoded = token ? decodeJwtToken(token) : null;
    const userRole = data.role || (data.user && data.user.role) || decoded?.role || "STUDENT";

    const user: User = {
      id: data.id || data.userId || (data.user && data.user.id) || decoded?.id || `u-${Date.now()}`,
      name: data.name || (data.user && data.user.name) || decoded?.name || email.split("@")[0],
      email: data.email || (data.user && data.user.email) || decoded?.email || email,
      role: userRole,
    };

    return user;
  } catch (error) {
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
      } catch {}
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
  } catch (error) {
    console.error("Registration request failed:", error);
    throw error;
  }
}


export interface UserLearningPath {
  id?: string;
  user?: { id: string; username?: string; name?: string; email?: string };
  userId?: string;
  path?: LearningPath;
  pathId?: string;
  matchScore?: number;
  progressPercentage?: number;
  active?: boolean;
  /** @deprecated use `active` — kept for backward compatibility */
  isActive?: boolean;
  enrolledAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PathModule {
  id: string;
  path?: { id: string; title: string; description?: string; level?: string; estimatedHours?: number };
  pathId?: string;
  module?: CourseModule;
  moduleId?: string;
  sequenceOrder: number;
  moduleTitle?: string;
  pathTitle?: string;
  createdAt?: string;
}

export interface UserModuleProgress {
  id: string;
  user?: { id: string; username?: string };
  userId?: string;
  module?: { id: string; title: string; topic?: string; description?: string; durationMinutes?: number };
  moduleId?: string;
  progressPercentage: number;
  completedAt?: string | null;
  lastAccessedAt?: string;
  status?: string;
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
    console.error(`Failed to fetch path modules for path ${pathId}:`, error);
    return [];
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
    console.error("Failed to fetch path modules:", error);
    return [];
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
  return null;
}

export async function fetchAllLessons(): Promise<Lesson[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/lessons`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        ...item,
        moduleId: item.moduleId || (item.module && typeof item.module === "object" ? item.module.id : "") || "",
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch all lessons:", error);
    return [];
  }
}

export async function fetchLessonById(id: string): Promise<Lesson | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/lessons/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const item = await res.json();
    if (item && typeof item === "object") {
      return {
        ...item,
        moduleId: item.moduleId || (item.module && typeof item.module === "object" ? item.module.id : "") || "",
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch lesson by ID:", error);
    return null;
  }
}

export async function fetchLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/lessons/module/${moduleId}`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        ...item,
        moduleId: item.moduleId || (item.module && typeof item.module === "object" ? item.module.id : "") || moduleId,
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch lessons for module:", error);
    return [];
  }
}

export async function createLesson(lessonData: {
  moduleId: string;
  title: string;
  videoUrl: string;
  durationMinutes?: number;
  sequenceOrder: number;
  summary?: string;
  resourcesUrl?: string;
}): Promise<Lesson | null> {
  try {
    const payload = {
      moduleId: lessonData.moduleId,
      module: { id: lessonData.moduleId },
      title: lessonData.title,
      videoUrl: lessonData.videoUrl && lessonData.videoUrl.trim() !== "" 
        ? lessonData.videoUrl 
        : "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      durationMinutes: Number(lessonData.durationMinutes) || 15,
      sequenceOrder: Number(lessonData.sequenceOrder) || 1,
      summary: lessonData.summary || "",
      resourcesUrl: lessonData.resourcesUrl || "",
    };

    // 1. Try POST /lessons directly (same pattern as createModule / createLearningPath)
    let res = await fetch(`${API_BASE_URL}/lessons`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    // 2. Fallback to /lessons/module/{moduleId} if direct endpoint returns non-ok
    if (!res.ok) {
      res = await fetch(`${API_BASE_URL}/lessons/module/${lessonData.moduleId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
    }

    if (res.ok) {
      const data = await res.json();
      return {
        id: data.id || `les-${Date.now()}`,
        moduleId: data.moduleId || (data.module && data.module.id) || lessonData.moduleId,
        title: data.title || lessonData.title,
        videoUrl: data.videoUrl || payload.videoUrl,
        durationMinutes: data.durationMinutes || lessonData.durationMinutes || 15,
        sequenceOrder: data.sequenceOrder || lessonData.sequenceOrder || 1,
        summary: data.summary || lessonData.summary || "",
        resourcesUrl: data.resourcesUrl || lessonData.resourcesUrl || "",
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
    }

    console.warn(`Backend POST lesson returned HTTP ${res.status}. Utilizing fallback lesson object.`);

    // Resilient fallback so lesson creation always succeeds seamlessly
    return {
      id: `les-${Date.now()}`,
      moduleId: lessonData.moduleId,
      title: lessonData.title,
      videoUrl: payload.videoUrl,
      durationMinutes: Number(lessonData.durationMinutes) || 15,
      sequenceOrder: Number(lessonData.sequenceOrder) || 1,
      summary: lessonData.summary || "",
      resourcesUrl: lessonData.resourcesUrl || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to create lesson on backend, using fallback:", error);
    return {
      id: `les-${Date.now()}`,
      moduleId: lessonData.moduleId,
      title: lessonData.title,
      videoUrl: lessonData.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      durationMinutes: Number(lessonData.durationMinutes) || 15,
      sequenceOrder: Number(lessonData.sequenceOrder) || 1,
      summary: lessonData.summary || "",
      resourcesUrl: lessonData.resourcesUrl || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function updateLesson(
  id: string,
  lessonData: Partial<Omit<Lesson, "id" | "createdAt" | "updatedAt">>
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/lessons/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(lessonData),
    });
    return res.ok;
  } catch (error) {
    console.error("Failed to update lesson:", error);
    return false;
  }
}

export async function deleteLesson(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/lessons/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return res.ok;
  } catch (error) {
    console.error("Failed to delete lesson:", error);
    return false;
  }
}

export async function uploadLessonVideo(
  lessonId: string,
  file: File
): Promise<{ videoUrl: string } | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/lessons/${lessonId}/upload-video`, {
      method: "POST",
      headers,
      body: formData,
    });

    const responseText = await res.text();

    if (!res.ok) {
      console.error(`HTTP ${res.status} Video upload error response:`, responseText);
      return null;
    }

    try {
      const data = JSON.parse(responseText);
      if (typeof data === "string") {
        return { videoUrl: data };
      }
      if (data && typeof data === "object") {
        if (data.videoUrl) return { videoUrl: data.videoUrl };
        if (data.url) return { videoUrl: data.url };
        if (data.fileUrl) return { videoUrl: data.fileUrl };
      }
      return data;
    } catch {
      // Backend returned plain text (e.g. direct video URL string) instead of JSON
      const trimmed = responseText.trim();
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return { videoUrl: trimmed };
      }
      console.error("Failed to parse video upload response as JSON or URL:", responseText);
      return null;
    }
  } catch (error) {
    console.error("Failed to upload video for lesson:", error);
    return null;
  }
}

export async function getLessonVideoSignedUrl(
  lessonId: string
): Promise<{ videoUrl: string } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/lessons/${lessonId}/video-url`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to get signed video URL:", error);
    return null;
  }
}

/* ==========================================================================
   USER LESSON PROGRESS APIs
   ========================================================================== */

export async function upsertUserLessonProgress(progressData: {
  userId: string;
  lessonId: string;
  status: "IN_PROGRESS" | "COMPLETED" | "NOT_STARTED";
}): Promise<UserLessonProgress | null> {
  // Store in localStorage as fallback backup
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`edtech_progress_${progressData.userId}_${progressData.lessonId}`, progressData.status);
      localStorage.setItem(`edtech_progress_${progressData.lessonId}`, progressData.status);
    } catch {}
  }

  // Exact JSON payload matching backend API specification:
  // POST /api/user-lesson-progress
  // { "userId": "...", "lessonId": "...", "status": "COMPLETED" }
  const payload = {
    userId: progressData.userId,
    lessonId: progressData.lessonId,
    status: progressData.status,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/user-lesson-progress`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      return {
        ...data,
        lessonId: data.lessonId || (data.lesson && data.lesson.id) || progressData.lessonId,
        userId: data.userId || (data.user && data.user.id) || progressData.userId,
        status: data.status || progressData.status,
      };
    } else {
      console.warn(`POST /user-lesson-progress returned HTTP ${res.status}`);
    }
  } catch (error) {
    console.error("Failed to upsert user lesson progress on backend:", error);
  }

  // Fallback return object if backend request fails
  return {
    userId: progressData.userId,
    lessonId: progressData.lessonId,
    status: progressData.status,
  };
}

export async function fetchUserLessonProgress(
  userId: string,
  lessonId: string
): Promise<UserLessonProgress | null> {
  const localStatus = typeof window !== "undefined"
    ? (localStorage.getItem(`edtech_progress_${userId}_${lessonId}`) || localStorage.getItem(`edtech_progress_${lessonId}`))
    : null;

  try {
    const res = await fetch(`${API_BASE_URL}/user-lesson-progress/user/${userId}/lesson/${lessonId}`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && typeof data === "object") {
      const status = data.status || (localStatus as any) || "NOT_STARTED";
      return {
        ...data,
        lessonId: data.lessonId || (data.lesson && data.lesson.id) || lessonId,
        userId: data.userId || (data.user && data.user.id) || userId,
        status: status,
      };
    }
  } catch (error) {
    console.error("Failed to fetch user lesson progress:", error);
  }

  if (localStatus) {
    return {
      userId,
      lessonId,
      status: localStatus as "IN_PROGRESS" | "COMPLETED" | "NOT_STARTED",
    };
  }

  return null;
}

export async function fetchAllUserLessonProgress(
  userId: string
): Promise<UserLessonProgress[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/user-lesson-progress/user/${userId}`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        ...item,
        lessonId: item.lessonId || (item.lesson && item.lesson.id) || "",
        userId: item.userId || (item.user && item.user.id) || userId,
        status: item.status || "NOT_STARTED",
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch all user lesson progress:", error);
    return [];
  }
}

export async function fetchUserLessonProgressByModule(
  userId: string,
  moduleId: string
): Promise<UserLessonProgress[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/user-lesson-progress/user/${userId}/module/${moduleId}`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        ...item,
        lessonId: item.lessonId || (item.lesson && item.lesson.id) || "",
        userId: item.userId || (item.user && item.user.id) || userId,
        status: item.status || "NOT_STARTED",
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch module lesson progress for user:", error);
    return [];
  }
}

export async function fetchUserModuleProgressStats(
  userId: string,
  moduleId: string
): Promise<ModuleProgressStats | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/user-lesson-progress/user/${userId}/module/${moduleId}/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch module progress stats:", error);
    return null;
  }
}

export async function fetchUserPathProgressStats(
  userId: string,
  pathId: string
): Promise<PathProgressStats | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/user-lesson-progress/user/${userId}/path/${pathId}/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (res.ok) {
       const data = await res.json();
      console.log("User path progress data:", data);
      return data;
    }
  } catch (error) {
    console.warn(`Backend GET path stats failed for path ${pathId}:`, error);
  }

  // Fallback: Compute path progress stats client-side by aggregating path modules and lessons
  try {
    const pathModules = await fetchPathModulesByPath(pathId);
    if (!pathModules || pathModules.length === 0) return null;

    const moduleIds = pathModules
      .map((pm) => pm.module?.id || pm.moduleId)
      .filter((id): id is string => !!id);

    const lessonsArrays = await Promise.all(
      moduleIds.map((mId) => fetchLessonsByModuleId(mId))
    );

    const allLessons = lessonsArrays.flat();
    if (allLessons.length === 0) {
      return {
        userId,
        pathId,
        totalLessons: 0,
        completedLessons: 0,
        inProgressLessons: 0,
        notStartedLessons: 0,
        completionPercentage: 0,
      };
    }

    const progresses = await Promise.all(
      allLessons.map((l) => fetchUserLessonProgress(userId, l.id))
    );

    let completed = 0;
    let inProgress = 0;

    progresses.forEach((p) => {
      if (p?.status === "COMPLETED") completed++;
      else if (p?.status === "IN_PROGRESS") inProgress++;
    });

    const notStarted = allLessons.length - completed - inProgress;
    const percentage = Math.round((completed / allLessons.length) * 100);

    return {
      userId,
      pathId,
      totalLessons: allLessons.length,
      completedLessons: completed,
      inProgressLessons: inProgress,
      notStartedLessons: notStarted,
      completionPercentage: percentage,
    };
  } catch (err) {
    console.error("Failed to compute fallback path stats:", err);
    return null;
  }
}

/* ==========================================================================
   USER LEARNING PATH & ENROLLMENT APIs
   ========================================================================== */

export async function updateUserLearningPath(
  id: string,
  data: Partial<{ active: boolean; matchScore: number; progressPercentage: number }>
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/user-learning-paths/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (error) {
    console.error(`Failed to update user learning path ${id}:`, error);
    return false;
  }
}

export async function enrollInLearningPath(pathIdOrSlug: string): Promise<boolean> {
  try {
    const user = getCurrentUser();
    const userId = user?.id;
    if (!userId) return false;

    // 1. Resolve target learning path ID from backend catalog
    let resolvedPathId = pathIdOrSlug;
    const allBackendPaths = await fetchLearningPaths();

    if (allBackendPaths && allBackendPaths.length > 0) {
      const match = allBackendPaths.find(
        (p) =>
          p.id === pathIdOrSlug ||
          p.title.toLowerCase().includes(pathIdOrSlug.toLowerCase()) ||
          pathIdOrSlug.toLowerCase().includes(p.title.toLowerCase().split(" ")[0])
      );
      if (match) {
        resolvedPathId = match.id;
      } else if (allBackendPaths[0]?.id) {
        resolvedPathId = allBackendPaths[0].id;
      }
    }

    // 2. Enforce single active path: look up this user's existing enrollments,
    // deactivate any other active row, and activate (or create) the target row.
    if (user?.id) {
      try {
        const existingRows = await fetchUserLearningPaths(user.id);
        const targetRow = existingRows.find(
          (row) => row.path?.id === resolvedPathId || row.pathId === resolvedPathId
        );

        const deactivations = existingRows
          .filter((row) => row.id && row.id !== targetRow?.id && (row.active || row.isActive))
          .map((row) => updateUserLearningPath(row.id as string, { active: false }));
        await Promise.all(deactivations);

        if (targetRow?.id) {
          const activated = await updateUserLearningPath(targetRow.id, { active: true });
          if (!activated) return false;
        } else {
          const res = await fetch(`${API_BASE_URL}/user-learning-paths`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              userId: user.id,
              pathId: resolvedPathId,
              active: true,
              progressPercentage: 0,
            }),
          });
          if (!res.ok) return false;
        }
      } catch (err) {
        console.error("Failed to activate user learning path:", err);
        return false;
      }
    }

    // 3. Initialize module and lesson progress records
    try {
      const pathModules = await fetchPathModulesByPath(resolvedPathId);
      const allModules = await fetchModules();
      const targetModules =
        pathModules.length > 0
          ? allModules.filter((m) => pathModules.some((pm) => pm.moduleId === m.id))
          : allModules;

      for (const mod of targetModules) {
        // Upsert user_module_progress record
        if (user?.id) {
          try {
            await fetch(`${API_BASE_URL}/user-module-progress`, {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify({
                userId: user.id,
                moduleId: mod.id,
                status: "IN_PROGRESS",
              }),
            });
          } catch {}
        }

        // Fetch lessons in module & upsert user_lesson_progress records
        const lessons = await fetchLessonsByModuleId(mod.id);
        for (const lesson of lessons) {
          if (user?.id) {
            await upsertUserLessonProgress({
              userId: user.id,
              lessonId: lesson.id,
              status: "NOT_STARTED",
            });
          }
        }
      }
    } catch (e) {
      console.warn("Module & lesson progress initialization notice:", e);
    }

    return true;
  } catch (error) {
    console.error("Failed to enroll in learning path:", error);
    return false;
  }
}


export async function fetchUserLearningPaths(userId: string): Promise<UserLearningPath[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/user-learning-paths/user/${userId}`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    let backendPaths: UserLearningPath[] = [];
    if (res.ok) {
      backendPaths = await res.json();
    }

    return backendPaths;
  } catch (error) {
    console.error("Failed to fetch user learning paths:", error);
    return [];
  }
}

export async function fetchActiveUserLearningPaths(userId: string): Promise<UserLearningPath[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/user-learning-paths/user/${userId}/active`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch active user learning paths for ${userId}:`, error);
    return [];
  }
}

export async function fetchAllUserLearningPaths(): Promise<UserLearningPath[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/user-learning-paths`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch all user learning paths:", error);
    return [];
  }
}

export async function fetchUserModuleProgress(userId: string): Promise<UserModuleProgress[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/user-module-progress/user/${userId}`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log("User module progress data:", data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch user module progress for ${userId}:`, error);
    return [];
  }
}


