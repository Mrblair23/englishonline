import { Calendar } from "lucide-react";

export function BookTab() {
  return (
    <div className="bg-gradient-to-br from-white to-[#FAF9F7] rounded-2xl p-8 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all">
      <h2 className="font-poppins text-3xl font-semibold text-[#1F2A44] mb-6 leading-tight">
        Book a class
      </h2>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Select a class type and time that works for you.
      </p>
      <a
        href="/book"
        className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:brightness-105 hover:scale-105 transition-all"
      >
        <Calendar size={20} />
        <span>Go to booking page</span>
      </a>
    </div>
  );
}
