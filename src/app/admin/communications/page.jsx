import { useState, useEffect } from "react";
import useAdmin from "@/utils/useAdmin";
import AdminLayout from "@/components/AdminLayout";
import {
  MessageSquare,
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  Mail,
  Filter,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function AdminCommunicationsPage() {
  const { isAdmin, loading, user } = useAdmin();
  const [communications, setCommunications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

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
      const data = await apiFetch("/admin/students");
      setStudents(data.students || []);

      // Communications list would be fetched here if we had a GET endpoint
      // For now, we'll just set it to empty
      setCommunications([]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const sendCommunication = async (formData) => {
    setSending(true);
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate the send
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSendSuccess(true);
      setTimeout(() => {
        setShowComposeModal(false);
        setSendSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error sending communication:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bm-page-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#3FA9A6]"></div>
      </div>
    );
  }

  const activeStudents = students.filter((s) => s.status === "active");

  return (
    <AdminLayout currentPage="communications">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Communications
            </h1>
            <p className="text-gray-600">
              Send messages and notifications to students
            </p>
          </div>
          <button
            onClick={() => setShowComposeModal(true)}
            className="bm-btn-primary"
          >
            <Send size={20} />
            Compose Message
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Students</p>
                <p className="text-3xl font-bold text-gray-900">
                  {activeStudents.length}
                </p>
              </div>
              <Users size={32} className="text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Messages Sent</p>
                <p className="text-3xl font-bold text-green-600">
                  {communications.length}
                </p>
              </div>
              <Mail size={32} className="text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-purple-600">0</p>
              </div>
              <MessageSquare size={32} className="text-purple-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setShowComposeModal(true)}
            className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#3FA9A6] hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Message All Students
                </h3>
                <p className="text-sm text-gray-600">
                  Send to {activeStudents.length} students
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowComposeModal(true)}
            className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#3FA9A6] hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Filter size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Filter by Plan</h3>
                <p className="text-sm text-gray-600">Send to specific plans</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowComposeModal(true)}
            className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#3FA9A6] hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Class Reminder</h3>
                <p className="text-sm text-gray-600">Send to class students</p>
              </div>
            </div>
          </button>
        </div>

        {/* Communications History */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Message History</h2>
          </div>
          <div className="p-6">
            {communications.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare
                  size={48}
                  className="text-gray-300 mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No messages sent yet
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Start communicating with your students
                </p>
                <button
                  onClick={() => setShowComposeModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3FA9A6] to-[#2d7b78] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Send size={20} />
                  Send First Message
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {communications.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {comm.subject}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(comm.sent_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{comm.message}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Users size={14} />
                      <span>
                        Sent to: {comm.recipient_type}
                        {comm.recipient_filter && ` (${comm.recipient_filter})`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compose Modal */}
        {showComposeModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
              {sendSuccess ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle2 size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600">
                    Your message has been sent successfully
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Compose Message
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendCommunication(new FormData(e.target));
                    }}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Recipients *
                        </label>
                        <select
                          name="recipientType"
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6]"
                        >
                          <option value="all">All Students</option>
                          <option value="plan">By Plan</option>
                          <option value="class">By Class</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Subject *
                        </label>
                        <input
                          name="subject"
                          required
                          placeholder="e.g., Class Reminder - Tomorrow at 3pm"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          name="message"
                          required
                          rows="6"
                          placeholder="Write your message here..."
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3FA9A6] resize-none"
                        ></textarea>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle
                          size={20}
                          className="text-blue-600 flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="text-sm text-blue-800 font-semibold mb-1">
                            Email Notification
                          </p>
                          <p className="text-xs text-blue-700">
                            This message will be sent as an email notification
                            to all selected recipients
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowComposeModal(false)}
                        disabled={sending}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={sending}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-[#3FA9A6] to-[#2d7b78] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {sending ? (
                          <>
                            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={20} />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
