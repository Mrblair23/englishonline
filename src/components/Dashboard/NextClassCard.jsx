import { useState, useEffect } from "react";
import { Video, Clock, Calendar, ArrowRight, Loader2, User } from "lucide-react";
import { apiFetch } from "@/utils/apiClient";
import { useLanguage } from "@/utils/useLanguage";

function formatRelative(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = d - now;
  if (diffMs < 0) return null;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `in ${diffMin} min`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `in ${diffHr}h`;
  const diffDays = Math.floor(diffHr / 24);
  return `in ${diffDays}d`;
}

function formatTimeShort(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (d.toDateString() === now.toDateString()) return `Today at ${time}`;
  if (d.toDateString() === tomorrow.toDateString()) return `Tomorrow at ${time}`;
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) + ` at ${time}`;
}

export function NextClassCard({ onBookClass }) {
  const { language } = useLanguage();
  const t = (tr) => tr[language] || tr.en;

  const [nextClass, setNextClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/api/bookings/my");
        if (!res.ok) return;
        const data = await res.json();
        const upcoming = (data.bookings || [])
          .filter(
            (b) =>
              b.booking_status === "confirmed" &&
              new Date(b.start_time) > new Date()
          )
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        if (upcoming.length > 0) setNextClass(upcoming[0]);
      } catch (err) {
        console.error("NextClassCard fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const relative = nextClass ? formatRelative(nextClass.start_time) : null;

  return (
    <div className="group bg-gradient-to-br from-[#F2B705] to-[#f5c642] rounded-2xl p-8 text-[#1F2A44] shadow-lg relative overflow-hidden hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Video className="text-[#1F2A44]" size={24} />
          </div>
          <div>
            <h3 className="font-poppins text-lg font-semibold leading-tight">
              {t({ en: "Next class", es: "Próxima clase" })}
            </h3>
            <p className="text-[#1F2A44]/70 text-sm leading-relaxed">
              {t({ en: "Coming up soon", es: "Próximamente" })}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="animate-spin text-[#1F2A44]/50" size={24} />
          </div>
        ) : nextClass ? (
          <>
            <div className="mb-6">
              <h4 className="font-poppins text-xl font-semibold mb-2 leading-tight">
                {nextClass.class_type_name || t({ en: "Class Session", es: "Sesión de clase" })}
              </h4>
              {nextClass.teacher_name && (
                <div className="flex items-center gap-1.5 text-[#1F2A44]/70 mb-1">
                  <User size={14} />
                  <span className="text-sm">{nextClass.teacher_name}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-[#1F2A44]/70">
                <Clock size={16} />
                <span className="text-sm leading-relaxed">
                  {formatTimeShort(nextClass.start_time)}
                  {relative && ` (${relative})`}
                </span>
              </div>
            </div>
            {nextClass.meet_link ? (
              <a
                href={nextClass.meet_link}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn w-full bg-white text-[#1F2A44] py-3 rounded-xl font-semibold hover:bg-[#FAF9F7] hover:scale-105 transition-all flex items-center justify-center space-x-2 shadow-md"
              >
                <Video size={18} />
                <span>{t({ en: "Join class", es: "Unirse a la clase" })}</span>
                <ArrowRight
                  size={16}
                  className="group-hover/btn:translate-x-1 transition-transform"
                />
              </a>
            ) : (
              <div className="w-full bg-white/50 text-[#1F2A44]/70 py-3 rounded-xl font-medium text-center text-sm">
                {t({ en: "Meet link will appear before class", es: "El enlace de Meet aparecerá antes de la clase" })}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/30 rounded-2xl mb-4">
              <Calendar size={32} className="text-[#1F2A44]" />
            </div>
            <p className="text-[#1F2A44]/80 font-medium mb-4 leading-relaxed">
              {t({ en: "Your next class will appear here ✨", es: "Tu próxima clase aparecerá aquí ✨" })}
            </p>
            <button
              onClick={onBookClass}
              className="group/btn inline-flex items-center space-x-2 bg-white text-[#1F2A44] px-6 py-3 rounded-xl font-semibold hover:bg-[#FAF9F7] hover:scale-105 transition-all shadow-md"
            >
              <Calendar size={18} />
              <span>{t({ en: "Book a class", es: "Reservar clase" })}</span>
              <ArrowRight
                size={16}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
