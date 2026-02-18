import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useUser from "@/utils/useUser";
import { apiFetch } from "@/utils/apiClient";

export default function MyBookingsPage() {
  const { data: user, loading } = useUser();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!loading && user?.role !== "student") {
      window.location.href = "/dashboard";
    }
  }, [loading, user]);

  useEffect(() => {
    let isActive = true;

    async function loadBookings() {
      if (!user || user.role !== "student") return;

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await apiFetch("/class-slots/mine");

        if (!response.ok) {
          throw new Error("Unable to load your bookings right now.");
        }

        const payload = await response.json();
        const filtered = (payload?.slots || [])
          .map((slot) => {
            const start = new Date(slot.startTime);
            const end = new Date(slot.endTime);

            return {
              ...slot,
              className: "English Class",
              teacherName: slot.teacher?.name || "Assigned teacher",
              dateLabel: start.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              timeLabel: `${start.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })} - ${end.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}`,
            };
          })
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        if (isActive) {
          setBookings(filtered);
        }
      } catch (error) {
        console.error("Failed to load bookings:", error);
        if (isActive) {
          setErrorMessage(
            error?.message || "Unable to load your bookings right now."
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      isActive = false;
    };
  }, [user]);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="text-center py-16 text-gray-500">
          Loading your bookings...
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div className="text-center py-16 text-red-600 font-medium">
          {errorMessage}
        </div>
      );
    }

    if (bookings.length === 0) {
      return (
        <div className="text-center py-16 text-gray-500">
          You have no booked classes yet.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {booking.className}
              </h3>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
                Confirmed
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <span className="font-semibold text-gray-700">Date:</span>{" "}
                {booking.dateLabel}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Time:</span>{" "}
                {booking.timeLabel}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Teacher:</span>{" "}
                {booking.teacherName}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }, [bookings, errorMessage, isLoading]);

  if (loading) return null;
  if (!user || user.role !== "student") return null;

  return (
    <div className="min-h-screen bm-page-bg overflow-x-hidden">
      <Header />

      <main className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              My Bookings
            </h1>
            <p className="text-gray-600 mt-2">
              Review your upcoming classes and booking details.
            </p>
          </div>

          {content}
        </div>
      </main>

      <Footer />
    </div>
  );
}
