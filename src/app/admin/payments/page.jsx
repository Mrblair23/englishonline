import { useCallback, useEffect, useMemo, useState } from "react";
import { CreditCard, Plus, CheckCircle2, XCircle, Clock4, Search, Eye, FileText } from "lucide-react";

import useAdmin from "@/utils/useAdmin";
import AdminLayout from "@/components/AdminLayout";
import { apiFetch } from "@/utils/apiClient";

function formatMoney(amount) {
  if (amount == null) return "—";
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
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
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectNote, setRejectNote] = useState("");

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
      const path = statusFilter
        ? `/api/payment-requests?status=${encodeURIComponent(statusFilter)}`
        : "/api/payment-requests";
      const response = await apiFetch(path);
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(normalizeApiError(payload) || "Failed to load payments");
      }
      const data = await response.json();
      setPayments(Array.isArray(data.paymentRequests) ? data.paymentRequests : []);
    } catch (e) {
      console.error("GET /api/payment-requests failed", e);
      setError(e?.message || "Unable to load payments");
      setPayments([]);
    } finally {
      setLoadingPayments(false);
    }
  }, [isAdmin, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleViewProof = useCallback(async (paymentId) => {
    try {
      const response = await apiFetch(`/api/payment-requests/${paymentId}/proof`);
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(normalizeApiError(payload) || "Failed to get proof URL");
      }
      const data = await response.json();
      window.open(data.signedUrl, "_blank");
    } catch (e) {
      console.error("GET proof URL failed", e);
      alert(e?.message || "Unable to load proof");
    }
  }, []);

  const handleApprove = useCallback(
    async (paymentId) => {
      if (!window.confirm("Approve this payment and activate the student's subscription?")) return;
      try {
        const response = await apiFetch(`/api/payment-requests/${paymentId}/approve`, {
          method: "PATCH",
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(normalizeApiError(payload) || "Failed to approve");
        }
        await fetchPayments();
      } catch (e) {
        console.error("Approve failed", e);
        alert(e?.message || "Unable to approve payment");
      }
    },
    [fetchPayments]
  );

  const handleReject = useCallback(
    async (paymentId) => {
      try {
        const response = await apiFetch(`/api/payment-requests/${paymentId}/reject`, {
          method: "PATCH",
          body: JSON.stringify({ note: rejectNote.trim() || null }),
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(normalizeApiError(payload) || "Failed to reject");
        }
        setRejectingId(null);
        setRejectNote("");
        await fetchPayments();
      } catch (e) {
        console.error("Reject failed", e);
        alert(e?.message || "Unable to reject payment");
      }
    },
    [fetchPayments, rejectNote]
  );

  const stats = useMemo(() => {
    const pending = payments.filter((p) => p.status === "pending").length;
    const approved = payments.filter((p) => p.status === "approved").length;
    const rejected = payments.filter((p) => p.status === "rejected").length;
    return { pending, approved, rejected, total: payments.length };
  }, [payments]);

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
        <div className="mb-8">
          <h1 className="bm-page-title mb-2">Payment Verification</h1>
          <p className="bm-page-subtitle">
            Review student payment proofs and activate subscriptions
          </p>
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
          <button onClick={() => fetchPayments()} className="ml-auto bm-btn-outline py-2">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-500 text-sm">
                {statusFilter
                  ? `No ${statusFilter} payments. Try a different filter.`
                  : "When students submit payment proofs they will appear here."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Plan</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Proof</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Submitted</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{p.student_name || "Unknown"}</div>
                        <div className="text-sm text-gray-500">{p.student_email || "—"}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.plan_name || p.plan_slug || "—"}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatMoney(p.amount)}</td>
                      <td className="px-6 py-4">
                        {p.proof_url ? (
                          <button
                            onClick={() => handleViewProof(p.id)}
                            className="inline-flex items-center gap-1.5 text-sm text-[#3FA9A6] hover:text-[#2d7d7a] font-medium"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                            p.status === "approved"
                              ? "bg-emerald-50 text-emerald-700"
                              : p.status === "rejected"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {p.status === "approved" ? (
                            <CheckCircle2 size={14} className="mr-1" />
                          ) : p.status === "rejected" ? (
                            <XCircle size={14} className="mr-1" />
                          ) : (
                            <Clock4 size={14} className="mr-1" />
                          )}
                          {p.status}
                        </span>
                        {p.admin_note && (
                          <p className="mt-1 text-xs text-gray-500 max-w-[200px] truncate" title={p.admin_note}>
                            Note: {p.admin_note}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDateTime(p.created_at)}</td>
                      <td className="px-6 py-4 text-right">
                        {p.status === "pending" ? (
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => handleApprove(p.id)}
                              className="rounded-2xl bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setRejectingId(p.id);
                                setRejectNote("");
                              }}
                              className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-gray-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : p.status === "approved" ? (
                          <span className="text-xs text-gray-400">{formatDateTime(p.approved_at)}</span>
                        ) : (
                          <span className="text-xs text-gray-400">{formatDateTime(p.rejected_at)}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reject modal */}
        {rejectingId && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bm-card p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Reject Payment</h3>
              <p className="text-sm text-gray-600 mb-4">
                Optionally add a note — the student will see this in their dashboard.
              </p>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="e.g. Could not verify payment, please resubmit a clearer screenshot"
                rows={3}
                className="bm-input w-full mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setRejectingId(null); setRejectNote(""); }}
                  className="flex-1 bm-btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(rejectingId)}
                  className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  Reject
                </button>
              </div>
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
