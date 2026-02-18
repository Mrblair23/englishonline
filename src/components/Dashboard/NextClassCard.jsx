import { Video, Clock, Calendar, ArrowRight } from "lucide-react";

export function NextClassCard({ hasUpcomingClass, onBookClass }) {
  return (
    <div className="group bg-gradient-to-br from-[#F2B705] to-[#f5c642] rounded-2xl p-8 text-[#1F2A44] shadow-lg relative overflow-hidden hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Video className="text-[#1F2A44]" size={24} />
          </div>
          <div>
            <h3 className="font-poppins text-lg font-semibold leading-tight">
              Next class
            </h3>
            <p className="text-[#1F2A44]/70 text-sm leading-relaxed">
              Coming up soon
            </p>
          </div>
        </div>

        {hasUpcomingClass ? (
          <>
            <div className="mb-6">
              <h4 className="font-poppins text-xl font-semibold mb-2 leading-tight">
                Business English 101
              </h4>
              <div className="flex items-center space-x-2 text-[#1F2A44]/70">
                <Clock size={16} />
                <span className="text-sm leading-relaxed">
                  Today at 4:00 PM (in 2 hours)
                </span>
              </div>
            </div>
            <button className="group/btn w-full bg-white text-[#1F2A44] py-3 rounded-xl font-semibold hover:bg-[#FAF9F7] hover:scale-105 transition-all flex items-center justify-center space-x-2 shadow-md">
              <Video size={18} />
              <span>Join Zoom class</span>
              <ArrowRight
                size={16}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/30 rounded-2xl mb-4">
              <Calendar size={32} className="text-[#1F2A44]" />
            </div>
            <p className="text-[#1F2A44]/80 font-medium mb-4 leading-relaxed">
              Your next class will appear here ✨
            </p>
            <button
              onClick={onBookClass}
              className="group/btn inline-flex items-center space-x-2 bg-white text-[#1F2A44] px-6 py-3 rounded-xl font-semibold hover:bg-[#FAF9F7] hover:scale-105 transition-all shadow-md"
            >
              <Calendar size={18} />
              <span>Book a class</span>
              <ArrowRight
                size={16}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
