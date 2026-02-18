import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { TimeSlotCard } from "./TimeSlotCard";

export function CalendarView({
  calendarDays,
  selectedDate,
  setSelectedDate,
  getSlotsForDay,
  handleSlotSelection,
  clearAllFilters,
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
    <>
      {/* Calendar Days Selector */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
          Select a Date
        </h3>
        <div className="grid grid-cols-7 gap-2 md:gap-3">
          {calendarDays.map((day) => (
            <button
              key={day.dateStr}
              onClick={() => setSelectedDate(day)}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${
                selectedDate?.dateStr === day.dateStr
                  ? "bg-[#1e3a8a] text-white shadow-lg scale-105"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-xs font-bold uppercase mb-1">
                {day.dayName}
              </span>
              <span className="text-lg md:text-2xl font-black">
                {day.dayNum}
              </span>
              <span className="text-xs text-gray-500 mt-1">{day.month}</span>
            </button>
          ))}
        </div>
        {calendarDays.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No available classes to display.
          </div>
        )}
      </div>

      {/* Available Slots for Selected Date */}
      {selectedDate && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Available on {selectedDate.dayName}, {selectedDate.month}{" "}
              {selectedDate.dayNum}
            </h3>
            <span className="text-sm text-gray-500">
              {getSlotsForDay(selectedDate).length} slots available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {getSlotsForDay(selectedDate).map((slot) => (
              <TimeSlotCard
                key={slot.id}
                slot={slot}
                onBook={() => handleSlotSelection(slot, selectedDate)}
                canBook={canBook}
              />
            ))}
          </div>

          {getSlotsForDay(selectedDate).length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 font-medium">
                No available classes for this date.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 text-[#1e3a8a] font-semibold hover:underline"
              >
                Clear filters to see all classes
              </button>
            </div>
          )}
        </div>
      )}

      {!selectedDate && (
        <div className="text-center py-20">
          <CalendarIcon className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-medium">
            Select a date above to view available time slots
          </p>
        </div>
      )}
    </>
  );
}
