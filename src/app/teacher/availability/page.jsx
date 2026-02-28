import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  Clock,
  Edit3,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import TeacherLayout from "@/components/TeacherLayout";
import RoleGuard from "@/components/RoleGuard";
import { apiFetch } from "@/utils/apiClient";

export const prerender = false;

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TeacherAvailabilityPage() {
  return (
    <RoleGuard allow={["teacher"]}>
      <TeacherLayout currentPage="availability">
        <AvailabilityContent />
      </TeacherLayout>
    </RoleGuard>
  );
}

function AvailabilityContent() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch("/api/teacher/availability");
      if (!res.ok) throw new Error("Failed to load availability");
      const data = await res.json();
      setBlocks(data.availability || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const activeBlocks = blocks.filter((b) => b.is_active);

  // Group by day
  const byDay = {};
  for (const b of activeBlocks) {
    if (!byDay[b.day_of_week]) byDay[b.day_of_week] = [];
    byDay[b.day_of_week].push(b);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-2xl bg-gradient-to-br from-[#1F2A44] to-[#3FA9A6] p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-white/20 p-4">
            <Clock size={36} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-white/80">
              Teacher
            </p>
            <h1 className="text-3xl font-bold">My Availability</h1>
            <p className="mt-1 text-sm text-white/70">
              Set your recurring weekly schedule. Admin will create bundles within these time slots.
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-sm text-gray-500">
          Loading availability…
        </div>
      ) : (
        <>
          {/* Add button */}
          <div className="flex justify-end">
            <button
              onClick={() => { setShowAdd(true); setEditId(null); }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3FA9A6] to-[#2d7b78] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
            >
              <Plus size={16} /> Add Block
            </button>
          </div>

          {/* Weekly grid */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            {[1, 2, 3, 4, 5, 6, 0].map((dow) => {
              const dayBlocks = byDay[dow] || [];
              return (
                <div
                  key={dow}
                  className="flex items-start gap-4 border-b border-gray-100 px-6 py-4 last:border-0"
                >
                  <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                    {DAY_SHORT[dow]}
                  </div>
                  <div className="flex-1">
                    {dayBlocks.length === 0 ? (
                      <p className="py-2 text-sm text-gray-400">No availability</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {dayBlocks.map((b) => (
                          <div
                            key={b.id}
                            className="group flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2"
                          >
                            <span className="text-sm font-semibold text-teal-800">
                              {formatTime(b.start_time)} – {formatTime(b.end_time)}
                            </span>
                            <button
                              onClick={() => { setEditId(b.id); setShowAdd(false); }}
                              className="rounded p-0.5 text-gray-400 opacity-0 transition-opacity hover:text-teal-700 group-hover:opacity-100"
                              title="Edit"
                            >
                              <Edit3 size={14} />
                            </button>
                            <DeleteButton blockId={b.id} onDeleted={load} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Add modal */}
      {showAdd && (
        <AvailabilityModal
          onClose={() => setShowAdd(false)}
          onSaved={() => { setShowAdd(false); load(); }}
        />
      )}

      {/* Edit modal */}
      {editId && (
        <AvailabilityModal
          block={blocks.find((b) => b.id === editId)}
          onClose={() => setEditId(null)}
          onSaved={() => { setEditId(null); load(); }}
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────── */
/* Modal for Add / Edit availability block   */
/* ────────────────────────────────────────── */
function AvailabilityModal({ block, onClose, onSaved }) {
  const isEdit = !!block;
  const [form, setForm] = useState({
    day_of_week: block?.day_of_week ?? 1,
    start_time: block?.start_time?.slice(0, 5) ?? "09:00",
    end_time: block?.end_time?.slice(0, 5) ?? "12:00",
    timezone: block?.timezone ?? (Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"),
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: field === "day_of_week" ? Number(e.target.value) : e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErr(null);

    try {
      const url = isEdit
        ? `/api/teacher/availability/${block.id}`
        : "/api/teacher/availability";
      const method = isEdit ? "PATCH" : "POST";

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save");
      }

      onSaved();
    } catch (err) {
      setErr(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">
            {isEdit ? "Edit Availability Block" : "Add Availability Block"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {err && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            <AlertCircle size={16} />
            <span>{err}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Day</label>
            <select
              value={form.day_of_week}
              onChange={handleChange("day_of_week")}
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
            >
              {DAY_NAMES.map((name, i) => (
                <option key={i} value={i}>{name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Start Time</label>
              <input
                type="time"
                value={form.start_time}
                onChange={handleChange("start_time")}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">End Time</label>
              <input
                type="time"
                value={form.end_time}
                onChange={handleChange("end_time")}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Timezone</label>
            <input
              type="text"
              value={form.timezone}
              onChange={handleChange("timezone")}
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
              placeholder="e.g. Europe/London"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3FA9A6] to-[#2d7b78] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving…
                </>
              ) : (
                <>
                  <Check size={16} />
                  {isEdit ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────── */
/* Delete / disable button                   */
/* ────────────────────────────────────────── */
function DeleteButton({ blockId, onDeleted }) {
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm("Disable this availability block?")) return;
    setBusy(true);
    try {
      const res = await apiFetch(`/api/teacher/availability/${blockId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete");
        return;
      }
      onDeleted();
    } catch {
      alert("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      className="rounded p-0.5 text-gray-400 opacity-0 transition-opacity hover:text-rose-600 group-hover:opacity-100 disabled:opacity-30"
      title="Remove"
    >
      <Trash2 size={14} />
    </button>
  );
}

/* ────────────────────────────────────────── */
/* Helpers                                   */
/* ────────────────────────────────────────── */
function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = Number(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}
