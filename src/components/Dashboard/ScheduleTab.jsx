import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/utils/useLanguage";

export function ScheduleTab() {
  const { language } = useLanguage();
  const t = (translations) => translations[language] || translations.en;
  const classes = [
    {
      title: "Business English 101",
      date: "Today at 4:00 PM",
      type: "Group",
    },
    {
      title: "1-on-1 Grammar focus",
      date: "Tomorrow at 10:00 AM",
      type: "Private",
    },
    {
      title: "Conversation practice",
      date: "Feb 2 at 2:00 PM",
      type: "Group",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-white to-[#FAF9F7] rounded-2xl p-8 border border-gray-200/50 shadow-lg">
      <h2 className="font-poppins text-3xl font-semibold text-[#1F2A44] mb-6 leading-tight">
        {t({ en: "My schedule", es: "Mi horario" })}
      </h2>
      <div className="space-y-4">
        {classes.map((cls, i) => (
          <div
            key={i}
            className="group flex items-center justify-between p-6 bg-white rounded-xl border border-gray-200/50 hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300"
          >
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-xs font-semibold text-[#3FA9A6] uppercase tracking-wider bg-[#3FA9A6]/10 px-3 py-1 rounded-xl">
                  {cls.type}
                </span>
              </div>
              <h3 className="font-poppins font-semibold text-[#1F2A44] text-lg group-hover:text-[#3FA9A6] transition-colors leading-tight">
                {cls.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {cls.date}
              </p>
            </div>
            <button className="group/btn bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] px-6 py-2 rounded-xl font-medium hover:brightness-105 hover:scale-105 transition-all shadow-md flex items-center space-x-2">
              <span>{t({ en: "Join", es: "Unirse" })}</span>
              <ArrowRight
                size={16}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
