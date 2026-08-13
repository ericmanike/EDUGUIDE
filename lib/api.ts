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
export function getCurrentUser(): User {
  if (typeof window !== "undefined") {
    const token = getToken();
    if (token) {
      const decoded = decodeJwtToken(token);
      if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
        return {
          id: decoded.id || "u-student",
          email: decoded.email || decoded.sub || "student@fastlearn.edu",
          name: decoded.name || (decoded.email ? decoded.email.split("@")[0] : "Student"),
          role: decoded.role || "STUDENT",
        };
      }
    }
  }
  return {
    id: "u-guest",
    email: "student@fastlearn.edu",
    name: "Student",
    role: "STUDENT",
  };
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
    return await res.json();
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
    return await res.json();
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
    return await res.json();
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
    const res = await fetch(`${API_BASE_URL}/lessons/module/${lessonData.moduleId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(lessonData),
    });
    if (!res.ok) {
      // Fallback to /lessons if /lessons/module/{moduleId} fails
      const fallbackRes = await fetch(`${API_BASE_URL}/lessons`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(lessonData),
      });
      if (!fallbackRes.ok) throw new Error(`HTTP ${fallbackRes.status}`);
      return await fallbackRes.json();
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to create lesson:", error);
    return null;
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
  try {
    const res = await fetch(`${API_BASE_URL}/user-lesson-progress`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(progressData),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to upsert user lesson progress:", error);
    return null;
  }
}

export async function fetchUserLessonProgress(
  userId: string,
  lessonId: string
): Promise<UserLessonProgress | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/user-lesson-progress/user/${userId}/lesson/${lessonId}`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch user lesson progress:", error);
    return null;
  }
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
    return await res.json();
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
    return await res.json();
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
    const userId = user?.id || "u-guest";

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
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch user module progress for ${userId}:`, error);
    return [];
  }
}


