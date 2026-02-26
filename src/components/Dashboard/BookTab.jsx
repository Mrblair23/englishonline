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

export function BookTab() {
  const { language } = useLanguage();
  const t = (tr) => tr[language] || tr.en;

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null); // session id being booked
  const [booked, setBooked] = useState(new Set()); // session ids already booked
  const [bookError, setBookError] = useState(null); // error message with context
  const [view, setView] = useState("list"); // "list" | "calendar"
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState(null);

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

  const handleBook = async (sessionId) => {
    setBooking(sessionId);
    setBookError(null);
    try {
      const res = await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ session_id: sessionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        // If no active subscription, guide to pricing
        if (res.status === 403 && /subscription/i.test(data.error)) {
          setBookError({
            type: "no-plan",
            message: data.error,
          });
          return;
        }
        throw new Error(data.error || "Booking failed");
      }
      setBooked((prev) => new Set([...prev, sessionId]));
      await fetchData();
    } catch (err) {
      setBookError({ type: "error", message: err.message });
    } finally {
      setBooking(null);
    }
  };

  const available = useMemo(
    () => sessions.filter((s) => parseInt(s.seats_left) > 0 || booked.has(s.id)),
    [sessions, booked]
  );

  // Calendar helpers
  const calDays = useMemo(() => {
    const year = calMonth.getFullYear();
    const month = calMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
    return days;
  }, [calMonth]);

  const sessionsByDate = useMemo(() => {
    const map = {};
    available.forEach((s) => {
      const key = new Date(s.start_time).toDateString();
      if (!map[key]) map[key] = [];
      map[key].push(s);
    });
    return map;
  }, [available]);

  const selectedSessions = selectedDay
    ? sessionsByDate[selectedDay.toDateString()] || []
    : [];

  const prevMonth = () =>
    setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1));
  const nextMonth = () =>
    setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1));

  const monthLabel = calMonth.toLocaleDateString(language === "es" ? "es" : "en", {
    month: "long",
    year: "numeric",
  });

  const renderSessionCard = (session) => {
    const isBooked = booked.has(session.id);
    const seatsLeft = parseInt(session.seats_left);
    const isFull = seatsLeft <= 0 && !isBooked;
    const price = formatPrice(session.price_cents);
    const mode = session.class_mode || session.session_type || "group";

    return (
      <div
        key={session.id}
        className={`group flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 bg-white rounded-xl border transition-all duration-300 ${
          isBooked
            ? "border-[#3FA9A6]/30 bg-[#3FA9A6]/5"
            : isFull
              ? "border-gray-200 opacity-60"
              : "border-gray-200/50 hover:shadow-lg"
        }`}
      >
        <div className="flex-1 min-w-0 mb-3 sm:mb-0">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className="text-xs font-semibold text-[#3FA9A6] uppercase tracking-wider bg-[#3FA9A6]/10 px-3 py-1 rounded-xl">
              {session.class_type_name || "Class"}
            </span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-lg capitalize">
              {mode === "private" ? (language === "es" ? "Privada" : "Private")
                : mode === "duo" ? "Duo"
                : (language === "es" ? "Grupal" : "Group")}
            </span>
            {session.teacher_name && (
              <span className="flex items-center text-xs text-gray-500 gap-1">
                <User size={12} />
                {session.teacher_name}
              </span>
            )}
            <span className="flex items-center text-xs text-gray-500 gap-1">
              <Users size={12} />
              {seatsLeft} {t({ en: "seats left", es: "lugares disponibles" })}
            </span>
          </div>
          <h3 className="font-poppins font-semibold text-[#1F2A44] text-lg leading-tight mb-1">
            {session.class_type_name || "Class Session"}
          </h3>
          <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <CalendarDays size={14} />
              {formatDate(session.start_time)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {formatTime(session.start_time)} – {formatTime(session.end_time)}
            </span>
            {session.duration_minutes && (
              <span className="text-gray-400">
                ({session.duration_minutes} min)
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

        <div>
          {isBooked ? (
            <span className="inline-flex items-center gap-1.5 bg-[#3FA9A6]/10 text-[#3FA9A6] px-5 py-2 rounded-xl font-medium">
              <CheckCircle2 size={16} />
              {t({ en: "Booked", es: "Reservado" })}
            </span>
          ) : isFull ? (
            <span className="text-gray-400 font-medium px-5 py-2">
              {t({ en: "Full", es: "Lleno" })}
            </span>
          ) : (
            <button
              onClick={() => handleBook(session.id)}
              disabled={booking === session.id}
              className="bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] px-6 py-2 rounded-xl font-medium hover:brightness-105 hover:scale-105 transition-all shadow-md disabled:opacity-50 flex items-center space-x-2"
            >
              {booking === session.id ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Calendar size={16} />
              )}
              <span>{t({ en: "Book", es: "Reservar" })}</span>
            </button>
          )}
        </div>
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
              en: "Choose from available sessions below",
              es: "Elige entre las sesiones disponibles",
            })}
          </p>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1 self-start">
          <button
            onClick={() => setView("list")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === "list"
                ? "bg-white text-[#1F2A44] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Calendar size={16} />
            <span>{t({ en: "List", es: "Lista" })}</span>
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === "calendar"
                ? "bg-white text-[#1F2A44] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <CalendarDays size={16} />
            <span>{t({ en: "Calendar", es: "Calendario" })}</span>
          </button>
        </div>
      </div>

      {/* LIST VIEW */}
      {view === "list" && (
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
          {available.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 text-lg">
                {t({
                  en: "No available sessions right now",
                  es: "No hay sesiones disponibles ahora",
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
              {available.map(renderSessionCard)}
            </div>
          )}
        </div>
      )}

      {/* CALENDAR VIEW */}
      {view === "calendar" && (
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
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="font-poppins font-semibold text-lg text-[#1F2A44] capitalize">
              {monthLabel}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {(language === "es"
              ? ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
              : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            ).map((d) => (
              <div
                key={d}
                className="text-center text-xs font-semibold text-gray-400 py-2"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {calDays.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />;
              const today = new Date();
              const isToday = isSameDay(day, today);
              const daySessions = sessionsByDate[day.toDateString()] || [];
              const isSelected = selectedDay && isSameDay(day, selectedDay);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  className={`relative p-2 sm:p-3 rounded-xl text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-[#F2B705] text-[#1F2A44] shadow-md"
                      : isToday
                        ? "bg-[#3FA9A6]/10 text-[#1F2A44] font-bold"
                        : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {day.getDate()}
                  {daySessions.length > 0 && (
                    <span
                      className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                        isSelected ? "bg-[#1F2A44]" : "bg-[#F2B705]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected day sessions */}
          {selectedDay && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <h4 className="font-poppins font-semibold text-[#1F2A44] mb-3">
                {selectedDay.toLocaleDateString(language === "es" ? "es" : "en", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h4>
              {selectedSessions.length === 0 ? (
                <p className="text-gray-400 text-sm py-4 text-center">
                  {t({
                    en: "No sessions available on this day",
                    es: "No hay sesiones disponibles este día",
                  })}
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedSessions.map(renderSessionCard)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
