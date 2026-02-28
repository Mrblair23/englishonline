import { Briefcase, GraduationCap, Plane, Mic, BookOpen } from "lucide-react";

export function PromiseSection({ t }) {
  const goals = [
    { icon: <Briefcase size={24} />, label: t({ en: "Job Interviews", es: "Entrevistas de Trabajo" }) },
    { icon: <Mic size={24} />, label: t({ en: "Presentations", es: "Presentaciones" }) },
    { icon: <GraduationCap size={24} />, label: t({ en: "University Exams", es: "Exámenes Universitarios" }) },
    { icon: <Plane size={24} />, label: t({ en: "Travel Confidently", es: "Viajar con Confianza" }) },
    { icon: <BookOpen size={24} />, label: t({ en: "Daily Conversations", es: "Conversaciones Diarias" }) },
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1F2A44] via-[#1a3050] to-[#162030]" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-[#3FA9A6]/15 via-transparent to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block bg-white/10 text-[#3FA9A6] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
          {t({ en: "Our Promise", es: "Nuestra Promesa" })}
        </span>
        <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-white mb-3">
          {t({
            en: "English That Opens Doors",
            es: "Inglés que Abre Puertas",
          })}
        </h2>
        <p className="text-white/60 max-w-xl mx-auto mb-10">
          {t({
            en: "Whether it's for work, school, or travel — we prepare you for real-world English.",
            es: "Ya sea para trabajo, estudio o viaje — te preparamos para el inglés del mundo real.",
          })}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {goals.map((g, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-3 hover:bg-white/15 transition-colors"
            >
              <span className="text-[#F2B705]">{g.icon}</span>
              <span className="text-white font-semibold text-sm">{g.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
