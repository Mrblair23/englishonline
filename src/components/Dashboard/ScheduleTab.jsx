import { useState, useEffect, useMemo } from "react";
import {
  ArrowRight,
  CalendarDays,
  List,
  ChevronLeft,
  ChevronRight,
  Video,
  Clock,
  User,
  XCircle,
  Loader2,
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

export function ScheduleTab() {
  const { language } = useLanguage();
  const t = (tr) => tr[language] || tr.en;

  const [view, setView] = useState("list"); // "list" | "calendar"
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/bookings/my");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!confirm(t({ en: "Cancel this booking?", es: "¿Cancelar esta reserva?" }))) return;
    setCancelling(bookingId);
    try {
      const res = await apiFetch(`/api/bookings/${bookingId}/cancel`, { method: "PATCH" });
      if (!res.ok) throw new Error("Cancel failed");
      await fetchBookings();
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(null);
    }
  };

  // Only show confirmed, future bookings for list
  const upcomingBookings = useMemo(
    () =>
      bookings
        .filter(
          (b) =>
            b.booking_status === "confirmed" &&
            new Date(b.start_time) > new Date()
        )
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time)),
    [bookings]
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

  const bookingsByDate = useMemo(() => {
    const map = {};
    bookings
      .filter((b) => b.booking_status === "confirmed")
      .forEach((b) => {
        const key = new Date(b.start_time).toDateString();
        if (!map[key]) map[key] = [];
        map[key].push(b);
      });
    return map;
  }, [bookings]);

  const [selectedDay, setSelectedDay] = useState(null);
  const selectedBookings = selectedDay
    ? bookingsByDate[selectedDay.toDateString()] || []
    : [];

  const prevMonth = () =>
    setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1));
  const nextMonth = () =>
    setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1));

  const monthLabel = calMonth.toLocaleDateString(language === "es" ? "es" : "en", {
    month: "long",
    year: "numeric",
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="font-poppins text-2xl sm:text-3xl font-semibold text-[#1F2A44] leading-tight">
          {t({ en: "My Schedule", es: "Mi Horario" })}
        </h2>
        <div className="flex bg-gray-100 rounded-xl p-1 self-start">
          <button
            onClick={() => setView("list")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === "list"
                ? "bg-white text-[#1F2A44] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <List size={16} />
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
        <>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-16">
              <CalendarDays
                className="mx-auto text-gray-300 mb-4"
                size={48}
              />
              <p className="text-gray-500 text-lg mb-2">
                {t({
                  en: "No upcoming classes",
                  es: "No hay clases próximas",
                })}
              </p>
              <p className="text-gray-400 text-sm">
                {t({
                  en: 'Book a class from the "Book" tab to get started!',
                  es: 'Reserva una clase en la pestaña "Reservar" para comenzar.',
                })}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((b) => (
                <div
                  key={b.booking_id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 bg-white rounded-xl border border-gray-200/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className="text-xs font-semibold text-[#3FA9A6] uppercase tracking-wider bg-[#3FA9A6]/10 px-3 py-1 rounded-xl">
                        {b.class_type_name || t({ en: "Class", es: "Clase" })}
                      </span>
                      {b.teacher_name && (
                        <span className="flex items-center text-xs text-gray-500 gap-1">
                          <User size={12} />
                          {b.teacher_name}
                        </span>
                      )}
                    </div>
                    <h3 className="font-poppins font-semibold text-[#1F2A44] text-lg leading-tight mb-1">
                      {b.class_type_name || t({ en: "Class Session", es: "Sesión de clase" })}
                    </h3>
                    <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {formatDate(b.start_time)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatTime(b.start_time)} – {formatTime(b.end_time)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {b.meet_link && new Date(b.start_time) <= new Date(new Date().getTime() + 15 * 60000) && (
                      <a
                        href={b.meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn bg-gradient-to-r from-[#3FA9A6] to-[#35918f] text-white px-5 py-2 rounded-xl font-medium hover:brightness-110 transition-all shadow-md flex items-center space-x-2"
                      >
                        <Video size={16} />
                        <span>{t({ en: "Join", es: "Unirse" })}</span>
                        <ArrowRight
                          size={16}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </a>
                    )}
                    <button
                      onClick={() => handleCancel(b.booking_id)}
                      disabled={cancelling === b.booking_id}
                      className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50"
                      title={t({ en: "Cancel booking", es: "Cancelar reserva" })}
                    >
                      {cancelling === b.booking_id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <XCircle size={18} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* CALENDAR VIEW */}
      {view === "calendar" && (
        <div>
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
              const dayBookings = bookingsByDate[day.toDateString()] || [];
              const isSelected = selectedDay && isSameDay(day, selectedDay);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  className={`relative p-2 sm:p-3 rounded-xl text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-[#3FA9A6] text-white shadow-md"
                      : isToday
                        ? "bg-[#F2B705]/20 text-[#1F2A44] font-bold"
                        : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {day.getDate()}
                  {dayBookings.length > 0 && (
                    <span
                      className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                        isSelected ? "bg-white" : "bg-[#3FA9A6]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected day bookings */}
          {selectedDay && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <h4 className="font-poppins font-semibold text-[#1F2A44] mb-3">
                {selectedDay.toLocaleDateString(language === "es" ? "es" : "en", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h4>
              {selectedBookings.length === 0 ? (
                <p className="text-gray-400 text-sm py-4 text-center">
                  {t({
                    en: "No classes on this day",
                    es: "No hay clases este día",
                  })}
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedBookings.map((b) => (
                    <div
                      key={b.booking_id}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200/50"
                    >
                      <div>
                        <p className="font-semibold text-[#1F2A44]">
                          {b.class_type_name || "Class"}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          {formatTime(b.start_time)} – {formatTime(b.end_time)}
                          {b.teacher_name && (
                            <span className="ml-2 flex items-center gap-1">
                              <User size={12} />
                              {b.teacher_name}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {b.meet_link && (
                          <a
                            href={b.meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#3FA9A6] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:brightness-110 transition-all flex items-center gap-1"
                          >
                            <Video size={14} />
                            {t({ en: "Join", es: "Unirse" })}
                          </a>
                        )}
                        <button
                          onClick={() => handleCancel(b.booking_id)}
                          disabled={cancelling === b.booking_id}
                          className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                        >
                          {cancelling === b.booking_id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <XCircle size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
