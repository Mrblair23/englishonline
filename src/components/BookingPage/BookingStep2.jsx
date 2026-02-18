import { ArrowRight, AlertCircle } from "lucide-react";
import { BookingSummary } from "./BookingSummary";

export function BookingStep2({
  selectedSlot,
  timezone,
  setStep,
  handleBooking,
  isSubmitting,
  studentName,
  studentEmail,
  setStudentName,
  setStudentEmail,
  bookingError,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-xl">
        <button
          onClick={() => setStep(1)}
          className="text-gray-400 hover:text-gray-900 mb-6 font-medium flex items-center space-x-1"
        >
          <ArrowRight size={18} className="rotate-180" />
          <span>Back to Calendar</span>
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Confirm Your Booking
        </h2>

        {/* Booking Summary */}
        <BookingSummary selectedSlot={selectedSlot} timezone={timezone} />

        {/* Student Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
          <h4 className="font-bold text-gray-900 mb-4">Student Details</h4>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">
                Student Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">
                Student Email
              </label>
              <input
                type="email"
                value={studentEmail}
                onChange={(event) => setStudentEmail(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
              />
            </div>
          </div>
        </div>

        {/* Important Info */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle
              className="text-blue-600 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div className="flex-1">
              <h4 className="font-bold text-blue-900 mb-2">Before you book</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• You can reschedule up to 24 hours before class</li>
                <li>• Cancellations within 24 hours are non-refundable</li>
                <li>• Please join 5 minutes early to test your connection</li>
              </ul>
            </div>
          </div>
        </div>

        {bookingError && (
          <div className="mb-6 text-sm text-red-600 font-medium">
            {bookingError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setStep(1)}
            className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleBooking}
            className="flex-1 py-4 bg-[#1e3a8a] text-white rounded-2xl font-bold hover:brightness-110 shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Confirming..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
