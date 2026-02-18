import { useState, useEffect, useCallback } from "react";
import useAdmin from "@/utils/useAdmin";
import AdminLayout from "@/components/AdminLayout";
import { apiFetch } from "@/utils/apiClient";
import { UserSquare, Plus, Mail, Calendar, Edit, BookOpen } from "lucide-react";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}

export default function AdminTeachersPage() {
  const { isAdmin, loading } = useAdmin();
  const [teachers, setTeachers] = useState([]);
  const [classSessions, setClassSessions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      window.location.href = "/account/signin";
    }
  }, [isAdmin, loading]);

  const fetchData = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingData(true);
    setError(null);
    try {
      const [teacherRes, sessionRes] = await Promise.all([
        apiFetch("/admin/teachers"),
        apiFetch("/admin/class-sessions"),
      ]);

      if (!teacherRes.ok) {
        throw new Error("Failed to load teachers");
      }
      if (!sessionRes.ok) {
        throw new Error("Failed to load class sessions");
      }

      const teacherPayload = await teacherRes.json();
      const teacherList = Array.isArray(teacherPayload)
        ? teacherPayload
        : teacherPayload?.teachers || [];
      setTeachers(teacherList);

      const sessionPayload = await sessionRes.json();
      setClassSessions(sessionPayload.sessions || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Unable to load teachers right now. Please refresh.");
      setTeachers([]);
      setClassSessions([]);
    } finally {
      setLoadingData(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createTeacher = async (formData) => {
    try {
      const availability = formData.get("availability")?.toString().trim();
      const response = await apiFetch("/admin/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          bio: availability || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create teacher");
      }

      setShowCreateModal(false);
      fetchData();
    } catch (error) {
      console.error("Error creating teacher:", error);
      alert(error.message || "Failed to create teacher. Please try again.");
    }
  };

  const updateTeacher = async (id, updates) => {
    try {
      const payload = {};
      if (typeof updates.name === "string" && updates.name.trim().length > 0) {
        payload.name = updates.name.trim();
      }
      if (typeof updates.bio === "string") {
        payload.bio = updates.bio.trim();
      }
      if (typeof updates.isActive === "boolean") {
        payload.isActive = updates.isActive;
      }
      if (Object.keys(payload).length === 0) {
        setEditingTeacher(null);
        return;
      }

      const response = await apiFetch(`/admin/teachers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update teacher");

      setEditingTeacher(null);
      fetchData();
    } catch (error) {
      console.error("Error updating teacher:", error);
      alert("Failed to update teacher. Please try again.");
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bm-page-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#3FA9A6]"></div>
      </div>
    );
  }

  const getTeacherClasses = (teacherId) => {
    return classSessions.filter((session) => session.teacherId === teacherId);
  };

  return (
    <AdminLayout currentPage="teachers">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Teacher Management
            </h1>
            <p className="text-gray-600">Manage teachers and their schedules</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bm-btn-primary"
          >
            <Plus size={20} />
            Add Teacher
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Teachers</p>
                <p className="text-3xl font-bold text-gray-900">
                  {teachers.length}
                </p>
              </div>
              <UserSquare size={32} className="text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Classes</p>
                <p className="text-3xl font-bold text-blue-600">
                  {classSessions.filter((session) => session.status !== "cancelled").length}
                </p>
              </div>
              <BookOpen size={32} className="text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Classes Today</p>
                <p className="text-3xl font-bold text-green-600">
                  {classSessions.filter((session) => {
                    const sessionDate = new Date(session.startsAt);
                    if (Number.isNaN(sessionDate.getTime())) return false;
                    return sessionDate.toDateString() === new Date().toDateString();
                  }).length}
                </p>
              </div>
              <Calendar size={32} className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingData ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3FA9A6] mx-auto"></div>
            </div>
          ) : teachers.length === 0 ? (
            <div className="col-span-full text-center py-12 px-4 bg-white rounded-2xl border border-gray-200">
              <UserSquare size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No teachers added yet
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Add your first teacher to get started
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3FA9A6] to-[#2d7b78] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <Plus size={20} />
                Add Teacher
              </button>
            </div>
          ) : (
            teachers.map((teacher) => {
              const teacherClasses = getTeacherClasses(teacher.id);
              return (
                <div
                  key={teacher.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {teacher.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {teacher.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail size={14} />
                          <span className="truncate">{teacher.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {teacher.bio && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1 font-semibold">
                        Notes
                      </p>
                      <p className="text-sm text-gray-900">
                        {teacher.bio}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {teacherClasses.length} classes
                      </span>
                    </div>
                    <button
                      onClick={() => setEditingTeacher(teacher)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit teacher"
                    >
                      <Edit size={18} />
                    </button>
                  </div>

                  {teacherClasses.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2 font-semibold">
                        Upcoming Classes
                      </p>
                      <div className="space-y-2 max-h-24 overflow-y-auto">
                        {teacherClasses.slice(0, 3).map((cls) => (
                          <div
                            key={cls.id}
                            className="text-xs text-gray-700 flex items-center justify-between"
                          >
                            <span className="truncate">
                              {cls.classType?.name || "Class"}
                            </span>
                            <span className="text-gray-500 ml-2">
                              {formatDate(cls.startsAt)} · {formatTime(cls.startsAt)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Add New Teacher
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createTeacher(new FormData(e.target));
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      name="name"
                      required
                      placeholder="e.g., John Smith"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="teacher@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bio / Availability
                    </label>
                    <textarea
                      name="availability"
                      rows="3"
                      placeholder="e.g., Mon-Fri 9am-5pm, weekends available"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6] resize-none"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#3FA9A6] to-[#2d7b78] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Add Teacher
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingTeacher && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Edit Teacher
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  updateTeacher(editingTeacher.id, {
                    name: formData.get("name"),
                    bio: formData.get("availability")?.toString() ?? "",
                  });
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      name="name"
                      defaultValue={editingTeacher.name}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      defaultValue={editingTeacher.email}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bio / Availability
                    </label>
                    <textarea
                      name="availability"
                        defaultValue={editingTeacher.bio || ""}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6] resize-none"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingTeacher(null)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#3FA9A6] to-[#2d7b78] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
