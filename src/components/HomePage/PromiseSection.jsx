import { MessageCircle, Award, TrendingUp } from "lucide-react";

const promises = [
  {
    icon: <MessageCircle size={32} />,
    title: "Confidence",
    desc: "Speak without fear in any situation",
  },
  {
    icon: <Award size={32} />,
    title: "Pronunciation",
    desc: "Sound natural and professional",
  },
  {
    icon: <TrendingUp size={32} />,
    title: "Interviews",
    desc: "Land your dream job with perfect English",
  },
  {
    icon: "✈️",
    title: "Travel",
    desc: "Navigate the world confidently",
  },
  {
    icon: "🎓",
    title: "School",
    desc: "Excel in academic settings",
  },
];

export function PromiseSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#1F2A44] to-[#2B3448] text-white relative overflow-hidden">
      {/* Book texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23fff' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Warm ambient glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#3FA9A6]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F2B705]/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#F2B705]/5 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-poppins text-4xl md:text-5xl font-semibold mb-6 leading-tight">
            Our promise
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Real results that transform your life, career, and confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {promises.map((item, i) => (
            <div key={i} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 text-4xl backdrop-blur-sm border border-white/10 group-hover:bg-white/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                {typeof item.icon === "string" ? item.icon : item.icon}
              </div>
              <h3 className="font-poppins text-xl font-semibold mb-2 group-hover:text-[#F2B705] transition-colors leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Curved separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 50C240 80 480 100 720 100C960 100 1200 80 1440 50V100H0V50Z"
            fill="#FAF9F7"
          />
        </svg>
      </div>
    </section>
  );
}
