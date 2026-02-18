import {
  Mail,
  Calendar as CalendarIcon,
  Video,
  Download,
  ArrowRight,
  Plus,
} from "lucide-react";

export function SuccessActions({ resetBooking }) {
  return (
    <>
      {/* Quick Actions */}
      <div className="bm-card bm-card-pad mb-8">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
          Next Steps
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-8 h-8 bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
              1
            </div>
            <p className="text-gray-700">
              <Mail className="inline mr-1" size={16} />
              Check your email for the Zoom link and calendar invite
            </p>
          </div>
          <div className="flex items-center space-x-3 text-left">
            <div className="w-8 h-8 bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
              2
            </div>
            <p className="text-gray-700">
              <CalendarIcon className="inline mr-1" size={16} />
              Add the event to your calendar (link in email)
            </p>
          </div>
          <div className="flex items-center space-x-3 text-left">
            <div className="w-8 h-8 bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
              3
            </div>
            <p className="text-gray-700">
              <Video className="inline mr-1" size={16} />
              Join 5 minutes early to test your audio/video
            </p>
          </div>
        </div>
      </div>

      {/* Add to Calendar Button (Mock) */}
      <button className="group bm-btn-outline w-full mb-4 py-4 flex items-center justify-center space-x-2">
        <Download
          size={20}
          className="group-hover:scale-110 transition-transform"
        />
        <span>Add to Google Calendar</span>
      </button>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/dashboard"
          className="group bm-btn-outline flex-1 py-4 flex items-center justify-center space-x-2"
        >
          <span>View My Classes</span>
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </a>
        <button
          onClick={resetBooking}
          className="group bm-btn-primary flex-1 py-4 flex items-center justify-center space-x-2"
        >
          <Plus
            size={20}
            className="group-hover:rotate-90 transition-transform"
          />
          <span>Book Another Class</span>
        </button>
      </div>

      {/* Reschedule/Cancel Info */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Need to make changes?</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="text-[#1e3a8a] font-semibold hover:underline text-sm">
            Reschedule Class
          </button>
          <span className="hidden sm:inline text-gray-300">•</span>
          <button className="text-red-600 font-semibold hover:underline text-sm">
            Cancel Booking
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          * Changes must be made at least 24 hours in advance
        </p>
      </div>
    </>
  );
}
