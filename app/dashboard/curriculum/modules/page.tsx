"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  Clock,
  PlayCircle,
} from "lucide-react";
import {
  fetchModules,
  createModule,
  updateModule,
  deleteModule,
  CourseModule,
} from "@/lib/api";

export default function CurriculumModulesPage() {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal / Form states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [form, setForm] = useState({
    title: "",
    topic: "",
    description: "",
    durationMinutes: 120,
  });

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    setIsLoading(true);
    try {
      const data = await fetchModules();
      setModules(data || []);
    } catch (error) {
      console.error("Failed to load modules:", error);
      toast.error("Failed to fetch course modules.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Module title is required!");
      return;
    }

    if (editingModule) {
      const success = await updateModule(editingModule.id, {
        title: form.title,
        topic: form.topic,
        description: form.description,
        durationMinutes: Number(form.durationMinutes),
      });

      if (success) {
        toast.success("Module updated successfully!");
        setShowModal(false);
        setEditingModule(null);
        loadModules();
      } else {
        toast.error("Failed to update module.");
      }
    } else {
      const created = await createModule({
        title: form.title,
        topic: form.topic,
        description: form.description,
        durationMinutes: Number(form.durationMinutes),
      });

      if (created) {
        toast.success("Module created successfully!");
        setShowModal(false);
        setForm({ title: "", topic: "", description: "", durationMinutes: 120 });
        loadModules();
      } else {
        toast.error("Failed to create module.");
      }
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete module "${title}"?`)) {
      const success = await deleteModule(id);
      if (success) {
        toast.success("Module deleted!");
        loadModules();
      } else {
        toast.error("Failed to delete module.");
      }
    }
  };

  const openEdit = (mod: CourseModule) => {
    setEditingModule(mod);
    setForm({
      title: mod.title,
      topic: mod.topic || "",
      description: mod.description || "",
      durationMinutes: mod.durationMinutes || 60,
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Course Modules Management</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Add, update, or remove individual course subjects, topics, and durations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadModules}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            title="Refresh Modules"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => {
              setEditingModule(null);
              setForm({ title: "", topic: "", description: "", durationMinutes: 120 });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-md shadow-[#1e3a8a]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Course Module
          </button>
        </div>
      </div>

      {/* Modules Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <th className="p-4">Module Title & Description</th>
              <th className="p-4">Topic Category</th>
              <th className="p-4">Duration</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {modules.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400 font-medium">
                  No course modules found. Click &quot;Add Course Module&quot; to create one.
                </td>
              </tr>
            ) : (
              modules.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 space-y-1">
                    <div className="font-bold text-slate-900 text-sm">{m.title}</div>
                    <div className="text-slate-500 line-clamp-1">{m.description}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {m.topic || "Core Module"}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">{m.durationMinutes} mins</td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/dashboard/curriculum/lessons?moduleId=${m.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer"
                      title="Manage Lessons for this Module"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      Manage Lessons
                    </Link>
                    <button
                      onClick={() => openEdit(m)}
                      className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all cursor-pointer"
                      title="Edit Module"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id, m.title)}
                      className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                      title="Delete Module"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingModule ? "Edit Course Module" : "Add Course Module"}
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Module Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Spring Security JWT Authentication"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Topic Category</label>
                  <input
                    type="text"
                    required
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    placeholder="e.g. Spring Boot"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={form.durationMinutes}
                    onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Module summary and objectives..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1e3a8a] text-white text-xs font-bold shadow-md shadow-[#1e3a8a]/20"
                >
                  {editingModule ? "Save Changes" : "Create Module"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
