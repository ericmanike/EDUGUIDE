"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Link as LinkIcon,
  Plus,
  Trash2,
  RefreshCw,
  X,
  Edit2,
} from "lucide-react";
import {
  fetchLearningPaths,
  fetchModules,
  fetchPathModules,
  createPathModule,
  updatePathModule,
  deletePathModule,
  LearningPath,
  CourseModule,
  PathModule,
} from "@/lib/api";

export default function CurriculumMappingsPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [mappings, setMappings] = useState<PathModule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal / Form states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingMapping, setEditingMapping] = useState<PathModule | null>(null);
  const [form, setForm] = useState({
    pathId: "",
    moduleId: "",
    sequenceOrder: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pathsData, modulesData, mappingsData] = await Promise.all([
        fetchLearningPaths(),
        fetchModules(),
        fetchPathModules(),
      ]);
      setPaths(pathsData || []);
      setModules(modulesData || []);
      setMappings(mappingsData || []);
    } catch (error) {
      console.error("Failed to load mappings:", error);
      toast.error("Failed to fetch path-module mappings.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pathId || !form.moduleId) {
      toast.error("Please select both a learning path and a course module!");
      return;
    }

    if (editingMapping) {
      const success = await updatePathModule(editingMapping.id, Number(form.sequenceOrder));
      if (success) {
        toast.success("Sequence order updated successfully!");
        setShowModal(false);
        setEditingMapping(null);
        loadData();
      } else {
        toast.error("Failed to update sequence order.");
      }
    } else {
      const created = await createPathModule({
        pathId: form.pathId,
        moduleId: form.moduleId,
        sequenceOrder: Number(form.sequenceOrder),
      });

      if (created) {
        toast.success("Module mapped to learning path successfully!");
        setShowModal(false);
        loadData();
      } else {
        toast.error("Failed to create path-module mapping.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this module from the learning path?")) {
      const success = await deletePathModule(id);
      if (success) {
        toast.success("Mapping deleted!");
        loadData();
      } else {
        toast.error("Failed to delete mapping.");
      }
    }
  };

  const openEdit = (mapping: PathModule) => {
    setEditingMapping(mapping);
    const raw = mapping as any;
    const pId = mapping.pathId || raw.path_id || raw.path?.id || "";
    const mId = mapping.moduleId || raw.module_id || raw.module?.id || "";
    const seq = mapping.sequenceOrder ?? raw.sequence_order ?? 1;

    setForm({
      pathId: pId,
      moduleId: mId,
      sequenceOrder: seq,
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-amber-600" />
            <span>Path-Module Sequence Mappings</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Map course modules to learning paths and adjust sequence ordering.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            title="Refresh Mappings"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => {
              setEditingMapping(null);
              setForm({
                pathId: paths[0]?.id || "",
                moduleId: modules[0]?.id || "",
                sequenceOrder: 1,
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-md shadow-[#1e3a8a]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Map Module to Path
          </button>
        </div>
      </div>

      {/* Mappings Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <th className="p-4">Learning Path</th>
              <th className="p-4">Mapped Course Module</th>
              <th className="p-4">Sequence Order</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mappings.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400 font-medium">
                  No path-module mappings found. Click &quot;Map Module to Path&quot; to assign a module.
                </td>
              </tr>
            ) : (
              mappings.map((pm) => {
                const rawPm = pm as any;
                const pId = pm.pathId || rawPm.path_id || rawPm.path?.id || "";
                const mId = pm.moduleId || rawPm.module_id || rawPm.module?.id || "";

                const targetPath = paths.find((p) => p.id === pId || String(p.id) === String(pId));
                const targetModule = modules.find((m) => m.id === mId || String(m.id) === String(mId));

                const displayPathTitle =
                  pm.pathTitle ||
                  rawPm.path_title ||
                  rawPm.path?.title ||
                  targetPath?.title ||
                  (pId ? `Path ID: ${pId.slice(0, 8)}...` : "Unknown Learning Path");

                const displayModuleTitle =
                  pm.moduleTitle ||
                  rawPm.module_title ||
                  rawPm.module?.title ||
                  targetModule?.title ||
                  (mId ? `Module ID: ${mId.slice(0, 8)}...` : "Unknown Course Module");

                const seqOrder = pm.sequenceOrder ?? rawPm.sequence_order ?? 1;

                return (
                  <tr key={pm.id || rawPm.id || `${pId}-${mId}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      {displayPathTitle}
                    </td>
                    <td className="p-4 font-semibold text-slate-700">
                      {displayModuleTitle}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 font-bold text-slate-800 text-[11px]">
                        Step #{seqOrder}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEdit(pm)}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all cursor-pointer"
                        title="Edit Sequence Order"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pm.id || rawPm.id)}
                        className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                        title="Remove Mapping"
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

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingMapping ? "Edit Sequence Order" : "Map Module to Learning Path"}
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Learning Path</label>
                <select
                  value={form.pathId}
                  disabled={!!editingMapping}
                  onChange={(e) => setForm({ ...form, pathId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] disabled:bg-slate-100"
                >
                  <option value="">-- Choose Learning Path --</option>
                  {paths.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Course Module</label>
                <select
                  value={form.moduleId}
                  disabled={!!editingMapping}
                  onChange={(e) => setForm({ ...form, moduleId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] disabled:bg-slate-100"
                >
                  <option value="">-- Choose Module --</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.durationMinutes} mins)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sequence Order Number</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.sequenceOrder}
                  onChange={(e) => setForm({ ...form, sequenceOrder: Number(e.target.value) })}
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
                  {editingMapping ? "Save Sequence" : "Map Module"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
