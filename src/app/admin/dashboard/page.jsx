import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Calendar,
  DollarSign,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import RoleGuard from "@/components/RoleGuard";
import { apiFetch } from "@/utils/apiClient";

// 👇 IMPORTANTE: evita prerender en build
export const prerender = false;

export default function AdminDashboardPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <AdminLayout currentPage="dashboard">
        <DashboardContent />
      </AdminLayout>
    </RoleGuard>
  );
}

function DashboardContent() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await apiFetch("/api/admin/dashboard");

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.error || "Failed to load admin dashboard");
        }

        const payload = await response.json();

        if (!active) return;

        setState({
          loading: false,
          error: null,
          data: payload,
        });
      } catch (error) {
        if (!active) return;

        setState({
          loading: false,
          error: error.message || "Unable to load dashboard",
          data: null,
        });
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const kpis = state.data?.kpis ?? {
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    paidStudents: 0,
    monthlyRevenueEstimate: 0,
  };

  const formatter = useMemo(() => new Intl.NumberFormat("en-US"), []);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    []
  );

  return (
    <div className="min-h-screen bm-page-bg p-6">
      <section className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-white/20 p-4">
            <Shield size={36} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-white/80">
              Administrator
            </p>
            <h1 className="text-3xl font-bold">Operations dashboard</h1>
          </div>
        </div>
      </section>

      {state.error && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <AlertCircle size={18} />
          <span>{state.error}</span>
        </div>
      )}

      {state.loading ? (
        <div className="mt-10 flex items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-sm text-gray-500">
          Loading dashboard…
        </div>
      ) : (
        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Total users"
            value={formatter.format(kpis.totalUsers)}
            icon={<Users size={24} className="text-indigo-600" />}
          />
          <KpiCard
            label="Students"
            value={formatter.format(kpis.totalStudents)}
            helper={`${formatter.format(kpis.paidStudents)} paid`}
            icon={<TrendingUp size={24} className="text-emerald-600" />}
          />
          <KpiCard
            label="Teachers"
            value={formatter.format(kpis.totalTeachers)}
            icon={<Activity size={24} className="text-purple-600" />}
          />
          <KpiCard
            label="Monthly revenue"
            value={currencyFormatter.format(
              kpis.monthlyRevenueEstimate
            )}
            icon={<DollarSign size={24} className="text-amber-600" />}
          />
        </section>
      )}
    </div>
  );
}

function KpiCard({ label, value, helper, icon }) {
  return (
    <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-gray-500">
          {label}
        </p>
        <span className="rounded-full bg-gray-100 p-2">{icon}</span>
      </div>
      <p className="text-3xl font-semibold text-gray-900">{value}</p>
      {helper && <p className="text-xs text-gray-500">{helper}</p>}
    </article>
  );
}
