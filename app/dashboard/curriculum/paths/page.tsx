"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  fetchLearningPaths,
  createLearningPath,
  updateLearningPath,
  deleteLearningPath,
  LearningPath,
} from "@/lib/api";

export default function CurriculumPathsPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal / Form states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingPath, setEditingPath] = useState<LearningPath | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    level: "BEGINNER",
    estimatedHours: 40,
  });

  useEffect(() => {
    loadPaths();
  }, []);

  const loadPaths = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLearningPaths();
      setPaths(data || []);
    } catch (error) {
      console.error("Failed to load learning paths:", error);
      toast.error("Failed to fetch learning paths.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Path title is required!");
      return;
    }

    if (editingPath) {
      const success = await updateLearningPath(editingPath.id, {
        title: form.title,
        description: form.description,
        level: form.level,
        estimatedHours: Number(form.estimatedHours),
      });

      if (success) {
        toast.success("Learning path updated successfully!");
        setShowModal(false);
        setEditingPath(null);
        loadPaths();
      } else {
        toast.error("Failed to update learning path.");
      }
    } else {
      const created = await createLearningPath({
        title: form.title,
        description: form.description,
        level: form.level,
        estimatedHours: Number(form.estimatedHours),
      });

      if (created) {
        toast.success("Learning path created successfully!");
        setShowModal(false);
        setForm({ title: "", description: "", level: "BEGINNER", estimatedHours: 40 });
        loadPaths();
      } else {
        toast.error("Failed to create learning path.");
      }
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete learning path "${title}"?`)) {
      const success = await deleteLearningPath(id);
      if (success) {
        toast.success("Learning path deleted!");
        loadPaths();
      } else {
        toast.error("Failed to delete learning path.");
      }
    }
  };

  const openEdit = (path: LearningPath) => {
    setEditingPath(path);
    setForm({
      title: path.title,
      description: path.description || "",
      level: path.level || "BEGINNER",
      estimatedHours: path.estimatedHours || 40,
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#1e3a8a]" />
            <span>Learning Paths Management</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Create, edit, and delete structured student learning path roadmaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadPaths}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            title="Refresh Paths"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => {
              setEditingPath(null);
              setForm({ title: "", description: "", level: "BEGINNER", estimatedHours: 40 });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-md shadow-[#1e3a8a]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Learning Path
          </button>
        </div>
      </div>

      {/* Paths Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <th className="p-4">Title & Description</th>
              <th className="p-4">Level</th>
              <th className="p-4">Est. Hours</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paths.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400 font-medium">
                  No learning paths found. Click &quot;Add Learning Path&quot; to create one.
                </td>
              </tr>
            ) : (
              paths.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 space-y-1">
                    <div className="font-bold text-slate-900 text-sm">{p.title}</div>
                    <div className="text-slate-500 line-clamp-1">{p.description}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-[#1e3a8a] border border-blue-100">
                      {p.level}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">{p.estimatedHours} hrs</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all cursor-pointer"
                      title="Edit Path"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                      title="Delete Path"
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
                {editingPath ? "Edit Learning Path" : "Add Learning Path"}
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Path Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Spring Boot + Next.js Specialist"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed path description..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty Level</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.estimatedHours}
                    onChange={(e) => setForm({ ...form, estimatedHours: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                  />
                </div>
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
                  {editingPath ? "Save Changes" : "Create Path"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
