import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Power, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import AdminLayout from "@/components/AdminLayout";
import useAdmin from "@/utils/useAdmin";
import { apiFetch } from "@/utils/apiClient";

/* ── helpers ─────────────────────────────────────────── */

function formatMoney(cents) {
  const n = Number(cents);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n / 100);
}

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function normalizeApiError(payload) {
  if (!payload) return null;
  if (typeof payload === "string") return payload;
  if (typeof payload?.message === "string") return payload.message;
  if (typeof payload?.error === "string") return payload.error;
  return null;
}

function modeLabel(mode) {
  if (mode === "private") return "Private";
  if (mode === "duo") return "Duo";
  return "Group";
}

function modeBadgeColor(mode) {
  if (mode === "private") return "bg-violet-50 text-violet-700";
  if (mode === "duo") return "bg-sky-50 text-sky-700";
  return "bg-emerald-50 text-emerald-700";
}

/* ── default form state ──────────────────────────────── */

const DEFAULT_FORM = {
  slug: "",
  name: "",
  description: "",
  mode: "group",
  price_per_student: "0",
  price_model: "monthly",
  sessions_per_month: "4",
  sessions_per_week: "1",
  cycle_weeks: "4",
  duration_minutes: "60",
  min_students: "1",
  max_students: "6",
  sort_order: "0",
  is_active: true,
};

/* ── page component ──────────────────────────────────── */

export default function AdminBundlesPage() {
  const { isAdmin, loading } = useAdmin();
  const [bundles, setBundles] = useState([]);
  const [isLoadingBundles, setIsLoadingBundles] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      window.location.href = "/account/signin";
    }
  }, [isAdmin, loading]);

  /* ── fetch ─────────────────────────────────────────── */

  const fetchBundles = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoadingBundles(true);
    setError(null);
    try {
      const response = await apiFetch("/api/class-types");
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(normalizeApiError(payload) || "Failed to load bundles");
      }
      const data = await response.json();
      setBundles(Array.isArray(data.bundles) ? data.bundles : []);
    } catch (e) {
      console.error("GET /api/class-types failed", e);
      setError(e?.message || "Unable to load bundles");
      setBundles([]);
    } finally {
      setIsLoadingBundles(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchBundles();
  }, [fetchBundles]);

  const sortedBundles = useMemo(() => {
    return [...bundles].sort((a, b) => {
      const soA = Number(a?.sort_order ?? 0);
      const soB = Number(b?.sort_order ?? 0);
      if (soA !== soB) return soA - soB;
      return Number(a?.id ?? 0) - Number(b?.id ?? 0);
    });
  }, [bundles]);

  /* ── modal helpers ─────────────────────────────────── */

  function openCreate() {
    setEditingBundle(null);
    setForm(DEFAULT_FORM);
    setIsModalOpen(true);
  }

  function openEdit(bundle) {
    setEditingBundle(bundle);
    setForm({
      slug: bundle?.slug ?? "",
      name: bundle?.name ?? "",
      description: bundle?.description ?? "",
      mode: bundle?.mode ?? "group",
      price_per_student: String(bundle?.price_per_student ?? 0),
      price_model: bundle?.price_model ?? "monthly",
      sessions_per_month: String(bundle?.sessions_per_month ?? 4),
      sessions_per_week: String(bundle?.sessions_per_week ?? 1),
      cycle_weeks: String(bundle?.cycle_weeks ?? 4),
      duration_minutes: String(bundle?.duration_minutes ?? 60),
      min_students: String(bundle?.min_students ?? 1),
      max_students: String(bundle?.max_students ?? 6),
      sort_order: String(bundle?.sort_order ?? 0),
      is_active: bundle?.is_active !== false,
    });
    setIsModalOpen(true);
  }

  /* ── save ──────────────────────────────────────────── */

  async function saveBundle(event) {
    event.preventDefault();
    if (isSaving) return;

    const payload = {
      slug: form.slug,
      name: form.name,
      description: form.description,
      mode: form.mode,
      price_per_student: Number(form.price_per_student),
      price_model: form.price_model,
      sessions_per_month: Number(form.sessions_per_month),
      sessions_per_week: Number(form.sessions_per_week),
      cycle_weeks: Number(form.cycle_weeks),
      duration_minutes: Number(form.duration_minutes),
      min_students: Number(form.min_students),
      max_students: Number(form.max_students),
      sort_order: Number(form.sort_order),
      is_active: Boolean(form.is_active),
    };

    setIsSaving(true);
    try {
      const response = await apiFetch(
        editingBundle
          ? `/api/class-types/${editingBundle.id}`
          : "/api/class-types",
        {
          method: editingBundle ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(normalizeApiError(data) || "Save failed");
      }

      toast.success(editingBundle ? "Bundle updated" : "Bundle created");
      setIsModalOpen(false);
      await fetchBundles();
    } catch (e) {
      console.error("Save bundle failed", e);
      toast.error(e?.message || "Unable to save bundle");
    } finally {
      setIsSaving(false);
    }
  }

  /* ── toggle active ─────────────────────────────────── */

  async function toggleActive(bundle) {
    if (!bundle?.id) return;
    if (bundle.is_active) {
      const confirmed = window.confirm(
        "Deactivate this bundle? It will no longer be available for enrollment."
      );
      if (!confirmed) return;
    }

    try {
      const response = await apiFetch(
        `/api/class-types/${bundle.id}/toggle`,
        { method: "PATCH" }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(normalizeApiError(data) || "Toggle failed");
      }

      toast.success(bundle.is_active ? "Bundle deactivated" : "Bundle activated");
      await fetchBundles();
    } catch (e) {
      console.error("Toggle bundle failed", e);
      toast.error(e?.message || "Unable to toggle bundle");
    }
  }

  /* ── loading guard ─────────────────────────────────── */

  if (loading || !isAdmin) {
    return (
      <AdminLayout currentPage="bundles">
        <div className="p-6">Loading…</div>
      </AdminLayout>
    );
  }

  /* ── render ────────────────────────────────────────── */

  return (
    <AdminLayout currentPage="bundles">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="bm-page-title mb-2">Class Bundles</h1>
            <p className="bm-page-subtitle">
              Manage class type bundles, pricing, and enrollment limits
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => fetchBundles()} className="bm-btn-outline">
              <RefreshCw size={18} />
              Refresh
            </button>
            <button onClick={openCreate} className="bm-btn-primary">
              <Plus size={18} />
              Create Bundle
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Table card */}
        <div className="bm-table-card">
          {isLoadingBundles ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
            </div>
          ) : sortedBundles.length === 0 ? (
            <div className="text-center py-12 px-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No bundles yet
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Create your first class bundle.
              </p>
              <button onClick={openCreate} className="bm-btn-primary">
                <Plus size={18} />
                Create Bundle
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Bundle
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Mode
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Sessions / Mo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Students
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Active
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Updated
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedBundles.map((bundle) => (
                    <tr key={bundle.id} className="hover:bg-gray-50">
                      {/* Name + description */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {bundle.name}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {bundle.slug}
                        </div>
                      </td>

                      {/* Mode badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${modeBadgeColor(
                            bundle.mode
                          )}`}
                        >
                          {modeLabel(bundle.mode)}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatMoney(bundle.price_per_student_cents)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {bundle.price_model === "per_session"
                            ? "/ session"
                            : "/ month"}
                        </div>
                      </td>

                      {/* Sessions */}
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {bundle.sessions_per_month}
                      </td>

                      {/* Students min–max */}
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {bundle.min_students === bundle.max_students
                          ? bundle.min_students
                          : `${bundle.min_students}–${bundle.max_students}`}
                      </td>

                      {/* Duration */}
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {bundle.duration_minutes} min
                      </td>

                      {/* Active */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            bundle.is_active
                              ? "bg-sky-50 text-sky-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {bundle.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Updated */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDateTime(bundle.updated_at)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => openEdit(bundle)}
                            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-gray-50"
                          >
                            <span className="inline-flex items-center gap-2">
                              <Pencil size={14} />
                              Edit
                            </span>
                          </button>
                          <button
                            onClick={() => toggleActive(bundle)}
                            className="rounded-2xl bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                          >
                            <span className="inline-flex items-center gap-2">
                              <Power size={14} />
                              Toggle
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Create / Edit Modal ─────────────────────── */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bm-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editingBundle ? "Edit Bundle" : "Create Bundle"}
              </h3>

              <form onSubmit={saveBundle} className="space-y-4">
                {/* Row 1: slug + name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Slug">
                    <input
                      value={form.slug}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, slug: e.target.value }))
                      }
                      required
                      className="bm-input"
                      placeholder="e.g. group-2x"
                    />
                  </Field>

                  <Field label="Name">
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      required
                      className="bm-input"
                      placeholder="e.g. Group 2x/week"
                    />
                  </Field>
                </div>

                {/* Description */}
                <Field label="Description">
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, description: e.target.value }))
                    }
                    rows={2}
                    className="bm-input"
                    placeholder="Short description"
                  />
                </Field>

                {/* Row 2: mode + price model */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Mode">
                    <select
                      value={form.mode}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, mode: e.target.value }))
                      }
                      className="bm-input"
                    >
                      <option value="group">Group</option>
                      <option value="duo">Duo</option>
                      <option value="private">Private</option>
                    </select>
                  </Field>

                  <Field label="Pricing Model">
                    <select
                      value={form.price_model}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, price_model: e.target.value }))
                      }
                      className="bm-input"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="per_session">Per Session</option>
                    </select>
                  </Field>
                </div>

                {/* Row 3: price + sessions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Price per Student (USD)">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price_per_student}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          price_per_student: e.target.value,
                        }))
                      }
                      required
                      className="bm-input"
                    />
                  </Field>

                  <Field label="Sessions / Month">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={form.sessions_per_month}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          sessions_per_month: e.target.value,
                        }))
                      }
                      required
                      className="bm-input"
                    />
                  </Field>

                  <Field label="Sessions / Week">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={form.sessions_per_week}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          sessions_per_week: e.target.value,
                        }))
                      }
                      required
                      className="bm-input"
                    />
                  </Field>
                </div>

                {/* Row 4: duration, min students, max students */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Duration (min)">
                    <input
                      type="number"
                      step="5"
                      min="15"
                      value={form.duration_minutes}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          duration_minutes: e.target.value,
                        }))
                      }
                      required
                      className="bm-input"
                    />
                  </Field>

                  <Field label="Min Students">
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={form.min_students}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          min_students: e.target.value,
                        }))
                      }
                      required
                      className="bm-input"
                    />
                  </Field>

                  <Field label="Max Students">
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={form.max_students}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          max_students: e.target.value,
                        }))
                      }
                      required
                      className="bm-input"
                    />
                  </Field>
                </div>

                {/* Row 5: cycle_weeks + sort order + active */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Cycle (weeks)">
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={form.cycle_weeks}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          cycle_weeks: e.target.value,
                        }))
                      }
                      required
                      className="bm-input"
                    />
                  </Field>

                  <Field label="Sort Order">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={form.sort_order}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          sort_order: e.target.value,
                        }))
                      }
                      required
                      className="bm-input"
                    />
                  </Field>

                  <Checkbox
                    label="Active"
                    checked={form.is_active}
                    onChange={(checked) =>
                      setForm((p) => ({ ...p, is_active: checked }))
                    }
                  />
                </div>

                {/* Buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bm-btn-outline"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bm-btn-primary disabled:opacity-70"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving…" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

/* ── tiny sub-components ─────────────────────────────── */

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 h-full">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5"
      />
      <span className="text-sm font-semibold text-gray-800">{label}</span>
    </label>
  );
}
