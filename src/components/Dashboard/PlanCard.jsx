import { Star, TrendingUp, Zap } from "lucide-react";
import useUser from "@/utils/useUser";

export function PlanCard() {
  const { data: user } = useUser();

  const isActive = user?.subscription_status === "active";
  const isPending = user?.subscription_status === "pending_manual_activation";
  const planKey = user?.subscription_plan_key;

  // Active subscription view
  if (isActive) {
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
          <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold mb-4">
            <Star size={16} className="mr-2" fill="currentColor" />
            {planKey
              ? planKey.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
              : "Active Plan"}
          </div>
          {user?.subscription_expires_at && (
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-semibold">Renews:</span>{" "}
              {new Date(user.subscription_expires_at).toLocaleDateString()}
            </p>
          )}
        </div>
        <a
          href="/choose-plan"
          className="w-full bg-gradient-to-r from-[#3FA9A6] to-[#2d8a87] hover:brightness-110 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 hover:scale-105 shadow-md"
        >
          <TrendingUp size={18} />
          <span>Change plan</span>
        </a>
      </div>
    );
  }

  // Pending activation view
  if (isPending) {
    return (
      <div className="group bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-8 border border-blue-200/50 shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Star className="text-blue-500" size={24} />
            </div>
            <div>
              <h3 className="font-poppins text-lg font-semibold text-[#1F2A44] leading-tight">
                My plan
              </h3>
              <p className="text-sm text-blue-500 leading-relaxed">
                Awaiting confirmation
              </p>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold">
            ⏳ Payment under review
          </div>
        </div>
        <p className="text-sm text-gray-500">
          We're reviewing your payment. You'll be notified once your plan is activated.
        </p>
      </div>
    );
  }

  // Inactive / no subscription — CTA to choose a plan
  return (
    <div className="group bg-gradient-to-br from-white to-[#3FA9A6]/5 rounded-2xl p-8 border border-[#3FA9A6]/20 shadow-sm hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#3FA9A6]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap className="text-[#3FA9A6]" size={24} />
          </div>
          <div>
            <h3 className="font-poppins text-lg font-semibold text-[#1F2A44] leading-tight">
              Get started
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              No active plan
            </p>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <p className="text-sm text-gray-600 leading-relaxed">
          Choose a plan to start your English learning journey.
          Flexible plans designed for you.
        </p>
      </div>
      <a
        href="/choose-plan"
        className="w-full bg-gradient-to-r from-[#3FA9A6] to-[#2d8a87] hover:brightness-110 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 hover:scale-105 shadow-md"
      >
        <Zap size={18} />
        <span>Choose a plan</span>
      </a>
    </div>
  );
}
