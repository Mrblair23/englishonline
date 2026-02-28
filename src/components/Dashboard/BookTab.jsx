import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  User,
  Users,
  CheckCircle2,
  Loader2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  AlertCircle,
  Lock,
} from "lucide-react";
import { apiFetch } from "@/utils/apiClient";
import { useLanguage } from "@/utils/useLanguage";

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.toDateString() === now.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatDateShort(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatPrice(cents) {
  if (!cents || cents <= 0) return null;
  const dollars = cents / 100;
  return `$${dollars.toFixed(dollars % 1 === 0 ? 0 : 2)} USD`;
}

/**
 * Groups sessions by bundle_id into bundle objects.
 * Sessions without a bundle_id become standalone bundles of 1.
 */
function groupSessionsByBundle(sessions) {
  const bundleMap = new Map();

  for (const s of sessions) {
    const key = s.bundle_id || `standalone_${s.id}`;
    if (!bundleMap.has(key)) {
      bundleMap.set(key, {
        bundleId: s.bundle_id || null,
        className: s.class_name || null,
        level: s.level || null,
        classTypeName: s.class_type_name,
        classTypeId: s.class_type_id,
        classMode: s.class_mode || s.session_type || "group",
        teacherName: s.teacher_name,
        priceCents: s.price_cents,
        sessionsPerWeek: s.sessions_per_week,
        sessions: [],
      });
    }
    bundleMap.get(key).sessions.push(s);
  }

  // Sort sessions within each bundle by date
  for (const bundle of bundleMap.values()) {
    bundle.sessions.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  }

  // Sort bundles by earliest session date
  return [...bundleMap.values()].sort(
    (a, b) => new Date(a.sessions[0].start_time) - new Date(b.sessions[0].start_time)
  );
}

/**
 * Build a schedule pattern label, e.g. "Mon & Wed, 6:00 PM"
 */
function buildScheduleLabel(sessions) {
  const dayTimeMap = new Map();
  for (const s of sessions) {
    const d = new Date(s.start_time);
    const dayName = d.toLocaleDateString(undefined, { weekday: "short" });
    const time = formatTime(s.start_time);
    const key = `${d.getDay()}_${time}`;
    if (!dayTimeMap.has(key)) {
      dayTimeMap.set(key, { dayName, time, dow: d.getDay() });
    }
  }
  const patterns = [...dayTimeMap.values()].sort((a, b) => a.dow - b.dow);
  // Check if all same time
  const uniqueTimes = new Set(patterns.map((p) => p.time));
  if (uniqueTimes.size === 1) {
    return `${patterns.map((p) => p.dayName).join(" & ")}, ${patterns[0].time}`;
  }
  return patterns.map((p) => `${p.dayName} ${p.time}`).join(" & ");
}

export function BookTab() {
  const { language } = useLanguage();
  const t = (tr) => tr[language] || tr.en;

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null); // bundle key being booked
  const [booked, setBooked] = useState(new Set()); // session ids already booked
  const [bookableTypes, setBookableTypes] = useState(null);
  const [bookError, setBookError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sessRes, bookRes] = await Promise.all([
        apiFetch("/api/class-sessions"),
        apiFetch("/api/bookings/my"),
      ]);
      if (!sessRes.ok) throw new Error("Failed to fetch sessions");
      const sessData = await sessRes.json();
      setSessions(sessData.sessions || []);
      if (Array.isArray(sessData.bookableClassTypeIds)) {
        setBookableTypes(new Set(sessData.bookableClassTypeIds));
      }

      if (bookRes.ok) {
        const bookData = await bookRes.json();
        const ids = new Set(
          (bookData.bookings || [])
            .filter((b) => b.booking_status === "confirmed")
            .map((b) => b.session_id)
        );
        setBooked(ids);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Group sessions into bundles
  const bundles = useMemo(() => {
    const avail = sessions.filter((s) => parseInt(s.seats_left) > 0 || booked.has(s.id));
    return groupSessionsByBundle(avail);
  }, [sessions, booked]);

  const handleBookBundle = async (bundle) => {
    const bundleKey = bundle.bundleId || bundle.sessions[0]?.id;
    setBooking(bundleKey);
    setBookError(null);
    try {
      let res;
      if (bundle.bundleId) {
        // Book entire bundle
        res = await apiFetch("/api/bookings/bundle", {
          method: "POST",
          body: JSON.stringify({ bundle_id: bundle.bundleId }),
        });
      } else {
        // Standalone session — use single booking
        res = await apiFetch("/api/bookings", {
          method: "POST",
          body: JSON.stringify({ session_id: bundle.sessions[0].id }),
        });
      }
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403 && /subscription/i.test(data.error)) {
          setBookError({ type: "no-plan", message: data.error });
          return;
        }
        throw new Error(data.error || "Booking failed");
      }
      await fetchData();
    } catch (err) {
      setBookError({ type: "error", message: err.message });
    } finally {
      setBooking(null);
    }
  };

  // Check if all sessions in a bundle are booked
  const isBundleBooked = (bundle) =>
    bundle.sessions.length > 0 && bundle.sessions.every((s) => booked.has(s.id));

  // Check if some (but not all) are booked
  const isBundlePartiallyBooked = (bundle) =>
    bundle.sessions.some((s) => booked.has(s.id)) && !isBundleBooked(bundle);

  const renderBundleCard = (bundle) => {
    const allBooked = isBundleBooked(bundle);
    const partiallyBooked = isBundlePartiallyBooked(bundle);
    const canBook = !bookableTypes || bookableTypes.has(bundle.classTypeId);
    const isLocked = !canBook && !allBooked;
    const totalSessions = bundle.sessions.length;
    const bookedCount = bundle.sessions.filter((s) => booked.has(s.id)).length;
    const anyFull = bundle.sessions.some((s) => parseInt(s.seats_left) <= 0 && !booked.has(s.id));
    const allFull = bundle.sessions.every((s) => parseInt(s.seats_left) <= 0) && !allBooked;
    const scheduleLabel = buildScheduleLabel(bundle.sessions);
    const price = formatPrice(bundle.priceCents);
    const bundleKey = bundle.bundleId || bundle.sessions[0]?.id;
    const isBooking = booking === bundleKey;
    const mode = bundle.classMode;
    const durationMin = bundle.sessions[0]?.duration_minutes;

    return (
      <div
        key={bundleKey}
        className={`group flex flex-col p-5 sm:p-6 bg-white rounded-xl border transition-all duration-300 ${
          allBooked
            ? "border-[#3FA9A6]/30 bg-[#3FA9A6]/5"
            : isLocked
              ? "border-gray-200 opacity-60"
              : allFull
                ? "border-gray-200 opacity-60"
                : "border-gray-200/50 hover:shadow-lg"
        }`}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-1.5">
              <span className="text-xs font-semibold text-[#3FA9A6] uppercase tracking-wider bg-[#3FA9A6]/10 px-3 py-1 rounded-xl">
                {bundle.classTypeName || "Class"}
              </span>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-lg capitalize">
                {mode === "private"
                  ? (language === "es" ? "Privada" : "Private")
                  : mode === "duo" ? "Duo"
                  : (language === "es" ? "Grupal" : "Group")}
              </span>
              {bundle.level && (
                <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-lg ${
                  bundle.level === "beginner" ? "bg-green-50 text-green-700"
                  : bundle.level === "intermediate" ? "bg-amber-50 text-amber-700"
                  : "bg-red-50 text-red-700"
                }`}>
                  {bundle.level}
                </span>
              )}
              {bundle.bundleId && (
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg">
                  {totalSessions} {t({ en: "sessions", es: "sesiones" })}
                </span>
              )}
            </div>
            <h3 className="font-poppins font-semibold text-[#1F2A44] text-lg leading-tight">
              {bundle.className || bundle.classTypeName || "Class Session"}
            </h3>
            <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <CalendarDays size={14} />
                {scheduleLabel}
              </span>
              {durationMin && (
                <span className="text-gray-400">
                  ({durationMin} min)
                </span>
              )}
              {bundle.teacherName && (
                <span className="flex items-center gap-1">
                  <User size={14} />
                  {bundle.teacherName}
                </span>
              )}
              {price && (
                <span className="flex items-center gap-1 text-[#1F2A44] font-semibold">
                  <DollarSign size={14} />
                  {price}
                </span>
              )}
            </div>
          </div>

          {/* Action button */}
          <div className="shrink-0 mt-1">
            {allBooked ? (
              <span className="inline-flex items-center gap-1.5 bg-[#3FA9A6]/10 text-[#3FA9A6] px-5 py-2 rounded-xl font-medium text-sm">
                <CheckCircle2 size={16} />
                {t({ en: "Booked", es: "Reservado" })}
              </span>
            ) : isLocked ? (
              <span
                className="inline-flex items-center gap-1.5 text-gray-400 px-5 py-2 rounded-xl font-medium text-sm"
                title={t({ en: "Not included in your plan", es: "No incluido en tu plan" })}
              >
                <Lock size={16} />
                {t({ en: "Not in plan", es: "No en tu plan" })}
              </span>
            ) : allFull ? (
              <span className="text-gray-400 font-medium px-5 py-2 text-sm">
                {t({ en: "Full", es: "Lleno" })}
              </span>
            ) : (
              <button
                onClick={() => handleBookBundle(bundle)}
                disabled={isBooking}
                className="bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] px-6 py-2 rounded-xl font-medium hover:brightness-105 hover:scale-105 transition-all shadow-md disabled:opacity-50 flex items-center space-x-2 text-sm"
              >
                {isBooking ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Calendar size={16} />
                )}
                <span>
                  {bundle.bundleId
                    ? t({ en: `Book all ${totalSessions} sessions`, es: `Reservar ${totalSessions} sesiones` })
                    : t({ en: "Book", es: "Reservar" })}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Session dates list */}
        {bundle.bundleId && (
          <div className="mt-2 border-t border-gray-100 pt-3">
            <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
              {t({ en: "Session dates", es: "Fechas de sesión" })}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {bundle.sessions.map((s) => {
                const isSessionBooked = booked.has(s.id);
                const seatsLeft = parseInt(s.seats_left);
                const sessionFull = seatsLeft <= 0 && !isSessionBooked;
                return (
                  <div
                    key={s.id}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
                      isSessionBooked
                        ? "bg-[#3FA9A6]/5 text-[#3FA9A6]"
                        : sessionFull
                          ? "bg-gray-50 text-gray-400"
                          : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {isSessionBooked ? (
                      <CheckCircle2 size={12} className="shrink-0" />
                    ) : (
                      <Clock size={12} className="shrink-0" />
                    )}
                    <span className="font-medium">
                      {formatDateShort(s.start_time)}
                    </span>
                    <span className="text-gray-400">
                      {formatTime(s.start_time)} – {formatTime(s.end_time)}
                    </span>
                    {isSessionBooked && (
                      <span className="ml-auto text-[10px] font-semibold">
                        ✓
                      </span>
                    )}
                    {sessionFull && !isSessionBooked && (
                      <span className="ml-auto text-[10px]">
                        {t({ en: "Full", es: "Lleno" })}
                      </span>
                    )}
                    {!isSessionBooked && !sessionFull && (
                      <span className="ml-auto text-[10px] text-gray-400">
                        <Users size={10} className="inline mr-0.5" />
                        {seatsLeft}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {partiallyBooked && (
              <div className="mt-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-1.5">
                {bookedCount}/{totalSessions} {t({ en: "sessions booked", es: "sesiones reservadas" })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#3FA9A6]" size={32} />
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 text-red-700 rounded-2xl p-8 text-center">
        {error}
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-white to-[#FAF9F7] rounded-2xl p-6 sm:p-8 border border-gray-200/50 shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h2 className="font-poppins text-2xl sm:text-3xl font-semibold text-[#1F2A44] leading-tight">
            {t({ en: "Book a Class", es: "Reservar una Clase" })}
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            {t({
              en: "Choose from available class bundles below — booking reserves all sessions at once",
              es: "Elige entre los paquetes disponibles — al reservar se apartan todas las sesiones",
            })}
          </p>
        </div>
      </div>

      <div className="mt-4">
        {/* No-plan or error banner */}
        {bookError && (
          <div className={`mb-4 p-4 rounded-xl flex items-start gap-3 ${
            bookError.type === "no-plan"
              ? "bg-amber-50 border border-amber-200"
              : "bg-red-50 border border-red-200"
          }`}>
            <AlertCircle size={20} className={bookError.type === "no-plan" ? "text-amber-500 mt-0.5 shrink-0" : "text-red-500 mt-0.5 shrink-0"} />
            <div className="flex-1">
              <p className={`font-medium ${bookError.type === "no-plan" ? "text-amber-800" : "text-red-800"}`}>
                {bookError.type === "no-plan"
                  ? t({ en: "You need an active plan to book classes", es: "Necesitas un plan activo para reservar clases" })
                  : bookError.message}
              </p>
              {bookError.type === "no-plan" && (
                <a
                  href="/choose-plan"
                  className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-amber-700 hover:text-amber-900 underline"
                >
                  {t({ en: "Choose a plan →", es: "Elige un plan →" })}
                </a>
              )}
            </div>
            <button onClick={() => setBookError(null)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        )}

        {bundles.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg">
              {t({
                en: "No available classes right now",
                es: "No hay clases disponibles ahora",
              })}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {t({
                en: "Check back later for new classes!",
                es: "¡Vuelve más tarde para ver nuevas clases!",
              })}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bundles.map(renderBundleCard)}
          </div>
        )}
      </div>
    </div>
  );
}
