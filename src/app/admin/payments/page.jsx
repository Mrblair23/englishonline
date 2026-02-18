import { useCallback, useEffect, useMemo, useState } from "react";
import { CreditCard, Plus, CheckCircle2, XCircle, Clock4, Search } from "lucide-react";

import useAdmin from "@/utils/useAdmin";
import AdminLayout from "@/components/AdminLayout";
import { apiFetch } from "@/utils/apiClient";

function formatMoneyFromCents(amountCents) {
  if (amountCents == null) return "—";
  const value = Number(amountCents);
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value / 100);
}

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en", {
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

export default function AdminPaymentsPage() {
  const { isAdmin, loading } = useAdmin();
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  useEffect(() => {
    if (!loading && !isAdmin) {
      window.location.href = "/account/signin";
    }
  }, [isAdmin, loading]);

  const fetchPayments = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingPayments(true);
    setError(null);
    try {
      const path = statusFilter ? `/api/payments?status=${encodeURIComponent(statusFilter)}` : "/api/payments";
      const response = await apiFetch(path);
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(normalizeApiError(payload) || "Failed to load payments");
      }
      const data = await response.json();
      setPayments(Array.isArray(data.payments) ? data.payments : []);
    } catch (e) {
      console.error("GET /api/payments failed", e);
      setError(e?.message || "Unable to load payments");
      setPayments([]);
    } finally {
      setLoadingPayments(false);
    }
  }, [isAdmin, statusFilter]);

  const fetchStudents = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingStudents(true);
    try {
      const response = await apiFetch("/admin/students");
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setStudents(Array.isArray(data.students) ? data.students : []);
    } catch (e) {
      console.error("GET /admin/students failed", e);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    if (showCreateModal && students.length === 0) {
      fetchStudents();
    }
  }, [fetchStudents, showCreateModal, students.length]);

  const handleCreatePayment = useCallback(
    async ({ student_id, amount_usd, method, reference_note }) => {
      try {
        const amountUsd = Number(amount_usd);
        if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
          alert("Amount must be greater than 0");
          return;
        }

        const amount_cents = Math.round(amountUsd * 100);

        const response = await apiFetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id,
            amount_cents,
            method,
            reference_note,
          }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(normalizeApiError(payload) || "Failed to create payment");
        }

        setShowCreateModal(false);
        await fetchPayments();
      } catch (e) {
        console.error("POST /api/payments failed", e);
        alert(e?.message || "Unable to create payment");
      }
    },
    [fetchPayments]
  );

  const updatePaymentStatus = useCallback(
    async (paymentId, action) => {
      try {
        const response = await apiFetch(`/api/payments/${paymentId}/${action}`, {
          method: "POST",
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(normalizeApiError(payload) || `Failed to ${action} payment`);
        }

        await fetchPayments();
      } catch (e) {
        console.error(`POST /api/payments/:id/${action} failed`, e);
        alert(e?.message || `Unable to ${action} payment`);
      }
    },
    [fetchPayments]
  );

  const stats = useMemo(() => {
    const pending = payments.filter((p) => p.status === "pending").length;
    const approved = payments.filter((p) => p.status === "approved").length;
    const rejected = payments.filter((p) => p.status === "rejected").length;
    return { pending, approved, rejected, total: payments.length };
  }, [payments]);

  const filteredStudents = useMemo(() => {
    if (!studentSearch) return students;
    const q = studentSearch.toLowerCase();
    return students.filter((s) => {
      return (
        String(s?.id ?? "").includes(q) ||
        s?.name?.toLowerCase().includes(q) ||
        s?.email?.toLowerCase().includes(q)
      );
    });
  }, [studentSearch, students]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bm-page-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#3FA9A6]"></div>
      </div>
    );
  }

  return (
    <AdminLayout currentPage="payments">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="bm-page-title mb-2">
              Manual Payments
            </h1>
            <p className="bm-page-subtitle">Admin-only Zelle confirmation flow</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bm-btn-primary"
          >
            <Plus size={20} />
            Create manual payment
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total" value={stats.total} icon={<CreditCard size={22} />} />
          <StatCard label="Pending" value={stats.pending} icon={<Clock4 size={22} />} />
          <StatCard label="Approved" value={stats.approved} icon={<CheckCircle2 size={22} />} />
          <StatCard label="Rejected" value={stats.rejected} icon={<XCircle size={22} />} />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <FilterChip active={!statusFilter} onClick={() => setStatusFilter("")}>All</FilterChip>
          <FilterChip active={statusFilter === "pending"} onClick={() => setStatusFilter("pending")}>Pending</FilterChip>
          <FilterChip active={statusFilter === "approved"} onClick={() => setStatusFilter("approved")}>Approved</FilterChip>
          <FilterChip active={statusFilter === "rejected"} onClick={() => setStatusFilter("rejected")}>Rejected</FilterChip>
          <button
            onClick={() => fetchPayments()}
            className="ml-auto bm-btn-outline py-2"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="bm-table-card">
          {loadingPayments ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3FA9A6] mx-auto"></div>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12 px-4">
              <CreditCard size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No payments found
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Create a manual payment record to track confirmations.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bm-btn-primary"
              >
                <Plus size={20} />
                Create manual payment
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Method
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Reference
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.student_name || "Unknown"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.student_email || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatMoneyFromCents(payment.amount_cents)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{payment.method}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[280px] truncate">
                        {payment.reference_note || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === "approved"
                              ? "bg-emerald-50 text-emerald-700"
                              : payment.status === "rejected"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {payment.status === "approved" ? (
                            <CheckCircle2 size={14} className="mr-1" />
                          ) : payment.status === "rejected" ? (
                            <XCircle size={14} className="mr-1" />
                          ) : (
                            <Clock4 size={14} className="mr-1" />
                          )}
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDateTime(payment.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {payment.status === "pending" ? (
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => {
                                if (window.confirm("Approve this payment?")) {
                                  updatePaymentStatus(payment.id, "approve");
                                }
                              }}
                              className="rounded-2xl bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("Reject this payment?")) {
                                  updatePaymentStatus(payment.id, "reject");
                                }
                              }}
                              className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-gray-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bm-card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create manual payment</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleCreatePayment({
                    student_id: formData.get("student_id"),
                    amount_usd: formData.get("amount_usd"),
                    method: formData.get("method"),
                    reference_note: formData.get("reference_note"),
                  });
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Student
                    </label>
                    <div className="relative">
                      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        value={studentSearch}
                        onChange={(event) => setStudentSearch(event.target.value)}
                        placeholder="Search by name, email, or id"
                        className="bm-input-soft pl-12 pr-4"
                      />
                    </div>
                    <select
                      name="student_id"
                      required
                      className="mt-3 bm-input"
                    >
                      <option value="">Select a student</option>
                      {filteredStudents.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name ? `${s.name} (${s.email})` : s.email}
                        </option>
                      ))}
                    </select>
                    {loadingStudents && (
                      <p className="mt-2 text-xs text-gray-500">Loading students…</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Amount (USD)
                    </label>
                    <input
                      name="amount_usd"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="e.g. 120.00"
                      className="bm-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Method
                    </label>
                    <select
                      name="method"
                      required
                      defaultValue="zelle"
                      className="bm-input"
                    >
                      <option value="zelle">Zelle</option>
                      <option value="manual">Manual</option>
                      <option value="paypal">PayPal</option>
                      <option value="stripe">Stripe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reference note
                    </label>
                    <input
                      name="reference_note"
                      placeholder="e.g. Zelle sender name, confirmation code"
                      className="bm-input"
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bm-btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bm-btn-primary"
                  >
                    Create payment
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

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-3xl font-semibold text-gray-900">{value ?? "—"}</p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-3 text-gray-500">{icon}</div>
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bm-chip ${active ? "bm-chip-active" : ""}`}
    >
      {children}
    </button>
  );
}
