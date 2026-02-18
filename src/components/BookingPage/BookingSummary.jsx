import { Calendar as CalendarIcon, Video, User } from "lucide-react";

export function BookingSummary({ selectedSlot, timezone }) {
  const slotYear = new Date(selectedSlot.startTime).getFullYear();

  return (
    <div className="bm-card bm-card-pad mb-8 space-y-6">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#1e3a8a] flex-shrink-0">
          <User size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-1">
            {selectedSlot.className}
          </h4>
          <p className="text-sm text-gray-600">
            Teacher: {selectedSlot.teacherName}
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#1e3a8a] flex-shrink-0">
          <CalendarIcon size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-1">
            {selectedSlot.dayName}, {selectedSlot.month} {selectedSlot.dayNum},
            {slotYear}
          </h4>
          <p className="text-sm text-gray-600">
            {selectedSlot.timeLabel} ({timezone})
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#1e3a8a] flex-shrink-0">
          <Video size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-1">Online via Zoom</h4>
          <p className="text-sm text-gray-600">
            Meeting link will be sent to your email
          </p>
        </div>
      </div>
    </div>
  );
}
