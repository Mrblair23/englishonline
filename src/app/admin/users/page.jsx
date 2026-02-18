import { useState, useEffect } from "react";
import useAdmin from "@/utils/useAdmin";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Search, Shield, Mail, Calendar } from "lucide-react";

export default function AdminUsersPage() {
  const { isAdmin, loading } = useAdmin();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      window.location.href = "/account/signin";
    }
  }, [isAdmin, loading]);

  // Fetch users (you'll need to create this API endpoint)
  useEffect(() => {
    if (isAdmin) {
      // For now, just show empty state
      setLoadingUsers(false);
    }
  }, [isAdmin]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bm-page-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#3FA9A6]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bm-page-bg overflow-x-hidden">
      <Header />

      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                User Management
              </h1>
            </div>
            <p className="text-gray-600 ml-13">
              View and manage all student accounts
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bm-input w-full pl-12 pr-4"
              />
            </div>
          </div>

          {/* Users Table/List */}
          <div className="bm-table-card overflow-hidden">
            {loadingUsers ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3FA9A6] mx-auto"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Users size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-gray-500 text-sm">
                  Users will appear here once they sign up for the platform
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-[#3FA9A6] rounded-full flex items-center justify-center text-white font-semibold">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === "admin"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role || "user"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
