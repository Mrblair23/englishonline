import { useState, useEffect, useCallback } from "react";
import useAdmin from "@/utils/useAdmin";
import AdminLayout from "@/components/AdminLayout";
import { apiFetch } from "@/utils/apiClient";
import {
  Settings as SettingsIcon,
  Save,
  DollarSign,
  Calendar,
  Mail,
  FileText,
  Layers3,
  Plus,
} from "lucide-react";

function sortClassTypes(list) {
  return [...list].sort((a, b) => a.name.localeCompare(b.name));
}

export default function AdminSettingsPage() {
  const { isAdmin, loading } = useAdmin();
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [classTypes, setClassTypes] = useState([]);
  const [loadingClassTypes, setLoadingClassTypes] = useState(true);
  const [classTypeError, setClassTypeError] = useState(null);
  const [showCreateClassTypeModal, setShowCreateClassTypeModal] = useState(false);
  const [showEditClassTypeModal, setShowEditClassTypeModal] = useState(false);
  const [editingClassType, setEditingClassType] = useState(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      window.location.href = "/account/signin";
    }
  }, [isAdmin, loading]);

  // Load pricing plans
  useEffect(() => {
    async function loadPlans() {
      try {
        const response = await apiFetch("/pricing");
        if (!response.ok) throw new Error("Failed to load plans");
        const data = await response.json();
        setPricingPlans(data.tiers || []);
      } catch (error) {
        console.error("Error loading plans:", error);
      } finally {
        setLoadingPlans(false);
      }
    }
    if (isAdmin) {
      loadPlans();
    }
  }, [isAdmin]);

  const loadClassTypes = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingClassTypes(true);
    setClassTypeError(null);
    try {
      const response = await apiFetch("/admin/class-types");
      if (!response.ok) {
        throw new Error("Failed to load class types");
      }
      const payload = await response.json();
      const list = Array.isArray(payload.classTypes) ? payload.classTypes : [];
      setClassTypes(sortClassTypes(list));
    } catch (error) {
      console.error("Error loading class types:", error);
      setClassTypeError("Unable to load class types. Please try again.");
      setClassTypes([]);
    } finally {
      setLoadingClassTypes(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadClassTypes();
  }, [loadClassTypes]);

  const updatePlanPrice = (planId, field, value) => {
    setPricingPlans((plans) =>
      plans.map((plan) =>
        plan.id === planId ? { ...plan, [field]: parseInt(value) || 0 } : plan,
      ),
    );
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Save pricing plans
      const response = await apiFetch("/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plans: pricingPlans }),
      });

      if (!response.ok) throw new Error("Failed to save");

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleClassType = async (typeId) => {
    try {
      const response = await apiFetch(`/admin/class-types/${typeId}/toggle`, {
        method: "PATCH",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to toggle class type");
      }
      setClassTypes((prev) =>
        sortClassTypes(
          prev.map((type) => (type.id === data.classType.id ? data.classType : type)),
        ),
      );
    } catch (error) {
      console.error("Error toggling class type:", error);
      alert(error.message || "Unable to toggle class type");
    }
  };

  const handleCreateClassType = async (formState) => {
    try {
      const response = await apiFetch("/admin/class-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          mode: formState.mode,
          durationMinutes: Number(formState.durationMinutes),
          maxStudents: Number(formState.maxStudents),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create class type");
      }
      setClassTypes((prev) => sortClassTypes([...prev, data.classType]));
      setShowCreateClassTypeModal(false);
      return data.classType;
    } catch (error) {
      console.error("Error creating class type:", error);
      throw error;
    }
  };

  const handleUpdateClassType = async (formState) => {
    if (!editingClassType) return null;
    try {
      const response = await apiFetch(`/admin/class-types/${editingClassType.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          mode: formState.mode,
          durationMinutes: Number(formState.durationMinutes),
          maxStudents: Number(formState.maxStudents),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update class type");
      }
      setClassTypes((prev) =>
        sortClassTypes(
          prev.map((type) => (type.id === data.classType.id ? data.classType : type)),
        ),
      );
      setShowEditClassTypeModal(false);
      setEditingClassType(null);
      return data.classType;
    } catch (error) {
      console.error("Error updating class type:", error);
      throw error;
    }
  };

  const handleOpenEditClassType = (classType) => {
    setEditingClassType(classType);
    setShowEditClassTypeModal(true);
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bm-page-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#3FA9A6]"></div>
      </div>
    );
  }

  return (
    <AdminLayout currentPage="settings">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            System Settings
          </h1>
          <p className="text-gray-600">
            Configure platform settings and preferences
          </p>
        </div>

        <form onSubmit={saveSettings} className="max-w-4xl space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Layers3 size={24} className="text-indigo-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Class Types</h2>
                  <p className="text-sm text-gray-500">
                    Manage templates for duration, capacity, and mode.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateClassTypeModal(true)}
                className="bm-btn-outline"
              >
                <Plus size={16} /> New class type
              </button>
            </div>
            {classTypeError && (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {classTypeError}
              </div>
            )}
            {loadingClassTypes ? (
              <div className="mt-6 flex items-center justify-center gap-3 text-sm text-gray-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-[#3FA9A6]"></div>
                Loading class types...
              </div>
            ) : classTypes.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                No class types yet. Create one to start scheduling.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {classTypes.map((type) => (
                  <div key={type.id} className="rounded-2xl border border-gray-100 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{type.name}</p>
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          {type.mode === "group" ? "Group" : "Private"} • {type.durationMinutes} min
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          type.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {type.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
                      <span>Capacity {type.maxStudents}</span>
                      <div className="flex gap-3 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => handleOpenEditClassType(type)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleClassType(type.id)}
                          className="text-[#1F2A44] hover:underline"
                        >
                          Toggle
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Settings */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign size={24} className="text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Pricing Plans</h2>
            </div>

            {loadingPlans ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3FA9A6] mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {pricingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-4 border-2 border-gray-100 rounded-xl hover:border-[#3FA9A6] transition-colors"
                  >
                    <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                      {plan.name}
                      {plan.is_popular && (
                        <span className="text-xs bg-[#F2B705] text-[#1F2A44] px-2 py-1 rounded-lg font-bold">
                          POPULAR
                        </span>
                      )}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                        {plan.class_type === "private" ? "Private" : "Group"} •{" "}
                        {plan.classes_per_week}x/week
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Price (USD)
                        </label>
                        <input
                          type="number"
                          value={plan.price_usd || 0}
                          onChange={(e) =>
                            updatePlanPrice(
                              plan.id,
                              "price_usd",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Price (COP)
                        </label>
                        <input
                          type="number"
                          value={plan.price_cop || 0}
                          onChange={(e) =>
                            updatePlanPrice(
                              plan.id,
                              "price_cop",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rest of settings sections... */}
          {/* Currency Settings */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Currency Display
            </h2>
            <select
              defaultValue="both"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6]"
            >
              <option value="usd">USD Only</option>
              <option value="cop">COP Only</option>
              <option value="both">Both Currencies</option>
            </select>
          </div>

          {/* Email Settings */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Mail size={24} className="text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Email Settings
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sender Name
                </label>
                <input
                  type="text"
                  defaultValue="Be More English Online"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6]"
                />
              </div>
            </div>
          </div>

          {/* Legal Text */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <FileText size={24} className="text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Legal Text</h2>
            </div>
            <textarea
              rows="4"
              defaultValue="All classes are subject to our terms and conditions."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6] resize-none"
            ></textarea>
          </div>

          {/* Schedule Settings */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Calendar size={24} className="text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Schedule Settings
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Class Duration (minutes)
                </label>
                <input
                  type="number"
                  defaultValue="60"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blackout Dates (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="2026-12-25, 2026-01-01"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6]"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-6">
            {saveSuccess && (
              <span className="text-green-600 font-semibold">
                ✓ Settings saved successfully!
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="ml-auto inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#3FA9A6] to-[#2d7b78] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>

        {showCreateClassTypeModal && (
          <ClassTypeModal
            title="Create class type"
            submitLabel="Create type"
            initialState={{ name: "", mode: "group", durationMinutes: 60, maxStudents: 1 }}
            onClose={() => setShowCreateClassTypeModal(false)}
            onSubmit={handleCreateClassType}
          />
        )}

        {showEditClassTypeModal && editingClassType && (
          <ClassTypeModal
            title="Edit class type"
            submitLabel="Save changes"
            initialState={{
              name: editingClassType.name ?? "",
              mode: editingClassType.mode ?? "group",
              durationMinutes: editingClassType.durationMinutes ?? 60,
              maxStudents: editingClassType.maxStudents ?? 1,
            }}
            onClose={() => {
              setShowEditClassTypeModal(false);
              setEditingClassType(null);
            }}
            onSubmit={handleUpdateClassType}
          />
        )}
      </div>
    </AdminLayout>
  );
}

function ClassTypeModal({ title, submitLabel, initialState, onClose, onSubmit }) {
  const [formState, setFormState] = useState({
    name: initialState?.name ?? "",
    mode: initialState?.mode ?? "group",
    durationMinutes: String(initialState?.durationMinutes ?? 60),
    maxStudents: String(initialState?.maxStudents ?? 1),
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormState({
      name: initialState?.name ?? "",
      mode: initialState?.mode ?? "group",
      durationMinutes: String(initialState?.durationMinutes ?? 60),
      maxStudents: String(initialState?.maxStudents ?? 1),
    });
  }, [initialState]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formState);
      setSubmitting(false);
    } catch (error) {
      alert(error.message || "Unable to save class type");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Class types</p>
            <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-gray-400 hover:text-gray-700"
          >
            Close
          </button>
        </header>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600">Name</label>
            <input
              required
              value={formState.name}
              onChange={handleChange("name")}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Mode</label>
            <select
              value={formState.mode}
              onChange={handleChange("mode")}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-amber-500 focus:outline-none"
            >
              <option value="group">Group</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Duration (minutes)</label>
            <input
              required
              type="number"
              min="15"
              value={formState.durationMinutes}
              onChange={handleChange("durationMinutes")}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Capacity (students)</label>
            <input
              required
              type="number"
              min="1"
              value={formState.maxStudents}
              onChange={handleChange("maxStudents")}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-2xl bg-gradient-to-r from-[#1F2A44] to-[#11182c] py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
