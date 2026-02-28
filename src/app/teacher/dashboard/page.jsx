import { useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Users,
} from "lucide-react";
import TeacherLayout from "@/components/TeacherLayout";
import RoleGuard from "@/components/RoleGuard";
import { apiFetch } from "@/utils/apiClient";

export const prerender = false;

export default function TeacherDashboardPage() {
  return (
    <RoleGuard allow={["teacher"]}>
      <TeacherLayout currentPage="dashboard">
        <DashboardContent />
      </TeacherLayout>
    </RoleGuard>
  );
}

function DashboardContent() {
  const [sessions, setSessions] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [sessRes, availRes] = await Promise.all([
          apiFetch("/api/teacher/sessions"),
          apiFetch("/api/teacher/availability"),
        ]);

        if (!sessRes.ok) throw new Error("Failed to load sessions");
        if (!availRes.ok) throw new Error("Failed to load availability");

        const sessData = await sessRes.json();
        const availData = await availRes.json();

        if (!active) return;
        setSessions(sessData.sessions || []);
        setAvailability(availData.availability || []);
        setLoading(false);
      } catch (err) {
        if (!active) return;
        setError(err.message);
        setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  const now = new Date();
  const upcomingSessions = sessions.filter(
    (s) => new Date(s.startsAt) > now && s.status !== "cancelled"
  );
  const todaySessions = sessions.filter((s) => {
    const d = new Date(s.startsAt);
    return (
      d.toDateString() === now.toDateString() && s.status !== "cancelled"
    );
  });
  const completedSessions = sessions.filter((s) => s.status === "completed");

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-[#1F2A44] to-[#3FA9A6] p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-white/20 p-4">
            <GraduationCap size={36} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-white/80">
              Teacher
            </p>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
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
          Loading dashboard…
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              icon={<Calendar size={20} />}
              label="Today's Classes"
              value={todaySessions.length}
              color="text-teal-600 bg-teal-50"
            />
            <KpiCard
              icon={<Clock size={20} />}
              label="Upcoming"
              value={upcomingSessions.length}
              color="text-blue-600 bg-blue-50"
            />
            <KpiCard
              icon={<BookOpen size={20} />}
              label="Completed"
              value={completedSessions.length}
              color="text-emerald-600 bg-emerald-50"
            />
            <KpiCard
              icon={<Users size={20} />}
              label="Availability Blocks"
              value={availability.filter((a) => a.is_active).length}
              color="text-purple-600 bg-purple-50"
            />
          </div>

          {/* Today's sessions */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              Today's Classes
            </h2>
            {todaySessions.length === 0 ? (
              <p className="text-sm text-gray-500">No classes scheduled for today.</p>
            ) : (
              <div className="space-y-3">
                {todaySessions.map((s) => (
                  <SessionCard key={s.id} session={s} />
                ))}
              </div>
            )}
          </section>

          {/* Weekly availability snapshot */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                My Availability
              </h2>
              <a
                href="/teacher/availability"
                className="text-sm font-semibold text-teal-600 hover:underline"
              >
                Manage →
              </a>
            </div>
            {availability.filter((a) => a.is_active).length === 0 ? (
              <p className="text-sm text-gray-500">
                No availability set.{" "}
                <a
                  href="/teacher/availability"
                  className="font-semibold text-teal-600 hover:underline"
                >
                  Add your schedule
                </a>
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {availability
                  .filter((a) => a.is_active)
                  .map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-xs font-bold text-teal-700">
                        {dayNames[a.day_of_week]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {formatTime(a.start_time)} – {formatTime(a.end_time)}
                        </p>
                        <p className="text-xs text-gray-500">{a.timezone}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function KpiCard({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs font-medium text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function SessionCard({ session }) {
  const start = new Date(session.startsAt);
  const end = new Date(session.endsAt);
  const dur = Math.round((end - start) / 60_000);

  const modeBadge = session.classType?.mode === "duo" ? "DUO" :
    session.classType?.sessionsPerWeek === 2 ? "Group 2x" :
    session.classType?.sessionsPerWeek === 3 ? "Group 3x" :
    session.classType?.mode || "—";

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <p className="font-semibold text-gray-800">
            {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            {" – "}
            {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="text-xs text-gray-500">
            {session.classType?.name || "Class"} · {dur} min
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
        <StatusBadge status={session.status} />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    scheduled: "bg-blue-100 text-blue-700",
    upcoming: "bg-yellow-100 text-yellow-700",
    live: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-rose-100 text-rose-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = Number(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}
