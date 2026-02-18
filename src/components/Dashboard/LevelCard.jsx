import { Award, TrendingUp, BookOpen } from "lucide-react";

export function LevelCard() {
  return (
    <div className="group bg-gradient-to-br from-white to-[#FAF9F7] rounded-2xl p-8 border border-gray-200/50 shadow-sm hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Award className="text-purple-600" size={24} />
          </div>
          <div>
            <h3 className="font-poppins text-lg font-semibold text-[#1F2A44] leading-tight">
              My level
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Current proficiency
            </p>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#3FA9A6] to-[#2d8a87] text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg">
          <TrendingUp size={20} />
          <span>Intermediate</span>
        </div>
        <p className="text-sm text-gray-600 mt-4 leading-relaxed">
          You're making great progress! Keep up the excellent work.
        </p>
      </div>
      <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 hover:scale-105">
        <BookOpen size={18} />
        <span>Take placement quiz</span>
      </button>
    </div>
  );
}
