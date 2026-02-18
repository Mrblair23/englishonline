import { Clock } from "lucide-react";

export function ListView({
  calendarDays,
  getSlotsForDay,
  handleSlotSelection,
  canBook,
  isLoading,
  errorMessage,
}) {
  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading available classes...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="text-center py-12 text-red-600 font-medium">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {calendarDays.map((day) => {
        const slots = getSlotsForDay(day);
        if (slots.length === 0) return null;

        return (
          <div
            key={day.dateStr}
            className="border-b border-gray-100 pb-6 last:border-0"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {day.dayName}, {day.month} {day.dayNum}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {slots.map((slot, i) => (
                <div
                  key={slot.id || i}
                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-[#1e3a8a] hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="text-[#1e3a8a]" size={16} />
                      <span className="font-bold text-gray-900 text-sm">
                        {slot.timeLabel}
                      </span>
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
                      onClick={() => handleSlotSelection(slot, day)}
                      className="mt-4 w-full py-2 bg-[#1e3a8a] text-white rounded-xl font-semibold hover:brightness-110 transition-all"
                    >
                      Book Class
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {calendarDays.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No available classes at the moment.
        </div>
      )}
    </div>
  );
}
