import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowRight, Search, Tag } from "lucide-react";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All Posts", icon: "📚" },
    { id: "beginners", name: "Beginners", icon: "🌱" },
    { id: "pronunciation", name: "Pronunciation", icon: "🗣️" },
    { id: "interviews", name: "Interviews", icon: "💼" },
    { id: "travel", name: "Travel", icon: "✈️" },
  ];

  // Mock blog posts with categories
  const posts = [
    {
      id: 1,
      title: "10 Essential English Phrases for Beginners",
      excerpt:
        "Start your English journey with these fundamental phrases that every beginner should know.",
      image_url:
        "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=400&fit=crop",
      published_at: "2026-01-25",
      category: "beginners",
      author: "Be More English Online",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Master the 'TH' Sound: A Native Speaker's Guide",
      excerpt:
        "The 'TH' sound is one of the trickiest for non-native speakers. Here's how to nail it.",
      image_url:
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop",
      published_at: "2026-01-22",
      category: "pronunciation",
      author: "Be More English Online",
      readTime: "7 min read",
    },
    {
      id: 3,
      title: "Ace Your English Job Interview: 15 Common Questions",
      excerpt:
        "Prepare for success with these commonly asked interview questions and perfect answers.",
      image_url:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop",
      published_at: "2026-01-20",
      category: "interviews",
      author: "Be More English Online",
      readTime: "10 min read",
    },
    {
      id: 4,
      title: "English for Travelers: Airport & Hotel Phrases",
      excerpt:
        "Navigate airports and hotels confidently with these essential travel phrases.",
      image_url:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop",
      published_at: "2026-01-18",
      category: "travel",
      author: "Be More English Online",
      readTime: "6 min read",
    },
    {
      id: 5,
      title: "Common Grammar Mistakes and How to Fix Them",
      excerpt:
        "Avoid these common grammar pitfalls that trip up even advanced English learners.",
      image_url:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop",
      published_at: "2026-01-15",
      category: "beginners",
      author: "Be More English Online",
      readTime: "8 min read",
    },
    {
      id: 6,
      title: "Stress and Intonation: Sound More Natural",
      excerpt:
        "Learn the rhythm and melody of English to sound like a native speaker.",
      image_url:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop",
      published_at: "2026-01-12",
      category: "pronunciation",
      author: "Be More English Online",
      readTime: "9 min read",
    },
    {
      id: 7,
      title: "How to Introduce Yourself in a Professional Setting",
      excerpt:
        "Make a great first impression with these professional introduction techniques.",
      image_url:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop",
      published_at: "2026-01-10",
      category: "interviews",
      author: "Be More English Online",
      readTime: "5 min read",
    },
    {
      id: 8,
      title: "Ordering Food in English: Restaurant Survival Guide",
      excerpt:
        "Never struggle at a restaurant again with these essential ordering phrases.",
      image_url:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop",
      published_at: "2026-01-08",
      category: "travel",
      author: "Be More English Online",
      readTime: "6 min read",
    },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bm-page-bg">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1e3a8a] to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Be More English Online Blog
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Free tips, guides, and insights to help you master English faster
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:border-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-2 py-4 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? "bg-[#1e3a8a] text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                {selectedCategory === category.id && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {category.id === "all"
                      ? posts.length
                      : posts.filter((p) => p.category === category.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog posts */}
      <main className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">
                No articles found. Try a different category or search term.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-gray-600">
                  Showing <strong>{filteredPosts.length}</strong>{" "}
                  {filteredPosts.length === 1 ? "article" : "articles"}
                  {selectedCategory !== "all" && (
                    <span>
                      {" "}
                      in{" "}
                      <strong>
                        {
                          categories.find((c) => c.id === selectedCategory)
                            ?.name
                        }
                      </strong>
                    </span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bm-card overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                  >
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold">
                          <Tag size={12} />
                          {categories.find((c) => c.id === post.category)?.name}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#1e3a8a] transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {post.author}
                          </span>
                        </div>
                        <button className="text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                          Read More
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
