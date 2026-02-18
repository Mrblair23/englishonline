import { Star, TrendingUp } from "lucide-react";

export function PaymentsTab() {
  return (
    <div className="bg-gradient-to-br from-white to-[#FAF9F7] rounded-2xl p-8 border border-gray-200/50 shadow-lg">
      <h2 className="font-poppins text-3xl font-semibold text-[#1F2A44] mb-6 leading-tight">
        Payments & plan
      </h2>
      <div className="mb-8">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#3FA9A6] to-[#2d8a87] rounded-xl text-white mb-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
          <div>
            <h3 className="font-poppins text-lg font-semibold mb-1 leading-tight">
              Professional plan
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              $99/month • Renews March 15, 2026
            </p>
          </div>
          <Star size={32} fill="currentColor" />
        </div>
        <a
          href="/pricing"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:brightness-105 hover:scale-105 transition-all"
        >
          <TrendingUp size={20} />
          <span>Upgrade or change plan</span>
        </a>
      </div>
    </div>
  );
}
