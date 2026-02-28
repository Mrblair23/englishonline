import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useAdmin from "@/utils/useAdmin";
import AdminLayout from "@/components/AdminLayout";
import { apiFetch } from "@/utils/apiClient";

const MAX_WEEK_OFFSET = 5; // 0 = this week, up to 5 = 6 weeks total (ensures all 4 weeks of generated bundle sessions are always visible)

function pad2(value) {
  return String(value).padStart(2, "0");
}

function parseDateTimeLocal(value) {
  if (!value || typeof value !== "string") return null;
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
  );
  if (!match) return null;
  const [, y, m, d, hh, mm, ss] = match;
  const date = new Date(
    Number(y),
    Number(m) - 1,
    Number(d),
    Number(hh),
    Number(mm),
    Number(ss || 0),
    0
  );
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function formatDateTimeLocal(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(
    date.getHours()
  )}:${pad2(date.getMinutes())}`;
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const diff = (day === 0 ? -6 : 1) - day; // Monday as start
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDayLabel(date) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function normalizeApiError(payload) {
  if (!payload) return null;
  if (typeof payload.error === "string") return payload.error;
  if (typeof payload.message === "string") return payload.message;
  return null;
}

function getSessionId(session) {
  return session?.id;
}

function getSessionStart(session) {
  return session?.start_time || session?.startTime || session?.startsAt || session?.scheduled_at;
}

function getSessionEnd(session) {
  return session?.end_time || session?.endTime || session?.endsAt;
}

function getSessionTeacherId(session) {
  return session?.teacher_id ?? session?.teacherId;
}

function getSessionClassTypeId(session) {
  return session?.class_type_id ?? session?.classTypeId;
}

function getSessionCapacity(session) {
  return session?.max_students ?? session?.capacity;
}

function getSessionMeetLink(session) {
  return session?.meet_link ?? session?.meetLink;
}

function getSessionStatus(session) {
  return session?.status || "scheduled";
}

export const prerender = false;

export default function AdminClassesPage() {
  const { isAdmin, loading } = useAdmin();
  const [classTypes, setClassTypes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const [weekOffset, setWeekOffset] = useState(0);
  const [filterClassTypeId, setFilterClassTypeId] = useState("");
  const [filterTeacherId, setFilterTeacherId] = useState("");
  const [openControl, setOpenControl] = useState(null);

  const [showCreateClass, setShowCreateClass] = useState(false);

  const [showEditSession, setShowEditSession] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [editSessionForm, setEditSessionForm] = useState({
    teacher_id: "",
    class_type_id: "",
    start_time: "",
    max_students: "",
    meet_link: "",
  });
  const [editBusy, setEditBusy] = useState(false);
  const [editError, setEditError] = useState(null);

  const [createSessionForm, setCreateSessionForm] = useState({
    teacher_id: "",
    class_type_id: "",
    max_students: "",
    class_name: "",
    level: "",
    schedule: [], // [{ day_of_week: "", start_time: "" }]
  });

  // Schedule suggestion state
  const [useAvailability, setUseAvailability] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);
  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      window.location.href = "/account/signin";
    }
  }, [isAdmin, loading]);

  const loadData = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingData(true);
    setError(null);
    try {
      const [typesRes, sessionsRes, teachersRes] = await Promise.all([
        apiFetch("/api/class-types"),
        apiFetch("/admin/class-sessions"),
        apiFetch("/admin/teachers"),
      ]);

      if (!typesRes.ok) {
        const payload = await typesRes.json().catch(() => ({}));
        throw new Error(normalizeApiError(payload) || "Failed to load bundles");
      }
      if (!sessionsRes.ok) {
        const payload = await sessionsRes.json().catch(() => ({}));
        throw new Error(normalizeApiError(payload) || "Failed to load class sessions");
      }
      if (!teachersRes.ok) {
        const payload = await teachersRes.json().catch(() => ({}));
        throw new Error(normalizeApiError(payload) || "Failed to load teachers");
      }

      const typesPayload = await typesRes.json();
      setClassTypes(Array.isArray(typesPayload?.bundles) ? typesPayload.bundles : Array.isArray(typesPayload) ? typesPayload : []);

      const sessionsPayload = await sessionsRes.json();
      setSessions(Array.isArray(sessionsPayload?.sessions) ? sessionsPayload.sessions : Array.isArray(sessionsPayload) ? sessionsPayload : []);

      const teachersPayload = await teachersRes.json();
      setTeachers(Array.isArray(teachersPayload) ? teachersPayload : []);
    } catch (e) {
      console.error("Admin classes load error:", e);
      setError(e?.message || "Unable to load classes data");
      setClassTypes([]);
      setSessions([]);
      setTeachers([]);
    } finally {
      setLoadingData(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentWeekStart = useMemo(() => startOfWeek(new Date()), []);
  const weekStart = useMemo(
    () => addDays(currentWeekStart, weekOffset * 7),
    [currentWeekStart, weekOffset]
  );
  const weekEnd = useMemo(() => {
    const end = addDays(weekStart, 7);
    end.setMilliseconds(-1);
    return end;
  }, [weekStart]);

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, idx) => addDays(weekStart, idx)),
    [weekStart]
  );

  const isCurrentWeek = weekOffset === 0;
  const canGoPrev = weekOffset > 0;
  const canGoNext = weekOffset < MAX_WEEK_OFFSET;

  function weekLabel() {
    if (weekOffset === 0) return "This week";
    if (weekOffset === 1) return "Next week";
    return `In ${weekOffset} weeks`;
  }

  const sessionsByDay = useMemo(() => {
    const map = new Map();
    for (const day of days) {
      const key = day.toDateString();
      map.set(key, []);
    }

    for (const session of sessions) {
      const start = new Date(getSessionStart(session));
      if (Number.isNaN(start.getTime())) continue;
      if (start < weekStart || start > weekEnd) continue;

      if (
        filterClassTypeId &&
        String(getSessionClassTypeId(session) ?? "") !== String(filterClassTypeId)
      ) {
        continue;
      }
      if (filterTeacherId && String(getSessionTeacherId(session) ?? "") !== String(filterTeacherId)) {
        continue;
      }

      const key = start.toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(session);
    }

    for (const [key, list] of map) {
      list.sort((a, b) => {
        const at = new Date(getSessionStart(a)).getTime();
        const bt = new Date(getSessionStart(b)).getTime();
        return at - bt;
      });
      map.set(key, list);
    }

    return map;
  }, [days, sessions, weekStart, weekEnd, filterClassTypeId, filterTeacherId]);

  const activeClassTypes = useMemo(
    () => classTypes.filter((t) => t?.is_active !== false),
    [classTypes]
  );

  const teacherById = useMemo(() => {
    const map = new Map();
    for (const t of teachers) {
      if (t?.id) map.set(String(t.id), t);
    }
    return map;
  }, [teachers]);

  const classTypeById = useMemo(() => {
    const map = new Map();
    for (const ct of classTypes) {
      if (ct?.id) map.set(String(ct.id), ct);
    }
    return map;
  }, [classTypes]);

  const selectedClassTypeLabel = useMemo(() => {
    if (!filterClassTypeId) return "All bundles";
    return classTypeById.get(String(filterClassTypeId))?.name || "All bundles";
  }, [classTypeById, filterClassTypeId]);

  const selectedTeacherLabel = useMemo(() => {
    if (!filterTeacherId) return "All teachers";
    const teacher = teacherById.get(String(filterTeacherId));
    return teacher?.name || teacher?.email || "All teachers";
  }, [teacherById, filterTeacherId]);

  useEffect(() => {
    if (!showCreateClass) return;
    setCreateSessionForm({
      teacher_id: "",
      class_type_id: "",
      max_students: "",
      class_name: "",
      level: "",
      schedule: [],
    });
    setUseAvailability(true);
    setSuggestions([]);
    setSuggestionsError(null);
    setSelectedSuggestionIdx(null);
  }, [showCreateClass]);

  // Fetch schedule suggestions when teacher + bundle are both selected (only when availability mode is ON)
  useEffect(() => {
    if (!showCreateClass || !useAvailability) {
      setSuggestions([]);
      setSuggestionsError(null);
      setSelectedSuggestionIdx(null);
      return;
    }
    const teacherId = createSessionForm.teacher_id;
    const classTypeId = createSessionForm.class_type_id;
    if (!teacherId || !classTypeId) {
      setSuggestions([]);
      setSuggestionsError(null);
      setSelectedSuggestionIdx(null);
      return;
    }

    const selected = classTypeById.get(String(classTypeId));
    if (!selected) return;

    const spw = Number(selected.sessions_per_week) || 1;
    const mode = (selected.mode || "").toLowerCase();
    const bundleType = mode === "duo" ? "duo" : `${spw}x`;

    let cancelled = false;
    setSuggestionsLoading(true);
    setSuggestionsError(null);
    setSelectedSuggestionIdx(null);
    setSuggestions([]);
    setCreateSessionForm((prev) => ({ ...prev, schedule: [] }));

    apiFetch(`/admin/teachers/${teacherId}/suggested-schedules?bundleType=${bundleType}`)
      .then(async (res) => {
        if (cancelled) return;
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load suggestions");
        setSuggestions(data.suggestions || []);
        if (data.message) setSuggestionsError(data.message);
      })
      .catch((err) => {
        if (cancelled) return;
        setSuggestionsError(err.message || "Failed to load schedule suggestions");
      })
      .finally(() => {
        if (!cancelled) setSuggestionsLoading(false);
      });

    return () => { cancelled = true; };
  }, [showCreateClass, useAvailability, createSessionForm.teacher_id, createSessionForm.class_type_id, classTypeById]);

  // Auto-resize manual schedule array when availability is OFF and bundle changes
  useEffect(() => {
    if (!showCreateClass || useAvailability) return;
    const selected = classTypeById.get(String(createSessionForm.class_type_id));
    if (!selected) return;
    const spw = Number(selected.sessions_per_week) || 1;
    setCreateSessionForm((prev) => {
      const current = prev.schedule || [];
      if (current.length === spw) return prev;
      const newSchedule = Array.from({ length: spw }, (_, i) =>
        current[i] || { day_of_week: "", start_time: "" }
      );
      return { ...prev, schedule: newSchedule };
    });
  }, [showCreateClass, useAvailability, createSessionForm.class_type_id, classTypeById]);

  // Auto-fill capacity from class type when bundle changes
  useEffect(() => {
    if (!showCreateClass) return;
    const selected = classTypeById.get(String(createSessionForm.class_type_id));
    if (!selected) return;

    setCreateSessionForm((prev) => {
      const capacity =
        prev.max_students || (typeof selected.max_students === "number" ? String(selected.max_students) : "");
      return { ...prev, max_students: capacity };
    });
  }, [showCreateClass, createSessionForm.class_type_id, classTypeById]);

  useEffect(() => {
    if (!showEditSession || !selectedSession) return;
    setEditError(null);
    setEditBusy(false);
    setEditSessionForm({
      teacher_id: String(getSessionTeacherId(selectedSession) ?? ""),
      class_type_id: String(getSessionClassTypeId(selectedSession) ?? ""),
      start_time: (() => {
        const start = new Date(getSessionStart(selectedSession));
        return Number.isNaN(start.getTime()) ? "" : formatDateTimeLocal(start);
      })(),
      max_students: (() => {
        const capacity = getSessionCapacity(selectedSession);
        return capacity == null ? "" : String(capacity);
      })(),
      meet_link: String(getSessionMeetLink(selectedSession) ?? ""),
    });
  }, [showEditSession, selectedSession]);

  async function handleCreateClassSession(formData) {
    const teacherId = createSessionForm.teacher_id;
    const classTypeId = createSessionForm.class_type_id;

    if (!teacherId) throw new Error("Teacher is required");
    if (!classTypeId) throw new Error("Bundle is required");

    const selected = classTypeById.get(String(classTypeId));
    if (!selected) throw new Error("Selected bundle not found");

    const spw = Number(selected.sessions_per_week) || 1;
    const schedule = createSessionForm.schedule;

    if (useAvailability && selectedSuggestionIdx == null) {
      throw new Error("Please select one of the suggested schedules");
    }

    if (!Array.isArray(schedule) || schedule.length !== spw) {
      throw new Error(`Please ${useAvailability ? "select a valid schedule" : "fill in all schedule slots"} (expected ${spw} slot${spw > 1 ? "s" : ""})`);
    }

    const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const schedulePayload = [];
    for (let i = 0; i < schedule.length; i++) {
      const entry = schedule[i];
      const dow = Number(entry.day_of_week);
      if (!Number.isInteger(dow) || dow < 0 || dow > 6) {
        throw new Error(`Slot ${i + 1}: please select a day`);
      }
      if (!entry.start_time || !/^\d{2}:\d{2}$/.test(entry.start_time)) {
        throw new Error(`Slot ${i + 1} (${DAY_NAMES[dow]}): please set a start time`);
      }
      schedulePayload.push({
        day_of_week: dow,
        start_time: entry.start_time,
        duration_minutes: Number(selected.duration_minutes) || 60,
      });
    }

    const response = await apiFetch("/admin/class-sessions/generate-bundle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacher_id: teacherId,
        class_type_id: classTypeId,
        bundle_duration_weeks: 4,
        sessions_per_week: spw,
        schedule: schedulePayload,
        ...(createSessionForm.class_name?.trim() ? { class_name: createSessionForm.class_name.trim() } : {}),
        ...(createSessionForm.level ? { level: createSessionForm.level } : {}),
        ...(!useAvailability ? { skip_availability_check: true } : {}),
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(normalizeApiError(payload) || "Failed to generate bundle sessions");
    }

    alert(`✅ Created ${payload.total_sessions} sessions for "${payload.class_name}" (${payload.weeks} weeks × ${payload.sessions_per_week}/week)`);
    setShowCreateClass(false);
    await loadData();
  }

  const computedEditEndTime = useMemo(() => {
    if (!showEditSession) return "";
    const selected = classTypeById.get(String(editSessionForm.class_type_id));
    const durationMinutes = Number(selected?.duration_minutes);
    const start = parseDateTimeLocal(editSessionForm.start_time);
    if (!selected || !Number.isFinite(durationMinutes) || !start) return "";
    const end = new Date(start.getTime() + durationMinutes * 60_000);
    return formatDateTimeLocal(end);
  }, [classTypeById, editSessionForm.class_type_id, editSessionForm.start_time, showEditSession]);

  async function handleUpdateSelectedSession(e) {
    e.preventDefault();
    if (!selectedSession) return;
    setEditError(null);
    setEditBusy(true);
    try {
      const sessionId = getSessionId(selectedSession);
      if (!sessionId) throw new Error("Missing session id");

      const teacherId = editSessionForm.teacher_id?.toString();
      const classTypeId = editSessionForm.class_type_id?.toString();
      const startTime = editSessionForm.start_time?.toString();
      const maxStudents = Number(editSessionForm.max_students);
      const meetLink = editSessionForm.meet_link?.toString().trim();

      if (!teacherId) throw new Error("Teacher is required");
      if (!classTypeId) throw new Error("Bundle is required");
      if (!startTime) throw new Error("Start time is required");
      if (!Number.isFinite(maxStudents)) throw new Error("Capacity is required");

      const selectedType = classTypeById.get(String(classTypeId));
      const durationMinutes = Number(selectedType?.duration_minutes);
      const start = parseDateTimeLocal(startTime);
      if (!selectedType || !Number.isFinite(durationMinutes) || !start) {
        throw new Error("Unable to calculate end time from the selected bundle");
      }
      const end = new Date(start.getTime() + durationMinutes * 60_000);
      if (!end || Number.isNaN(end.getTime())) throw new Error("Unable to calculate end time");

      const response = await apiFetch(`/admin/class-sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacher_id: teacherId,
          class_type_id: classTypeId,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          max_students: maxStudents,
          meet_link: meetLink || "",
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(normalizeApiError(payload) || "Failed to update class session");
      }

      setShowEditSession(false);
      setSelectedSession(null);
      await loadData();
    } catch (err) {
      setEditError(err?.message || "Failed to update session");
    } finally {
      setEditBusy(false);
    }
  }

  async function handleCancelSelectedSession() {
    if (!selectedSession) return;
    const sessionId = getSessionId(selectedSession);
    if (!sessionId) return;
    if (getSessionStatus(selectedSession) === "cancelled") return;
    const ok = window.confirm("Cancel this class session? This will remove it from the schedule.");
    if (!ok) return;

    setEditError(null);
    setEditBusy(true);
    try {
      const response = await apiFetch(`/admin/class-sessions/${sessionId}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(normalizeApiError(payload) || "Failed to cancel class session");
      }

      setShowEditSession(false);
      setSelectedSession(null);
      await loadData();
    } catch (err) {
      setEditError(err?.message || "Failed to cancel session");
    } finally {
      setEditBusy(false);
    }
  }

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bm-page-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300" />
      </div>
    );
  }

  return (
    <AdminLayout currentPage="classes">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="bm-page-title">Classes</h1>
            <p className="bm-page-subtitle">Weekly schedule and setup</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={() =>
                setOpenControl((current) => (current === "classType" ? null : "classType"))
              }
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-gray-900 hover:bg-gray-50 sm:min-w-[240px]"
            >
              <div className="text-[10px] font-semibold text-gray-500">Bundle</div>
              <div className="text-sm font-medium truncate">{selectedClassTypeLabel}</div>
            </button>

            <button
              type="button"
              onClick={() =>
                setOpenControl((current) => (current === "teacher" ? null : "teacher"))
              }
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-gray-900 hover:bg-gray-50 sm:min-w-[240px]"
            >
              <div className="text-[10px] font-semibold text-gray-500">Teachers</div>
              <div className="text-sm font-medium truncate">{selectedTeacherLabel}</div>
            </button>

            <button
              type="button"
              onClick={() => setShowCreateClass(true)}
              className="bm-btn-dark"
            >
              Create bundle sessions
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {(openControl === "classType" || openControl === "teacher") && (
          <div className="mb-4">
            {openControl === "classType" && (
              <div className="bm-card p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr,auto] sm:items-end">
                  <label className="text-sm font-semibold text-gray-900">
                    Filter by bundle
                    <select
                      value={filterClassTypeId}
                      onChange={(e) => {
                        setFilterClassTypeId(e.target.value);
                        setOpenControl(null);
                      }}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
                    >
                      <option value="">All bundles</option>
                      {activeClassTypes.map((ct) => (
                        <option key={ct.id} value={ct.id}>
                          {ct.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <a
                    href="/admin/bundles"
                    className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Manage bundles
                  </a>
                </div>
              </div>
            )}

            {openControl === "teacher" && (
              <div className="bm-card p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr,auto] sm:items-end">
                  <label className="text-sm font-semibold text-gray-900">
                    Filter by teacher
                    <select
                      value={filterTeacherId}
                      onChange={(e) => {
                        setFilterTeacherId(e.target.value);
                        setOpenControl(null);
                      }}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
                    >
                      <option value="">All teachers</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name || t.email}
                        </option>
                      ))}
                    </select>
                  </label>
                  <a
                    href="/admin/teachers"
                    className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Add teacher
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        <section className="space-y-4">
          <div className="bm-card p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!canGoPrev}
                  onClick={() => setWeekOffset((o) => Math.max(0, o - 1))}
                  className="rounded-xl border border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Previous week"
                >
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-lg font-semibold text-gray-900 min-w-[120px] text-center">
                  {weekLabel()}
                </h2>
                <button
                  type="button"
                  disabled={!canGoNext}
                  onClick={() => setWeekOffset((o) => Math.min(MAX_WEEK_OFFSET, o + 1))}
                  className="rounded-xl border border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Next week"
                >
                  <ChevronRight size={18} />
                </button>
                {!isCurrentWeek && (
                  <button
                    type="button"
                    onClick={() => setWeekOffset(0)}
                    className="ml-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Today
                  </button>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {formatDayLabel(weekStart)} – {formatDayLabel(addDays(weekStart, 6))}
              </span>
            </div>

            {loadingData ? (
              <div className="py-10 text-center text-sm text-gray-500">Loading…</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {days.map((day) => {
                  const list = sessionsByDay.get(day.toDateString()) || [];
                  return (
                    <div
                      key={day.toISOString()}
                      className="rounded-2xl border border-gray-200 p-3"
                    >
                      <div className="mb-2 text-sm font-semibold text-gray-900">
                        {formatDayLabel(day)}
                      </div>
                      {list.length === 0 ? (
                        <div className="text-xs text-gray-500">No class sessions</div>
                      ) : (
                        <div className="space-y-2">
                          {list.map((session) => (
                            <button
                              key={getSessionId(session)}
                              type="button"
                              onClick={() => {
                                setSelectedSession(session);
                                setShowEditSession(true);
                              }}
                              className={`w-full text-left rounded-xl bg-white border p-2.5 hover:bg-gray-50 transition-all ${
                                getSessionStatus(session) === "cancelled"
                                  ? "border-rose-200 opacity-60"
                                  : "border-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-sm font-semibold text-gray-900 truncate">
                                  {session.className || session.class_name || session.class_type_name || "Class session"}
                                </div>
                                <div className="text-xs text-gray-600 whitespace-nowrap">
                                  {formatTime(getSessionStart(session))}–{formatTime(getSessionEnd(session))}
                                </div>
                              </div>
                              {/* Teacher */}
                              {(() => {
                                const teacherName = session.teacherName || session.teacher_name || teacherById.get(String(getSessionTeacherId(session)))?.name;
                                return teacherName ? (
                                  <div className="mt-1 flex items-center gap-1 text-xs text-indigo-600">
                                    <span className="inline-block w-3 h-3 rounded-full bg-indigo-100 text-[8px] font-bold text-indigo-600 flex items-center justify-center shrink-0">T</span>
                                    {teacherName}
                                  </div>
                                ) : null;
                              })()}
                              {/* Level badge */}
                              {(session.level) && (
                                <span className={`inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  session.level === "beginner" ? "bg-green-50 text-green-700"
                                  : session.level === "intermediate" ? "bg-amber-50 text-amber-700"
                                  : "bg-red-50 text-red-700"
                                }`}>
                                  {session.level}
                                </span>
                              )}
                              {/* Booked students */}
                              <div className="mt-1 text-xs text-gray-500">
                                {(() => {
                                  const students = session.bookedStudents || session.booked_students || [];
                                  const bookedNum = session.bookedCount ?? session.booked_count ?? students.length;
                                  const cap = getSessionCapacity(session) ??
                                    (typeof session.class_type_max_students === "number" ? session.class_type_max_students
                                    : classTypeById.get(String(getSessionClassTypeId(session)))?.max_students);

                                  if (students.length > 0) {
                                    const names = students.map((s) => s.name || s.email).join(", ");
                                    return (
                                      <span title={names}>
                                        👤 {names}
                                        {cap != null ? ` (${bookedNum}/${cap})` : ""}
                                      </span>
                                    );
                                  }
                                  if (cap != null) {
                                    return <span>{bookedNum}/{cap} seats</span>;
                                  }
                                  return null;
                                })()}
                              </div>
                              {getSessionStatus(session) === "cancelled" && (
                                <div className="mt-1 text-[10px] font-semibold text-rose-600 uppercase">Cancelled</div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {showEditSession && selectedSession && (
          <Modal
            title="Edit class session"
            onClose={() => {
              if (editBusy) return;
              setShowEditSession(false);
              setSelectedSession(null);
            }}
          >
            <form onSubmit={handleUpdateSelectedSession} className="space-y-3">
              {editError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  {editError}
                </div>
              )}
              <Field label="Teacher">
                <select
                  name="teacher_id"
                  required
                  disabled={editBusy}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 bg-white"
                  value={editSessionForm.teacher_id}
                  onChange={(e) =>
                    setEditSessionForm((prev) => ({ ...prev, teacher_id: e.target.value }))
                  }
                >
                  <option value="" disabled>
                    Select a teacher
                  </option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name || t.email}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Bundle">
                <select
                  name="class_type_id"
                  required
                  disabled={editBusy}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 bg-white"
                  value={editSessionForm.class_type_id}
                  onChange={(e) =>
                    setEditSessionForm((prev) => ({ ...prev, class_type_id: e.target.value }))
                  }
                >
                  <option value="" disabled>
                    Select a bundle
                  </option>
                  {activeClassTypes.map((ct) => (
                    <option key={ct.id} value={ct.id}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Start time">
                  <input
                    name="start_time"
                    type="datetime-local"
                    required
                    disabled={editBusy}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2"
                    value={editSessionForm.start_time}
                    onChange={(e) =>
                      setEditSessionForm((prev) => ({ ...prev, start_time: e.target.value }))
                    }
                  />
                </Field>
                <Field label="Capacity">
                  <input
                    name="max_students"
                    type="number"
                    min={1}
                    required
                    disabled={editBusy}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2"
                    value={editSessionForm.max_students}
                    onChange={(e) =>
                      setEditSessionForm((prev) => ({ ...prev, max_students: e.target.value }))
                    }
                  />
                </Field>
              </div>
              <Field label="Meet link (optional)">
                <input
                  name="meet_link"
                  disabled={editBusy}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2"
                  placeholder="https://meet.google.com/..."
                  value={editSessionForm.meet_link}
                  onChange={(e) =>
                    setEditSessionForm((prev) => ({ ...prev, meet_link: e.target.value }))
                  }
                />
              </Field>
              {computedEditEndTime && (
                <div className="text-xs text-gray-600">Ends at {computedEditEndTime.replace("T", " ")}</div>
              )}
              <div className="text-xs text-gray-600">End time is calculated from the bundle duration.</div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={editBusy || getSessionStatus(selectedSession) === "cancelled"}
                  onClick={handleCancelSelectedSession}
                  className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                >
                  Cancel session
                </button>
                <button
                  type="submit"
                  disabled={editBusy}
                  className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
                >
                  {editBusy ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </Modal>
        )}



        {showCreateClass && (
          <Modal title="Create bundle sessions" onClose={() => setShowCreateClass(false)}>
            <Form
              submitLabel={
                createSessionForm.class_type_id && (!useAvailability || selectedSuggestionIdx != null)
                  ? `Create ${(Number(classTypeById.get(String(createSessionForm.class_type_id))?.sessions_per_week) || 1) * 4} sessions (4 weeks)`
                  : useAvailability ? "Select a schedule below" : "Fill in schedule above"
              }
              onSubmit={handleCreateClassSession}
              fields={(busy) => {
                const selectedType = classTypeById.get(String(createSessionForm.class_type_id));
                const spw = Number(selectedType?.sessions_per_week) || 0;
                const durationMin = Number(selectedType?.duration_minutes) || 60;

                return (
                  <>
                    <Field label="Teacher">
                      <select
                        name="teacher_id"
                        required
                        disabled={busy}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 bg-white"
                        value={createSessionForm.teacher_id}
                        onChange={(e) =>
                          setCreateSessionForm((prev) => ({
                            ...prev,
                            teacher_id: e.target.value,
                            class_type_id: prev.class_type_id,
                            max_students: prev.max_students,
                            class_name: prev.class_name,
                            level: prev.level,
                            schedule: [],
                          }))
                        }
                      >
                        <option value="" disabled>
                          Select a teacher
                        </option>
                        {teachers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name || t.email}
                          </option>
                        ))}
                      </select>
                      {teachers.length === 0 && (
                        <div className="mt-1 text-xs text-gray-600">No teachers found.</div>
                      )}
                    </Field>

                    <Field label="Bundle">
                      <select
                        name="class_type_id"
                        required
                        disabled={busy}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 bg-white"
                        value={createSessionForm.class_type_id}
                        onChange={(e) =>
                          setCreateSessionForm((prev) => ({
                            ...prev,
                            class_type_id: e.target.value,
                            max_students: "",
                            class_name: prev.class_name,
                            level: prev.level,
                            schedule: [],
                          }))
                        }
                      >
                        <option value="" disabled>
                          Select a bundle
                        </option>
                        {activeClassTypes.map((ct) => (
                          <option key={ct.id} value={ct.id}>
                            {ct.name} ({ct.sessions_per_week || 1}×/week, {ct.duration_minutes || 60} min)
                          </option>
                        ))}
                      </select>
                      {activeClassTypes.length === 0 && (
                        <div className="mt-1 text-xs text-gray-600">
                          Create a bundle first at{" "}
                          <a href="/admin/bundles" className="underline text-amber-600">
                            Manage Bundles
                          </a>
                          .
                        </div>
                      )}
                    </Field>

                    {spw > 0 && (
                      <>
                        {/* Class name & level */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Field label="Class name (optional)">
                            <input
                              type="text"
                              disabled={busy}
                              placeholder="e.g. Group A – Morning"
                              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                              value={createSessionForm.class_name}
                              onChange={(e) =>
                                setCreateSessionForm((prev) => ({ ...prev, class_name: e.target.value }))
                              }
                            />
                            <div className="mt-0.5 text-[10px] text-gray-400">
                              Auto-generated if empty
                            </div>
                          </Field>
                          <Field label="Level (optional)">
                            <select
                              disabled={busy}
                              className="w-full rounded-xl border border-gray-200 px-3 py-2 bg-white text-sm"
                              value={createSessionForm.level}
                              onChange={(e) =>
                                setCreateSessionForm((prev) => ({ ...prev, level: e.target.value }))
                              }
                            >
                              <option value="">No level</option>
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                          </Field>
                        </div>

                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                          <strong>{selectedType.name}</strong> — {spw} session{spw > 1 ? "s" : ""}/week × 4 weeks = <strong>{spw * 4} sessions</strong> total.
                          <br />
                          Each session is {durationMin} minutes. Google Meet links are generated automatically.
                        </div>

                        {/* Availability toggle */}
                        <label className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 cursor-pointer select-none">
                          <span className="text-sm font-medium text-gray-700">
                            Use teacher availability
                          </span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={useAvailability}
                            disabled={busy}
                            onClick={() => {
                              setUseAvailability((v) => !v);
                              setSelectedSuggestionIdx(null);
                              setCreateSessionForm((prev) => ({ ...prev, schedule: [] }));
                            }}
                            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                              useAvailability ? "bg-gray-900" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                useAvailability ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </label>

                        {/* ── Suggestion-based scheduling (availability ON) ── */}
                        {useAvailability && (
                          <div className="space-y-2">
                            <div className="text-sm font-semibold text-gray-900">
                              Available schedules
                            </div>

                            {suggestionsLoading && (
                              <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-500">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                                Loading schedule options…
                              </div>
                            )}

                            {suggestionsError && !suggestionsLoading && (
                              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                                {suggestionsError}
                              </div>
                            )}

                            {!suggestionsLoading && !suggestionsError && suggestions.length === 0 && (
                              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                                No available schedule options. The teacher may need to add availability first,
                                or you can turn off the toggle above to enter times manually.
                              </div>
                            )}

                            {!suggestionsLoading && suggestions.length > 0 && (
                              <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-2">
                                {suggestions.map((sug, idx) => {
                                  const isSelected = selectedSuggestionIdx === idx;
                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      disabled={busy}
                                      onClick={() => {
                                        setSelectedSuggestionIdx(idx);
                                        const schedule = sug.schedule.map((s) => ({
                                          day_of_week: String(s.dayOfWeek),
                                          start_time: s.startTime,
                                        }));
                                        setCreateSessionForm((prev) => ({ ...prev, schedule }));
                                      }}
                                      className={`w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                                        isSelected
                                          ? "bg-gray-900 text-white shadow-sm"
                                          : "bg-white text-gray-800 border border-gray-200 hover:border-gray-400 hover:bg-gray-100"
                                      }`}
                                    >
                                      {sug.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {selectedSuggestionIdx != null && (
                              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                                ✓ Selected: <strong>{suggestions[selectedSuggestionIdx]?.label}</strong>
                              </div>
                            )}
                          </div>
                        )}

                        {/* ── Manual schedule inputs (availability OFF) ── */}
                        {!useAvailability && (
                          <div className="space-y-2">
                            <div className="text-sm font-semibold text-gray-900">
                              Manual schedule ({spw} slot{spw > 1 ? "s" : ""})
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
                              Availability check is off — you can choose any day and time.
                            </div>
                            {(createSessionForm.schedule || []).map((entry, idx) => {
                              const DAY_OPTIONS = [
                                { value: "0", label: "Sunday" },
                                { value: "1", label: "Monday" },
                                { value: "2", label: "Tuesday" },
                                { value: "3", label: "Wednesday" },
                                { value: "4", label: "Thursday" },
                                { value: "5", label: "Friday" },
                                { value: "6", label: "Saturday" },
                              ];
                              return (
                                <div key={idx} className="flex items-center gap-2">
                                  <span className="shrink-0 text-xs font-medium text-gray-500 w-14">
                                    Slot {idx + 1}
                                  </span>
                                  <select
                                    disabled={busy}
                                    className="flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm"
                                    value={entry.day_of_week}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setCreateSessionForm((prev) => {
                                        const next = [...prev.schedule];
                                        next[idx] = { ...next[idx], day_of_week: val };
                                        return { ...prev, schedule: next };
                                      });
                                    }}
                                  >
                                    <option value="" disabled>Day</option>
                                    {DAY_OPTIONS.map((d) => (
                                      <option key={d.value} value={d.value}>{d.label}</option>
                                    ))}
                                  </select>
                                  <input
                                    type="time"
                                    disabled={busy}
                                    className="flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm"
                                    value={entry.start_time}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setCreateSessionForm((prev) => {
                                        const next = [...prev.schedule];
                                        next[idx] = { ...next[idx], start_time: val };
                                        return { ...prev, schedule: next };
                                      });
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </>
                );
              }}
            />
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium text-gray-900">{label}</div>
      {children}
    </label>
  );
}

function Form({ onSubmit, fields, submitLabel }) {
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setBusy(true);
    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData);
      e.currentTarget.reset();
    } catch (error) {
      setFormError(error?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {formError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {formError}
        </div>
      )}
      {fields(busy)}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={busy}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {busy ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
