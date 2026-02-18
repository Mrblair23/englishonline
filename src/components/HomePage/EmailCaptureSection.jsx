import { Download, Mail, CheckCircle2 } from "lucide-react";

export function EmailCaptureSection({
  email,
  setEmail,
  submitted,
  handleEmailSubmit,
}) {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Warm study desk ambiance */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F5F1E8]/30 to-white"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-[#3FA9A6]/10 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-[#F2B705]/10 to-[#f5c642]/10 rounded-2xl p-10 md:p-16 border border-[#F2B705]/20 shadow-lg text-center backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#F2B705] to-[#f5c642] rounded-2xl mb-6 shadow-md hover:scale-110 hover:rotate-6 transition-all duration-300">
            <Download size={40} className="text-[#1F2A44]" />
          </div>
          <h2 className="font-poppins text-3xl md:text-4xl font-semibold text-[#1F2A44] mb-4 leading-tight">
            Free download: 10 phrases to speak like a native today
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get instant access to our exclusive PDF guide. Start improving your
            English in the next 5 minutes.
          </p>

          {!submitted ? (
            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-lg mx-auto"
            >
              <div className="relative w-full sm:flex-1">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300 focus:border-[#3FA9A6] focus:outline-none text-[#1F2A44] font-medium bg-white shadow-sm focus:shadow-md transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] rounded-xl font-semibold hover:shadow-lg hover:brightness-105 hover:scale-105 transition-all whitespace-nowrap shadow-md"
              >
                Get free PDF
              </button>
            </form>
          ) : (
            <div className="bg-[#3FA9A6]/10 border-2 border-[#3FA9A6]/30 rounded-2xl p-6 max-w-lg mx-auto">
              <CheckCircle2
                className="inline-block text-[#3FA9A6] mb-2"
                size={40}
              />
              <p className="text-[#1F2A44] font-semibold text-lg leading-relaxed">
                Success! Check your email for the PDF.
              </p>
            </div>
          )}

          <p className="text-sm text-gray-500 mt-4 leading-relaxed">
            ✓ No spam, ever • ✓ Unsubscribe anytime
          </p>
        </div>
      </div>
    </section>
  );
}
