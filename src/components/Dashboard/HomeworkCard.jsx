import { BookOpen, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { useLanguage } from "@/utils/useLanguage";

export function HomeworkCard({ homework, onToggleHomework, completedCount }) {
  const { language } = useLanguage();
  const t = (translations) => translations[language] || translations.en;

  return (
    <div className="group bg-gradient-to-br from-white to-[#FAF9F7] rounded-2xl p-8 border border-gray-200/50 shadow-sm hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen className="text-green-600" size={24} />
          </div>
          <div>
            <h3 className="font-poppins text-lg font-semibold text-[#1F2A44] leading-tight">
              {t({ en: "Homework this week", es: "Tarea de la semana" })}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {completedCount} {t({ en: "of", es: "de" })} {homework.length} {t({ en: "completed", es: "completadas" })}
            </p>
          </div>
        </div>
      </div>

      {homework.length > 0 ? (
        <>
          <div className="space-y-3 mb-4">
            {homework.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleHomework(item.id)}
                className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white cursor-pointer transition-all group/item"
              >
                {item.completed ? (
                  <CheckCircle2
                    className="text-green-600 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform"
                    size={20}
                  />
                ) : (
                  <Circle
                    className="text-gray-300 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform"
                    size={20}
                  />
                )}
                <span
                  className={`text-sm leading-relaxed ${item.completed ? "text-gray-400 line-through" : "text-gray-700 font-medium"}`}
                >
                  {item.title}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all duration-500"
              style={{
                width: `${(completedCount / homework.length) * 100}%`,
              }}
            ></div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-2xl mb-4">
            <Sparkles size={32} className="text-green-600" />
          </div>
          <p className="text-gray-500 font-medium leading-relaxed">
            {t({ en: "No homework yet — enjoy your free time! 🎉", es: "Sin tarea aún — ¡disfruta tu tiempo libre! 🎉" })}
          </p>
        </div>
      )}
    </div>
  );
}
