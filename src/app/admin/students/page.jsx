import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  ChevronRight,
  Clock4,
  Layers3,
  Mail,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { apiFetch } from "@/utils/apiClient";
import useAdmin from "@/utils/useAdmin";

function formatDate(value, options) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", options).format(date);
}

function relativeTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

export default function AdminStudentsPage() {
  const { isAdmin, loading } = useAdmin();
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [detailError, setDetailError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      window.location.href = "/account/signin";
    }
  }, [isAdmin, loading]);

  const fetchStudents = useCallback(async () => {
    if (!isAdmin) return;
    setListLoading(true);
    setError(null);
    try {
      const response = await apiFetch("/admin/students");
      if (!response.ok) {
        throw new Error("Failed to load students");
      }
      const data = await response.json();
      const list = Array.isArray(data.students) ? data.students : [];
      setStudents(list);
      setSelectedId((current) => current ?? list[0]?.id ?? null);
    } catch (err) {
      console.error("GET /admin/students failed", err);
      setError("We couldn't load students. Please try again.");
    } finally {
      setListLoading(false);
    }
  }, [isAdmin]);

  const fetchStudentDetail = useCallback(async (studentId) => {
    if (!studentId) {
      setDetail(null);
      return;
    }
    setDetailLoading(true);
    setDetailError(null);
    try {
      const response = await apiFetch(`/admin/students/${studentId}`);
      if (!response.ok) {
        throw new Error("Failed to load student");
      }
      const data = await response.json();
      setDetail(data);
    } catch (err) {
      console.error("GET /admin/students/:id failed", err);
      setDetailError("Unable to load student profile.");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (selectedId) {
      fetchStudentDetail(selectedId);
    }
  }, [selectedId, fetchStudentDetail]);

  const filteredStudents = useMemo(() => {
    if (!search) return students;
    const query = search.toLowerCase();
    return students.filter((student) => {
      return (
        student.name?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query)
      );
    });
  }, [students, search]);

  const handleCreateStudent = useCallback(
    async (payload) => {
      try {
        const response = await apiFetch("/admin/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || "Failed to create student");
        }
        const data = await response.json();
        setShowCreateModal(false);
        setSelectedId(data.student.id);
        await fetchStudents();
      } catch (err) {
        console.error("POST /admin/students failed", err);
        alert(err.message || "Unable to create student");
      }
    },
    [fetchStudents],
  );

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bm-page-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#3FA9A6]"></div>
      </div>
    );
  }

  return (
    <AdminLayout currentPage="students">
      <div className="p-4 sm:p-6 lg:p-10 space-y-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Operations</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Students & Enrollments
            </h1>
            <p className="text-gray-600">
              Audit every student, confirm their verification, and view their booked classes in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => fetchStudents()}
              className="bm-btn-outline"
            >
              Refresh list
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bm-btn-primary"
            >
              <UserPlus size={18} /> Add student
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Students"
            value={students.length}
            subtext="Total registered"
            icon={<Users size={24} />}
          />
          <StatCard
            label="Verified"
            value={students.filter((s) => s.emailVerified).length}
            subtext="Email confirmed"
            icon={<ShieldCheck size={24} />}
          />
          <StatCard
            label="Awaiting payment"
            value={students.filter((s) => !s.hasPaid).length}
            subtext="Billing ready"
            icon={<AlertTriangle size={24} />}
          />
          <StatCard
            label="Latest signup"
            value={relativeTime(students[0]?.createdAt)}
            subtext={formatDate(students[0]?.createdAt, {
              month: "short",
              day: "numeric",
            })}
            icon={<Clock4 size={24} />}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Students</h2>
                <p className="text-sm text-gray-500">Search and select to inspect details.</p>
              </div>
            </div>
            <div className="mt-4 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or email"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div className="mt-4 max-h-[520px] space-y-2 overflow-y-auto pr-2">
              {listLoading && (
                <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
                  Loading students...
                </div>
              )}
              {!listLoading && filteredStudents.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
                  No students match that search.
                </div>
              )}
              {filteredStudents.map((student) => {
                const isActive = student.id === selectedId;
                return (
                  <button
                    key={student.id}
                    onClick={() => setSelectedId(student.id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                      isActive
                        ? "border-amber-500/80 bg-amber-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{student.name || "Pending name"}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-semibold ${
                          student.emailVerified
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {student.emailVerified ? "Verified" : "Needs verification"}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-semibold ${
                          student.hasPaid
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {student.hasPaid ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] uppercase tracking-wide text-gray-400">
                      Joined {relativeTime(student.createdAt)}
                    </p>
                  </button>
                );
              })}
            </div>
            {error && (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Profile</p>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {detail?.student?.name || "Select a student"}
                </h2>
                <p className="text-sm text-gray-500">{detail?.student?.email}</p>
              </div>
              {detail?.student && (
                <div className="flex gap-2">
                  <Badge active={detail.student.emailVerified} label="Email verified" />
                  <Badge active={detail.student.hasPaid} label="Paid" variant="indigo" />
                </div>
              )}
            </div>

            {detailLoading && (
              <div className="mt-8 rounded-2xl border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-500">
                Loading student profile...
              </div>
            )}

            {detailError && (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {detailError}
              </div>
            )}

            {!detailLoading && detail?.student && (
              <div className="mt-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <MiniStat
                    icon={<Mail size={16} />}
                    label="Email"
                    value={detail.student.email}
                  />
                  <MiniStat
                    icon={<Layers3 size={16} />}
                    label="Status"
                    value={detail.student.hasPaid ? "Active" : "Pending"}
                  />
                  <MiniStat
                    icon={<CalendarClock size={16} />}
                    label="Joined"
                    value={formatDate(detail.student.createdAt, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Classes</p>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {detail.enrollments?.length || 0} enrolled
                      </h3>
                    </div>
                  </div>
                  {detail.enrollments?.length ? (
                    <div className="mt-4 space-y-3">
                      {detail.enrollments.map((slot) => (
                        <article
                          key={`${slot.slotId}-${slot.enrolledAt}`}
                          className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {slot.classTypeLabel || "Class slot"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(slot.startTime, {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                                {" · "}
                                {formatDate(slot.startTime, {
                                  hour: "numeric",
                                  minute: "numeric",
                                })}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                slot.status === "booked"
                                  ? "bg-indigo-600/10 text-indigo-700"
                                  : "bg-emerald-600/10 text-emerald-700"
                              }`}
                            >
                              {slot.status}
                            </span>
                          </div>
                          <div className="mt-3 grid gap-4 text-xs text-gray-600 sm:grid-cols-3">
                            <p>Teacher · {slot.teacher?.name || "TBD"}</p>
                            <p>
                              Seats {slot.maxStudents - slot.remainingSeats}/{slot.maxStudents}
                            </p>
                            <p>Enrolled {relativeTime(slot.enrolledAt)}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
                      No bookings yet for this student.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {showCreateModal && (
          <CreateStudentModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateStudent}
          />
        )}
      </div>
    </AdminLayout>
  );
}

function StatCard({ label, value, subtext, icon }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-3xl font-semibold text-gray-900">{value ?? "—"}</p>
          <p className="text-xs text-gray-400">{subtext || "—"}</p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-3 text-gray-500">{icon}</div>
      </div>
    </div>
  );
}

function Badge({ active, label, variant = "emerald" }) {
  const palette = {
    emerald: active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500",
    indigo: active ? "bg-indigo-50 text-indigo-700" : "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${palette[variant]}`}>
      {label}
    </span>
  );
}

function MiniStat({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/70 px-4 py-3">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        <span className="text-xs uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-gray-900">{value || "—"}</p>
    </div>
  );
}

function CreateStudentModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    await onSubmit({ name, email });
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Admin</p>
            <h3 className="text-2xl font-semibold text-gray-900">Create student</h3>
          </div>
          <button onClick={onClose} className="text-sm font-semibold text-gray-400 hover:text-gray-600">
            Close
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Students created here start verified and unpaid. Payments and bundles can be attached later.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600">Full name</label>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Sofia Ramirez"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="student@email.com"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <p className="text-xs text-gray-500">
            The student will receive access once onboarding emails are enabled.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create student"}
          </button>
        </form>
      </div>
    </div>
  );
}
