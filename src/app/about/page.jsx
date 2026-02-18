import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bm-page-bg">
      <Header />

      {/* Story Section */}
      <section className="py-24 px-4 bm-page-bg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-8 leading-tight">
              Mastering English is a{" "}
              <span className="text-[#1e3a8a]">Journey</span>, not a
              destination.
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Founded in 2011, our academy was built on a simple philosophy:
              English should be taught as a tool for connection, not just a set
              of rules.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed">
              We've helped over 5,000 professionals from tech, finance, and the
              arts find their unique voice in the English-speaking world.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square bg-blue-50 rounded-[3rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=compress&cs=tinysrgb&w=800&q=80"
                alt="Native Speaker Teaching"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hidden md:block">
              <div className="text-4xl font-black text-[#1e3a8a] mb-1">15+</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Years Experience
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">Our Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 italic">
                01. Immersion First
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We focus on natural communication patterns before technical
                jargon. You learn to think in English from day one.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 italic">
                02. Contextual Learning
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Grammar is taught within the context of your real-world
                professional and personal life.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 italic">
                03. Psychological Safety
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Mistakes are the building blocks of mastery. We create a safe
                space for you to experiment and fail forward.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 italic">
                04. Lifelong Support
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our graduates remain part of our elite alumni network, with
                ongoing access to resources and events.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
