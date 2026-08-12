"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  PlayCircle,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  Clock,
  Upload,
  ExternalLink,
  Video,
  BookOpen,
} from "lucide-react";
import {
  fetchModules,
  fetchAllLessons,
  fetchLessonsByModuleId,
  createLesson,
  updateLesson,
  deleteLesson,
  uploadLessonVideo,
  getLessonVideoSignedUrl,
  CourseModule,
  Lesson,
} from "@/lib/api";

function LessonsContent() {
  const searchParams = useSearchParams();
  const initialModuleId = searchParams.get("moduleId") || "";

  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>(initialModuleId);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal / Form states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [createModalFile, setCreateModalFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadLessonTarget, setUploadLessonTarget] = useState<Lesson | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Signed URL preview state
  const [signedUrlModal, setSignedUrlModal] = useState<{ open: boolean; url: string; title: string }>({
    open: false,
    url: "",
    title: "",
  });

  const [form, setForm] = useState({
    moduleId: "",
    title: "",
    videoUrl: "",
    durationMinutes: 15,
    sequenceOrder: 1,
    summary: "",
    resourcesUrl: "",
  });

  useEffect(() => {
    loadModulesAndLessons();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModuleId]);

  async function loadModulesAndLessons() {
    setIsLoading(true);
    try {
      const modulesData = await fetchModules();
      setModules(modulesData || []);

      if (selectedModuleId) {
        const lessonsData = await fetchLessonsByModuleId(selectedModuleId);
        setLessons(lessonsData || []);
      } else {
        const allLessonsData = await fetchAllLessons();
        setLessons(allLessonsData || []);
      }
    } catch (error) {
      console.error("Failed to load lessons/modules:", error);
      toast.error("Failed to fetch lesson data.");
    } finally {
      setIsLoading(false);
    }
  }

  const openCreateModal = (modId?: string) => {
    const targetMod = modId || selectedModuleId || (modules.length > 0 ? modules[0].id : "");
    const moduleLessons = lessons.filter((l) => l.moduleId === targetMod);
    const nextSeq = moduleLessons.length > 0 ? Math.max(...moduleLessons.map((l) => l.sequenceOrder || 0)) + 1 : 1;

    setEditingLesson(null);
    setCreateModalFile(null);
    setForm({
      moduleId: targetMod,
      title: "",
      videoUrl: "",
      durationMinutes: 15,
      sequenceOrder: nextSeq,
      summary: "",
      resourcesUrl: "",
    });
    setShowModal(true);
  };

  const openEditModal = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setCreateModalFile(null);
    setForm({
      moduleId: lesson.moduleId,
      title: lesson.title,
      videoUrl: lesson.videoUrl || "",
      durationMinutes: lesson.durationMinutes ?? 0,
      sequenceOrder: lesson.sequenceOrder,
      summary: lesson.summary || "",
      resourcesUrl: lesson.resourcesUrl || "",
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Lesson title is required!");
      return;
    }
    if (!form.moduleId) {
      toast.error("Please select a module for this lesson.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingLesson) {
        let finalVideoUrl = form.videoUrl;

        // 1. Upload video file first if selected, to get the resulting res.videoUrl
        if (createModalFile) {
          toast.info(`Uploading video "${createModalFile.name}"...`);
          const uploadRes = await uploadLessonVideo(editingLesson.id, createModalFile);
          if (uploadRes && uploadRes.videoUrl) {
            finalVideoUrl = uploadRes.videoUrl;
            toast.success("Video file uploaded! Using response URL.");
          } else {
            toast.warning("Video upload failed. Proceeding with existing URL.");
          }
        }

        // 2. Update lesson details using the resulting videoUrl
        const success = await updateLesson(editingLesson.id, {
          moduleId: form.moduleId,
          title: form.title,
          videoUrl: finalVideoUrl,
          durationMinutes: Number(form.durationMinutes),
          sequenceOrder: Number(form.sequenceOrder),
          summary: form.summary,
          resourcesUrl: form.resourcesUrl,
        });

        if (success) {
          toast.success("Lesson updated successfully!");
          setShowModal(false);
          setEditingLesson(null);
          setCreateModalFile(null);
          loadModulesAndLessons();
        } else {
          toast.error("Failed to update lesson.");
        }
      } else {
        // 1. Create lesson record first to obtain the lessonId
        const created = await createLesson({
          moduleId: form.moduleId,
          title: form.title,
          videoUrl: form.videoUrl,
          durationMinutes: Number(form.durationMinutes),
          sequenceOrder: Number(form.sequenceOrder),
          summary: form.summary,
          resourcesUrl: form.resourcesUrl,
        });

        if (!created || !created.id) {
          toast.error("Failed to create lesson.");
          return;
        }

        toast.success("Lesson created successfully!");

        // 2. If a video file was selected, upload via POST /api/lessons/{lessonId}/upload-video then use res.videoUrl
        if (createModalFile) {
          toast.info(`Uploading video file "${createModalFile.name}"...`);
          const uploadRes = await uploadLessonVideo(created.id, createModalFile);

          if (uploadRes && uploadRes.videoUrl) {
            // Update lesson with the resulting res.videoUrl from the upload response
            await updateLesson(created.id, { videoUrl: uploadRes.videoUrl });
            toast.success("Uploaded video linked to lesson successfully!");
          } else {
            toast.warning("Lesson created, but video file upload failed.");
          }
        }

        setShowModal(false);
        setEditingLesson(null);
        setCreateModalFile(null);
        loadModulesAndLessons();
      }
    } catch (err) {
      console.error("Error saving lesson and uploading video:", err);
      toast.error("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete lesson "${title}"?`)) {
      const success = await deleteLesson(id);
      if (success) {
        toast.success("Lesson deleted successfully!");
        loadModulesAndLessons();
      } else {
        toast.error("Failed to delete lesson.");
      }
    }
  };

  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadLessonTarget || !selectedFile) {
      toast.error("Please select a video file to upload.");
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadLessonVideo(uploadLessonTarget.id, selectedFile);
      if (res && res.videoUrl) {
        toast.success("Video uploaded successfully!");
        setShowUploadModal(false);
        setSelectedFile(null);
        setUploadLessonTarget(null);
        loadModulesAndLessons();
      } else {
        toast.error("Upload failed or backend did not return videoUrl.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Video upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGetSignedUrl = async (lesson: Lesson) => {
    try {
      const res = await getLessonVideoSignedUrl(lesson.id);
      if (res && res.videoUrl) {
        setSignedUrlModal({
          open: true,
          url: res.videoUrl,
          title: lesson.title,
        });
      } else {
        setSignedUrlModal({
          open: true,
          url: lesson.videoUrl,
          title: lesson.title,
        });
      }
    } catch {
      toast.info(`Opening stream URL for "${lesson.title}"`);
      setSignedUrlModal({
        open: true,
        url: lesson.videoUrl,
        title: lesson.title,
      });
    }
  };

  const selectedModuleObj = modules.find((m) => m.id === selectedModuleId);

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-indigo-600" />
            <span>Lesson Content Administration</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Create, sequence, and manage video lessons and learning materials for each module.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadModulesAndLessons}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            title="Refresh Lessons"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => openCreateModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-md shadow-[#1e3a8a]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Lesson
          </button>
        </div>
      </div>

      {/* Module Selector Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Filter by Module:</label>
          <select
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            className="w-full sm:w-72 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">-- All Modules ({modules.length}) --</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title} ({m.topic || "Module"})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs font-bold text-slate-500">
          Showing <span className="text-indigo-600 font-extrabold">{lessons.length}</span> lesson{lessons.length === 1 ? "" : "s"}
          {selectedModuleObj ? ` in "${selectedModuleObj.title}"` : " across all modules"}
        </div>
      </div>

      {/* Lessons Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <th className="p-4 w-14 text-center">Seq</th>
              <th className="p-4">Lesson Title & Details</th>
              <th className="p-4">Module</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Media & Video</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lessons.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-400 font-medium">
                  <PlayCircle className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-60" />
                  No lessons found for the selected view.
                  <div className="mt-2">
                    <button
                      onClick={() => openCreateModal()}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      + Click here to add a lesson
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              lessons
                .sort((a, b) => (a.sequenceOrder || 0) - (b.sequenceOrder || 0))
                .map((lesson) => {
                  const parentMod = modules.find((m) => m.id === lesson.moduleId);
                  return (
                    <tr key={lesson.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-extrabold text-xs">
                          {lesson.sequenceOrder || 1}
                        </span>
                      </td>
                      <td className="p-4 space-y-1 max-w-xs md:max-w-md">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span>{lesson.title}</span>
                          {lesson.resourcesUrl && (
                            <a
                              href={lesson.resourcesUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-indigo-600"
                              title="View Lesson Attachment/Resource"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        {lesson.summary && (
                          <div className="text-slate-500 line-clamp-2 text-[11px]">
                            {lesson.summary}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {parentMod ? parentMod.title : "Module " + lesson.moduleId?.slice(0, 6)}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lesson.durationMinutes || 0} mins</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {lesson.videoUrl ? (
                            <button
                              onClick={() => handleGetSignedUrl(lesson)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer"
                              title="Preview Lesson Stream"
                            >
                              <Video className="w-3.5 h-3.5" />
                              Stream URL
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No URL set</span>
                          )}
                          <button
                            onClick={() => {
                              setUploadLessonTarget(lesson);
                              setShowUploadModal(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 transition-all cursor-pointer"
                            title="Upload Video File"
                          >
                            <Upload className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(lesson)}
                          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all cursor-pointer"
                          title="Edit Lesson"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lesson.id, lesson.title)}
                          className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                          title="Delete Lesson"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT LESSON MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-indigo-600" />
                <span>{editingLesson ? "Edit Lesson" : "Create New Lesson"}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Module</label>
                <select
                  required
                  value={form.moduleId}
                  onChange={(e) => setForm({ ...form, moduleId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                >
                  <option value="" disabled>-- Select Target Module --</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 1.1 Architecture & Core Components"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sequence Order</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.sequenceOrder}
                    onChange={(e) => setForm({ ...form, sequenceOrder: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.durationMinutes}
                    onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload Video File from Computer (Lecturer Upload)
                </label>
                <div className="p-3 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 space-y-2">
                  <div className="flex items-center gap-3">
                    <Upload className="w-4 h-4 text-indigo-600 shrink-0" />
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setCreateModalFile(e.target.files[0]);
                        }
                      }}
                      className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                    />
                  </div>
                  {createModalFile && (
                    <div className="text-[11px] font-bold text-indigo-700 flex items-center justify-between bg-white p-2 rounded-xl border border-indigo-100">
                      <span className="truncate max-w-[320px]">
                        📁 {createModalFile.name} ({(createModalFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                      <button
                        type="button"
                        onClick={() => setCreateModalFile(null)}
                        className="text-red-500 hover:underline text-[10px] shrink-0 font-bold"
                      >
                        Remove file
                      </button>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500 font-medium">
                    The video file will be automatically uploaded to the backend server when you click &quot;{editingLesson ? "Save Changes" : "Create Lesson"}&quot;.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Video Stream / Embed URL (Optional)</label>
                <input
                  type="text"
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="e.g. https://www.youtube.com/embed/... or external MP4 URL"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Resources / Attachments URL</label>
                <input
                  type="text"
                  value={form.resourcesUrl}
                  onChange={(e) => setForm({ ...form, resourcesUrl: e.target.value })}
                  placeholder="e.g. https://github.com/... or PDF link"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lesson Summary / Transcript Notes</label>
                <textarea
                  rows={3}
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Key concepts covered in this lesson..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1e3a8a] text-white text-xs font-bold shadow-md shadow-[#1e3a8a]/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {isSubmitting
                    ? createModalFile
                      ? "Saving & Uploading Video..."
                      : "Saving Lesson..."
                    : editingLesson
                    ? "Save Changes"
                    : "Create Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD VIDEO MODAL */}
      {showUploadModal && uploadLessonTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                <span>Upload Video File</span>
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadLessonTarget(null);
                  setSelectedFile(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadVideo} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-bold text-slate-900">{uploadLessonTarget.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Lesson ID: {uploadLessonTarget.id}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Video File (.mp4, .webm, .mov)</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadLessonTarget(null);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1e3a8a] text-white text-xs font-bold shadow-md shadow-[#1e3a8a]/20 disabled:opacity-50 cursor-pointer"
                >
                  {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  {isUploading ? "Uploading..." : "Upload File"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STREAM / SIGNED URL MODAL */}
      {signedUrlModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-600" />
                <span>Stream Preview: {signedUrlModal.title}</span>
              </h3>
              <button
                onClick={() => setSignedUrlModal({ open: false, url: "", title: "" })}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full aspect-video rounded-2xl bg-slate-900 overflow-hidden relative border border-slate-800 flex items-center justify-center">
              {signedUrlModal.url.includes("youtube.com") || signedUrlModal.url.includes("youtu.be") ? (
                <iframe
                  src={signedUrlModal.url.replace("watch?v=", "embed/")}
                  className="w-full h-full"
                  allowFullScreen
                  title={signedUrlModal.title}
                />
              ) : (
                <video src={signedUrlModal.url} controls className="w-full h-full object-contain" />
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="truncate max-w-md">Stream URL: {signedUrlModal.url}</span>
              <a
                href={signedUrlModal.url}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 font-bold hover:underline shrink-0"
              >
                Open directly
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLessonsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-xs font-bold">Loading Lessons Manager...</div>}>
      <LessonsContent />
    </Suspense>
  );
}
