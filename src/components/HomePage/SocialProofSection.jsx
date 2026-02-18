import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Maria S.",
    role: "Software Engineer, Google",
    text: "The native speakers helped me nail my tech interviews. I got 3 offers in Silicon Valley!",
    rating: 5,
  },
  {
    name: "Carlos R.",
    role: "MBA Student, Harvard",
    text: "From struggling with presentations to leading class discussions. Game changer.",
    rating: 5,
  },
  {
    name: "Yuki T.",
    role: "Marketing Director, Tokyo",
    text: "Finally confident in client calls. My pronunciation improved dramatically in 3 months.",
    rating: 5,
  },
  {
    name: "Ahmed K.",
    role: "Medical Resident, Dubai",
    text: "Passed my medical board exam thanks to the focused teaching approach. Highly recommend!",
    rating: 5,
  },
];

export function SocialProofSection() {
  return (
    <section className="py-16 bg-white border-y border-gray-200/50 relative">
      {/* Subtle warm background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF9F7]/30 to-white"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-poppins text-3xl md:text-4xl font-semibold text-[#1F2A44] mb-3 leading-tight">
            Trusted by professionals worldwide
          </h2>
          <div className="flex items-center justify-center space-x-1 text-[#F2B705]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} fill="currentColor" />
            ))}
            <span className="ml-2 text-gray-600 font-medium">
              4.9/5 from 500+ students
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="group bg-gradient-to-br from-white to-[#FAF9F7] p-6 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center space-x-1 text-[#F2B705] mb-3">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed italic">
                "{testimonial.text}"
              </p>
              <div>
                <p className="font-semibold text-[#1F2A44] text-sm">
                  {testimonial.name}
                </p>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curved separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 0L60 8C120 16 240 32 360 37.3C480 43 600 37 720 34.7C840 32 960 32 1080 37.3C1200 43 1320 53 1380 58.7L1440 64V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V0Z"
            fill="#FAF9F7"
          />
        </svg>
      </div>
    </section>
  );
}
