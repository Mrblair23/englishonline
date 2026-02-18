import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Power, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import AdminLayout from "@/components/AdminLayout";
import useAdmin from "@/utils/useAdmin";
import { apiFetch } from "@/utils/apiClient";

function formatMoney(value, currency) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(currency === "COP" ? "es-CO" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "COP" ? 0 : 2,
  }).format(n);
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

function featuresToText(features) {
  if (!Array.isArray(features)) return "";
  return features.filter(Boolean).join("\n");
}

function textToFeatures(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const DEFAULT_FORM = {
  slug: "",
  name: "",
  description: "",
  price_usd: "0",
  price_cop: "0",
  class_type: "group",
  classes_per_week: "0",
  is_popular: false,
  is_active: true,
  sort_order: "0",
  features_text: "",
};

export default function AdminPricingPlansPage() {
  const { isAdmin, loading } = useAdmin();
  const [plans, setPlans] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      window.location.href = "/account/signin";
    }
  }, [isAdmin, loading]);

  const fetchPlans = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoadingPlans(true);
    setError(null);
    try {
      const response = await apiFetch("/api/admin/pricing-plans");
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(normalizeApiError(payload) || "Failed to load plans");
      }
      const data = await response.json();
      setPlans(Array.isArray(data.plans) ? data.plans : []);
    } catch (e) {
      console.error("GET /api/admin/pricing-plans failed", e);
      setError(e?.message || "Unable to load plans");
      setPlans([]);
    } finally {
      setIsLoadingPlans(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const sortedPlans = useMemo(() => {
    return [...plans].sort((a, b) => {
      const soA = Number(a?.sort_order ?? 0);
      const soB = Number(b?.sort_order ?? 0);
      if (soA !== soB) return soA - soB;
      return Number(a?.id ?? 0) - Number(b?.id ?? 0);
    });
  }, [plans]);

  function openCreate() {
    setEditingPlan(null);
    setForm(DEFAULT_FORM);
    setIsModalOpen(true);
  }

  function openEdit(plan) {
    setEditingPlan(plan);
    setForm({
      slug: plan?.slug ?? "",
      name: plan?.name ?? "",
      description: plan?.description ?? "",
      price_usd: String(plan?.price_usd ?? 0),
      price_cop: String(plan?.price_cop ?? 0),
      class_type: plan?.class_type ?? "group",
      classes_per_week: String(plan?.classes_per_week ?? 0),
      is_popular: Boolean(plan?.is_popular),
      is_active: plan?.is_active !== false,
      sort_order: String(plan?.sort_order ?? 0),
      features_text: featuresToText(plan?.features),
    });
    setIsModalOpen(true);
  }

  async function savePlan(event) {
    event.preventDefault();
    if (isSaving) return;

    const payload = {
      slug: form.slug,
      name: form.name,
      description: form.description,
      price_usd: Number(form.price_usd),
      price_cop: Number(form.price_cop),
      class_type: form.class_type,
      classes_per_week: Number(form.classes_per_week),
      is_popular: Boolean(form.is_popular),
      is_active: Boolean(form.is_active),
      sort_order: Number(form.sort_order),
      features: textToFeatures(form.features_text),
    };

    setIsSaving(true);
    try {
      const response = await apiFetch(
        editingPlan ? `/api/admin/pricing-plans/${editingPlan.id}` : "/api/admin/pricing-plans",
        {
          method: editingPlan ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(normalizeApiError(data) || "Save failed");
      }

      toast.success(editingPlan ? "Plan updated" : "Plan created");
      setIsModalOpen(false);
      await fetchPlans();
    } catch (e) {
      console.error("Save pricing plan failed", e);
      toast.error(e?.message || "Unable to save plan");
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleActive(plan) {
    if (!plan?.id) return;
    if (plan.is_active) {
      const confirmed = window.confirm("Deactivate this plan? It will no longer appear in pricing.");
      if (!confirmed) return;
    }

    try {
      const response = await apiFetch(`/api/admin/pricing-plans/${plan.id}/toggle`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(normalizeApiError(data) || "Toggle failed");
      }

      toast.success(plan.is_active ? "Plan deactivated" : "Plan activated");
      await fetchPlans();
    } catch (e) {
      console.error("Toggle plan failed", e);
      toast.error(e?.message || "Unable to toggle plan");
    }
  }

  if (loading || !isAdmin) {
    return (
      <AdminLayout currentPage="pricing">
        <div className="p-6">Loading…</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="pricing">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="bm-page-title mb-2">Pricing Plans</h1>
            <p className="bm-page-subtitle">Create and manage bundles</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchPlans()}
              className="bm-btn-outline"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
            <button
              onClick={openCreate}
              className="bm-btn-primary"
            >
              <Plus size={18} />
              Create Plan
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="bm-table-card">
          {isLoadingPlans ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
            </div>
          ) : sortedPlans.length === 0 ? (
            <div className="text-center py-12 px-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No plans</h3>
              <p className="text-gray-500 text-sm mb-6">Create your first pricing plan.</p>
              <button
                onClick={openCreate}
                className="bm-btn-primary"
              >
                <Plus size={18} />
                Create Plan
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Slug</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Price USD</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Price COP</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Classes/Week</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Popular</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Active</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Sort</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Updated</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{plan.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{plan.slug}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatMoney(plan.price_usd, "USD")}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatMoney(plan.price_cop, "COP")}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{plan.class_type}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{plan.classes_per_week}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            plan.is_popular ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {plan.is_popular ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            plan.is_active ? "bg-sky-50 text-sky-700" : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {plan.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{plan.sort_order ?? 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDateTime(plan.updated_at)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => openEdit(plan)}
                            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-gray-50"
                          >
                            <span className="inline-flex items-center gap-2">
                              <Pencil size={14} />
                              Edit
                            </span>
                          </button>
                          <button
                            onClick={() => toggleActive(plan)}
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

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bm-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editingPlan ? "Edit plan" : "Create plan"}
              </h3>

              <form onSubmit={savePlan} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Slug">
                    <input
                      value={form.slug}
                      onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                      required
                      className="bm-input"
                      placeholder="e.g. conversational"
                    />
                  </Field>

                  <Field label="Name">
                    <input
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      required
                      className="bm-input"
                      placeholder="e.g. Conversacional"
                    />
                  </Field>
                </div>

                <Field label="Description">
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="bm-input"
                    placeholder="Short description"
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Price USD">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price_usd}
                      onChange={(e) => setForm((prev) => ({ ...prev, price_usd: e.target.value }))}
                      required
                      className="bm-input"
                    />
                  </Field>

                  <Field label="Price COP">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={form.price_cop}
                      onChange={(e) => setForm((prev) => ({ ...prev, price_cop: e.target.value }))}
                      required
                      className="bm-input"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Type">
                    <select
                      value={form.class_type}
                      onChange={(e) => setForm((prev) => ({ ...prev, class_type: e.target.value }))}
                      className="bm-input"
                    >
                      <option value="group">group</option>
                      <option value="private">private</option>
                    </select>
                  </Field>

                  <Field label="Classes/Week">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={form.classes_per_week}
                      onChange={(e) => setForm((prev) => ({ ...prev, classes_per_week: e.target.value }))}
                      required
                      className="bm-input"
                    />
                  </Field>

                  <Field label="Sort order">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={form.sort_order}
                      onChange={(e) => setForm((prev) => ({ ...prev, sort_order: e.target.value }))}
                      required
                      className="bm-input"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Checkbox
                    label="Popular"
                    checked={form.is_popular}
                    onChange={(checked) => setForm((prev) => ({ ...prev, is_popular: checked }))}
                  />
                  <Checkbox
                    label="Active"
                    checked={form.is_active}
                    onChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))}
                  />
                </div>

                <Field label="Features (one per line)">
                  <textarea
                    value={form.features_text}
                    onChange={(e) => setForm((prev) => ({ ...prev, features_text: e.target.value }))}
                    rows={6}
                    className="bm-input font-mono text-sm"
                    placeholder="Feature 1\nFeature 2\nFeature 3"
                  />
                </Field>

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

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
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
