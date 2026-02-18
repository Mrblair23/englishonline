import { useState, useEffect } from "react";
import useAdmin from "@/utils/useAdmin";
import AdminLayout from "@/components/AdminLayout";
import {
  BookOpen,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  FileText,
  Users,
} from "lucide-react";

export default function AdminHomeworkPage() {
  const { isAdmin, loading } = useAdmin();
  const [homework, setHomework] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      window.location.href = "/account/signin";
    }
  }, [isAdmin, loading]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      const [hwRes, classRes] = await Promise.all([
        apiFetch("/admin/homework"),
        apiFetch("/admin/classes"),
      ]);

      setHomework(hwRes.homework || []);
      setClasses(classRes.classes || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const createHomework = async (formData) => {
    try {
      await apiFetch("/admin/homework", {
        method: "POST",
        body: {
          classId: parseInt(formData.get("classId")),
          title: formData.get("title"),
          description: formData.get("description"),
          dueDate: formData.get("dueDate"),
        },
      });
      setShowCreateModal(false);
      fetchData();
    } catch (error) {
      console.error("Error creating homework:", error);
      alert("Failed to create homework. Please try again.");
    }
  };

  const updateHomework = async (id, updates) => {
    try {
      await apiFetch("/admin/homework", {
        method: "POST",
        body: {
          homeworkId: id,
          ...updates,
        },
      });
      setEditingHomework(null);
      fetchData();
    } catch (error) {
      console.error("Error updating homework:", error);
      alert("Failed to update homework. Please try again.");
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bm-page-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#3FA9A6]"></div>
      </div>
    );
  }

  const pendingHomework = homework.filter((hw) => hw.status === "pending");
  const reviewedHomework = homework.filter((hw) => hw.status === "reviewed");

  return (
    <AdminLayout currentPage="homework">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Homework Management
            </h1>
            <p className="text-gray-600">
              Create and manage homework assignments
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bm-btn-primary"
          >
            <Plus size={20} />
            Create Homework
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Homework</p>
                <p className="text-3xl font-bold text-gray-900">
                  {homework.length}
                </p>
              </div>
              <BookOpen size={32} className="text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-orange-600">
                  {pendingHomework.length}
                </p>
              </div>
              <Clock size={32} className="text-orange-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Reviewed</p>
                <p className="text-3xl font-bold text-green-600">
                  {reviewedHomework.length}
                </p>
              </div>
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Homework List */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loadingData ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3FA9A6] mx-auto"></div>
            </div>
          ) : homework.length === 0 ? (
            <div className="text-center py-12 px-4">
              <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No homework assigned yet
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Create your first homework assignment
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3FA9A6] to-[#2d7b78] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <Plus size={20} />
                Create Homework
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Class
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {homework.map((hw) => {
                    const hwClass = classes.find((c) => c.id === hw.class_id);
                    return (
                      <tr key={hw.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <FileText size={20} className="text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {hw.title}
                              </div>
                              {hw.description && (
                                <div className="text-xs text-gray-500 mt-1 max-w-md truncate">
                                  {hw.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">
                            {hwClass?.title || "Unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={16} />
                            {new Date(hw.due_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              hw.status === "reviewed"
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {hw.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingHomework(hw)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit homework"
                            >
                              <Edit size={18} />
                            </button>
                            {hw.status === "pending" && (
                              <button
                                onClick={() =>
                                  updateHomework(hw.id, { status: "reviewed" })
                                }
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Mark as reviewed"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Create Homework
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createHomework(new FormData(e.target));
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Class *
                    </label>
                    <select
                      name="classId"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6]"
                    >
                      <option value="">Select a class</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} -{" "}
                          {new Date(c.class_date).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      name="title"
                      required
                      placeholder="e.g., Grammar Exercise 5"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="3"
                      placeholder="Instructions for students..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6] resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      name="dueDate"
                      type="date"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6]"
                    />
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
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingHomework && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Edit Homework
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  updateHomework(editingHomework.id, {
                    title: formData.get("title"),
                    description: formData.get("description"),
                    dueDate: formData.get("dueDate"),
                    feedback: formData.get("feedback"),
                    status: formData.get("status"),
                  });
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      name="title"
                      defaultValue={editingHomework.title}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      defaultValue={editingHomework.description || ""}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6] resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      name="dueDate"
                      type="date"
                      defaultValue={editingHomework.due_date}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      defaultValue={editingHomework.status}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6]"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Feedback
                    </label>
                    <textarea
                      name="feedback"
                      defaultValue={editingHomework.feedback || ""}
                      rows="2"
                      placeholder="Add feedback for students..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6] resize-none"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingHomework(null)}
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
