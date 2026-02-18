import { Star, TrendingUp } from "lucide-react";

export function PlanCard() {
  return (
    <div className="group bg-gradient-to-br from-white to-[#FAF9F7] rounded-2xl p-8 border border-gray-200/50 shadow-sm hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Star className="text-amber-600" size={24} />
          </div>
          <div>
            <h3 className="font-poppins text-lg font-semibold text-[#1F2A44] leading-tight">
              My plan
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Active subscription
            </p>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="inline-flex items-center bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-semibold mb-4">
          <Star size={16} className="mr-2" fill="currentColor" />
          Professional plan
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          <span className="font-semibold">Renews:</span> March 15, 2026
        </p>
      </div>
      <button className="w-full bg-gradient-to-r from-[#3FA9A6] to-[#2d8a87] hover:brightness-110 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 hover:scale-105 shadow-md">
        <TrendingUp size={18} />
        <span>Upgrade to elite</span>
      </button>
    </div>
  );
}
