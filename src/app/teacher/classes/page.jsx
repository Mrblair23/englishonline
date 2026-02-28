import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Star,
  Video,
  X,
} from "lucide-react";
import TeacherLayout from "@/components/TeacherLayout";
import RoleGuard from "@/components/RoleGuard";
import { apiFetch } from "@/utils/apiClient";

export const prerender = false;

export default function TeacherClassesPage() {
  return (
    <RoleGuard allow={["teacher"]}>
      <TeacherLayout currentPage="classes">
        <ClassesContent />
      </TeacherLayout>
    </RoleGuard>
  );
}

function ClassesContent() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("upcoming"); // upcoming | past | all

  const load = useCallback(async () => {
    try {
      const res = await apiFetch("/api/teacher/sessions");
      if (!res.ok) throw new Error("Failed to load sessions");
      const data = await res.json();
      setSessions(data.sessions || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const now = new Date();
  const filtered = sessions.filter((s) => {
    if (tab === "upcoming") return new Date(s.startsAt) >= now && s.status !== "cancelled";
    if (tab === "past") return new Date(s.startsAt) < now || s.status === "completed";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-2xl bg-gradient-to-br from-[#1F2A44] to-[#3FA9A6] p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-white/20 p-4">
            <Calendar size={36} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-white/80">
              Teacher
            </p>
            <h1 className="text-3xl font-bold">My Classes</h1>
            <p className="mt-1 text-sm text-white/70">
              View your scheduled sessions and add class notes.
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

      {/* Tabs */}
      <div className="flex gap-2">
        {["upcoming", "past", "all"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t
                ? "bg-gradient-to-r from-[#1F2A44] to-[#3FA9A6] text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-sm text-gray-500">
          Loading sessions…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-sm text-gray-500">
          No sessions found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <SessionRow key={s.id} session={s} onNotesSaved={load} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────── */
/* Session row with expandable notes section */
/* ────────────────────────────────────────── */
function SessionRow({ session, onNotesSaved }) {
  const [expanded, setExpanded] = useState(false);
  const start = new Date(session.startsAt);
  const end = new Date(session.endsAt);
  const dur = Math.round((end - start) / 60_000);

  const modeBadge =
    session.classType?.mode === "duo"
      ? "DUO"
      : session.classType?.sessionsPerWeek === 2
        ? "Group 2x"
        : session.classType?.sessionsPerWeek === 3
          ? "Group 3x"
          : session.classType?.mode || "—";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        className="flex cursor-pointer items-center justify-between px-5 py-4"
        onClick={() => setExpanded((p) => !p)}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-gray-100 text-center">
            <span className="text-[10px] font-bold uppercase text-gray-500">
              {start.toLocaleDateString([], { month: "short" })}
            </span>
            <span className="text-lg font-bold leading-none text-gray-800">
              {start.getDate()}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {session.className || session.classType?.name || "Class"}{" "}
              <span className="font-normal text-gray-500">· {dur} min</span>
            </p>
            <p className="text-xs text-gray-500">
              {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              {" – "}
              {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              {" · "}
              {session.bookedCount ?? 0}/{session.capacity} students
              {session.bookedStudents && session.bookedStudents.length > 0 && (
                <> — {session.bookedStudents.map(s => s.name || s.email).join(", ")}</>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session.isOverride && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
              Override
            </span>
          )}
          <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
            {modeBadge}
          </span>
          {session.level && (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              session.level === "beginner" ? "bg-green-100 text-green-700"
              : session.level === "intermediate" ? "bg-amber-100 text-amber-700"
              : "bg-red-100 text-red-700"
            }`}>
              {session.level}
            </span>
          )}
          <StatusBadge status={session.status} />
          {session.note && (
            <span title="Has notes">
              <FileText size={14} className="text-emerald-500" />
            </span>
          )}
          {session.meetLink && (
            <a
              href={session.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="rounded-lg bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100"
              title="Join Google Meet"
            >
              <Video size={14} />
            </a>
          )}
          {expanded ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded notes panel */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4">
          <NotesPanel session={session} onSaved={onNotesSaved} />
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────── */
/* Notes panel (inline form)                 */
/* ────────────────────────────────────────── */
function NotesPanel({ session, onSaved }) {
  const [form, setForm] = useState({
    summary: session.note?.summary || "",
    homework: session.note?.homework || "",
    rating: session.note?.rating || 0,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState(null);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSave() {
    setSaving(true);
    setErr(null);
    setSaved(false);

    try {
      const body = {
        summary: form.summary || null,
        homework: form.homework || null,
        rating: form.rating ? Number(form.rating) : null,
      };

      const res = await apiFetch(`/api/teacher/sessions/${session.id}/notes`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save notes");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700">
        <BookOpen size={16} /> Class Notes
      </h4>

      {err && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          <AlertCircle size={14} />
          <span>{err}</span>
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-600">Summary</label>
        <textarea
          value={form.summary}
          onChange={handleChange("summary")}
          rows={3}
          placeholder="What was covered in this class?"
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-600">Homework</label>
        <textarea
          value={form.homework}
          onChange={handleChange("homework")}
          rows={2}
          placeholder="Any homework or assignments?"
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-600">
          Student Progress Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setForm((f) => ({ ...f, rating: val }))}
              className={`rounded-lg p-1.5 transition-colors ${
                Number(form.rating) >= val
                  ? "text-amber-400"
                  : "text-gray-300 hover:text-amber-200"
              }`}
            >
              <Star size={20} fill={Number(form.rating) >= val ? "currentColor" : "none"} />
            </button>
          ))}
          {Number(form.rating) > 0 && (
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, rating: 0 }))}
              className="ml-2 text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
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
              <Check size={16} /> Save Notes
            </>
          )}
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
            <Check size={14} /> Saved!
          </span>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────── */
/* Status badge                              */
/* ────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    scheduled: "bg-blue-100 text-blue-700",
    upcoming: "bg-yellow-100 text-yellow-700",
    live: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-rose-100 text-rose-700",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}
