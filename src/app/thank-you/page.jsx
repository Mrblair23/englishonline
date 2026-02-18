import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  CheckCircle2,
  Download,
  Mail,
  ArrowRight,
  BookOpen,
  Calendar,
  Star,
} from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bm-page-bg">
      <Header />

      <main className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success card */}
          <div className="bm-card bm-card-elevated p-8 md:p-12 text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-green-600" size={48} />
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Success! Check Your Email 📧
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your free guide <strong>"Speak English in 7 Days"</strong> is on
              its way to your inbox right now!
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 max-w-2xl mx-auto mb-8">
              <div className="flex items-start gap-4">
                <Mail className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <div className="text-left">
                  <h3 className="font-bold text-gray-900 mb-2">
                    What to do next:
                  </h3>
                  <ol className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-600">1.</span>
                      <span>
                        Check your email inbox (and spam folder, just in case!)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-600">2.</span>
                      <span>Download your free PDF guide</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-600">3.</span>
                      <span>
                        Start practicing the 50 essential phrases today!
                      </span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
              <CheckCircle2 size={18} />
              <span className="font-semibold text-sm">
                You're now on the path to fluency!
              </span>
            </div>
          </div>

          {/* What's included reminder */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Download className="text-amber-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                What's Inside Your Guide
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
                <CheckCircle2
                  className="text-blue-600 flex-shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    50 Essential Phrases
                  </h4>
                  <p className="text-sm text-gray-600">
                    The exact phrases native speakers use every day
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100">
                <CheckCircle2
                  className="text-green-600 flex-shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    Pronunciation Secrets
                  </h4>
                  <p className="text-sm text-gray-600">
                    Sound natural with our proven techniques
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100">
                <CheckCircle2
                  className="text-purple-600 flex-shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    7-Day Schedule
                  </h4>
                  <p className="text-sm text-gray-600">
                    Step-by-step practice plan for rapid progress
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100">
                <CheckCircle2
                  className="text-orange-600 flex-shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    Audio Examples
                  </h4>
                  <p className="text-sm text-gray-600">
                    Hear the correct pronunciation from a native
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next steps CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-[#1e3a8a] to-blue-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <Calendar className="mb-4" size={32} />
                <h3 className="text-2xl font-bold mb-3">
                  Ready to accelerate your learning?
                </h3>
                <p className="text-blue-100 mb-6">
                  Book a 1-on-1 trial class with a native speaker and get
                  personalized feedback
                </p>
                <a
                  href="/book"
                  className="inline-flex items-center gap-2 bg-white text-[#1e3a8a] px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-all"
                >
                  Book Your Trial Class
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <BookOpen className="mb-4" size={32} />
                <h3 className="text-2xl font-bold mb-3">
                  Want more free content?
                </h3>
                <p className="text-amber-100 mb-6">
                  Browse our blog for tips on pronunciation, interviews, and
                  travel English
                </p>
                <a
                  href="/blog"
                  className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-all"
                >
                  Read the Blog
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} fill="currentColor" />
              ))}
            </div>
            <p className="text-lg text-gray-700 italic mb-4">
              "This free guide gave me more confidence in just one week than I
              gained in years of traditional study. The method really works!"
            </p>
            <p className="font-bold text-gray-900">
              — Maria S., Software Engineer
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
