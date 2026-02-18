import { FiltersSidebar } from "./FiltersSidebar";
import { ViewToggle } from "./ViewToggle";
import { CalendarView } from "./CalendarView";
import { ListView } from "./ListView";

export function BookingStep1({
  filters,
  calendarDays,
  selectedDate,
  setSelectedDate,
  getSlotsForDay,
  handleSlotSelection,
  canBook,
  isLoading,
  errorMessage,
}) {
  const { viewMode, setViewMode, timezone, clearAllFilters } = filters;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1">
        <FiltersSidebar filters={filters} />
      </div>

      {/* Calendar & Slots */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <ViewToggle
            viewMode={viewMode}
            setViewMode={setViewMode}
            timezone={timezone}
          />

          {/* Calendar View */}
          {viewMode === "calendar" && (
            <CalendarView
              calendarDays={calendarDays}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              getSlotsForDay={getSlotsForDay}
              handleSlotSelection={handleSlotSelection}
              clearAllFilters={clearAllFilters}
              canBook={canBook}
              isLoading={isLoading}
              errorMessage={errorMessage}
            />
          )}

          {/* List View */}
          {viewMode === "list" && (
            <ListView
              calendarDays={calendarDays}
              getSlotsForDay={getSlotsForDay}
              handleSlotSelection={handleSlotSelection}
              canBook={canBook}
              isLoading={isLoading}
              errorMessage={errorMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
