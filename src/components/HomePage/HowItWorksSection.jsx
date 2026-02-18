import { CheckCircle2, Calendar, TrendingUp, Lightbulb } from "lucide-react";

const steps = [
  {
    step: "1",
    title: "Choose your plan",
    desc: "Pick the perfect tier for your goals—from casual learning to intensive preparation.",
    icon: <CheckCircle2 size={40} className="text-[#3FA9A6]" />,
  },
  {
    step: "2",
    title: "Schedule classes",
    desc: "Book sessions that fit your schedule. Flexible timing, recorded for review.",
    icon: <Calendar size={40} className="text-[#3FA9A6]" />,
  },
  {
    step: "3",
    title: "Improve weekly",
    desc: "Track progress, get personalized feedback, and watch your confidence soar.",
    icon: <TrendingUp size={40} className="text-[#3FA9A6]" />,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-[#FAF9F7] relative">
      {/* Warm notebook paper texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #1F2A44, #1F2A44 1px, transparent 1px, transparent 30px)`,
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Lightbulb size={24} className="text-[#F2B705]" />
          </div>
          <h2 className="font-poppins text-4xl md:text-5xl font-semibold text-[#1F2A44] mb-4 leading-tight">
            How it works
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Simple, effective, proven.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((item, i) => (
            <div key={i} className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-md mb-6 group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-[#3FA9A6]/20">
                {item.icon}
              </div>
              <div className="inline-block bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] font-semibold text-xs px-3 py-1 rounded-xl mb-4 shadow-sm uppercase tracking-wide">
                Step {item.step}
              </div>
              <h3 className="font-poppins text-2xl font-semibold text-[#1F2A44] mb-3 group-hover:text-[#3FA9A6] transition-colors leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
