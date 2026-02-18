import { CheckCircle2 } from "lucide-react";
import { SuccessActions } from "./SuccessActions";

export function BookingStep3({ selectedSlot, resetBooking }) {
  const slotYear = new Date(selectedSlot.startTime).getFullYear();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-xl text-center relative overflow-hidden">
        {/* Decorative confetti elements */}
        <div className="absolute top-10 left-10 text-4xl animate-bounce">
          🎉
        </div>
        <div className="absolute top-20 right-10 text-3xl animate-pulse">
          ✨
        </div>
        <div
          className="absolute bottom-20 left-20 text-3xl animate-bounce"
          style={{ animationDelay: "0.2s" }}
        >
          🌟
        </div>
        <div
          className="absolute bottom-10 right-20 text-4xl animate-pulse"
          style={{ animationDelay: "0.4s" }}
        >
          🎊
        </div>

        <div className="relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle2 size={48} strokeWidth={3} />
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Your class has been booked!
          </h2>
          <p className="text-lg text-gray-600 mb-3">
            Your booking is confirmed for{" "}
            <span className="font-bold text-[#3FA9A6]">
              {selectedSlot.dayName}, {selectedSlot.month}{" "}
              {selectedSlot.dayNum}, {slotYear}
            </span>{" "}
            at{" "}
            <span className="font-bold text-[#3FA9A6]">
              {selectedSlot.timeLabel}
            </span>
          </p>
          <p className="text-[#1e3a8a] font-semibold mb-8">
            We can't wait to see you in class! 🚀
          </p>

          <SuccessActions resetBooking={resetBooking} />
        </div>
      </div>
    </div>
  );
}
