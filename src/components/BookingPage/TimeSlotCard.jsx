import { Clock } from "lucide-react";

export function TimeSlotCard({ slot, onBook, canBook }) {
  return (
    <div className="p-4 rounded-2xl border-2 transition-all text-left border-gray-200 hover:border-[#1e3a8a] hover:bg-blue-50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="text-[#1e3a8a]" size={18} />
          <span className="font-bold text-gray-900">{slot.timeLabel}</span>
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
          {slot.className}
        </span>
      </div>
      <div className="text-xs text-gray-600 space-y-1">
        <p>Teacher: {slot.teacherName}</p>
        <p>Seats available: {slot.seatsAvailable}</p>
      </div>
      {canBook && (
        <button
          onClick={onBook}
          className="mt-4 w-full py-2 bg-[#1e3a8a] text-white rounded-xl font-semibold hover:brightness-110 transition-all"
        >
          Book Class
        </button>
      )}
    </div>
  );
}
