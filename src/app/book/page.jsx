import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useUser from "@/utils/useUser";
import { apiFetch } from "@/utils/apiClient";
import { useBookingState } from "@/utils/useBookingState";
import { useBookingFilters } from "@/utils/useBookingFilters";
import { PageHeader } from "@/components/BookingPage/PageHeader";
import { BookingStep1 } from "@/components/BookingPage/BookingStep1";
import { BookingStep2 } from "@/components/BookingPage/BookingStep2";
import { BookingStep3 } from "@/components/BookingPage/BookingStep3";

export default function BookClassPage() {
  const { data: user, loading } = useUser();
  const bookingState = useBookingState();
  const filters = useBookingFilters();
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsError, setSlotsError] = useState("");
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [bookingError, setBookingError] = useState("");

  const {
    step,
    setStep,
    selectedSlot,
    isSubmitting,
    setIsSubmitting,
    selectedDate,
    setSelectedDate,
    handleSlotSelection,
    resetBooking,
  } = bookingState;

  const { classType, duration, skillFocus, timezone } = filters;

  useEffect(() => {
    if (loading) return;
    if (!user && typeof window !== "undefined") {
      window.location.href = "/account/signin";
    }
  }, [loading, user]);

  useEffect(() => {
    if (!user) return;
    setStudentName(user?.name || "");
    setStudentEmail(user?.email || "");
  }, [user]);

  useEffect(() => {
    let isActive = true;

    async function loadSlots() {

  if (loading) return null;
  if (!user) return null;
      setSlotsLoading(true);
      setSlotsError("");

      try {
        const slotsResponse = await apiFetch("/class-slots/available");

        if (!slotsResponse.ok) {
          throw new Error("Failed to load available classes.");
        }

        const slotsData = await slotsResponse.json();

        const mappedSlots = (slotsData?.slots || []).map((slot) => {
          const start = new Date(slot.startTime);
          const end = new Date(slot.endTime);
          const dateStr = start.toISOString().split("T")[0];
          const durationMinutes = Math.max(
            0,
            Math.round((end.getTime() - start.getTime()) / 60000)
          );
          const seatsAvailable = slot.remainingSeats ?? 0;
          const maxStudents = slot.maxStudents ?? 1;

          return {
            id: slot.id,
            teacherId: slot.teacherId,
            teacherName: slot.teacher?.name || "Assigned teacher",
            startTime: slot.startTime,
            endTime: slot.endTime,
            dateStr,
            dayName: start.toLocaleDateString("en-US", { weekday: "short" }),
            dayNum: start.getDate(),
            month: start.toLocaleDateString("en-US", { month: "short" }),
            timeLabel: `${start.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })} - ${end.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}`,
            className: "English Class",
            seatsAvailable,
            maxStudents,
            duration: durationMinutes,
            type: maxStudents > 1 ? "group" : "private",
            focus: "conversation",
            available: seatsAvailable > 0,
          };
        });

        if (isActive) {
          setAvailableSlots(mappedSlots);
        }
      } catch (error) {
        console.error("Failed to load available classes:", error);
        if (isActive) {
          setSlotsError(
            error?.message || "Unable to load available classes right now."
          );
        }
      } finally {
        if (isActive) {
          setSlotsLoading(false);
        }
      }
    }

    loadSlots();

    return () => {
      isActive = false;
    };
  }, [user]);

  const filteredSlots = useMemo(() => {
    return availableSlots.filter((slot) => {
      if (classType !== "all" && slot.type !== classType) return false;
      if (duration !== "all" && slot.duration !== Number(duration)) return false;
      if (skillFocus !== "all" && slot.focus !== skillFocus) return false;
      return true;
    });
  }, [availableSlots, classType, duration, skillFocus]);

  const calendarDays = useMemo(() => {
    const byDate = new Map();
    filteredSlots.forEach((slot) => {
      if (!byDate.has(slot.dateStr)) {
        byDate.set(slot.dateStr, {
          date: new Date(slot.startTime),
          dateStr: slot.dateStr,
          dayName: slot.dayName,
          dayNum: slot.dayNum,
          month: slot.month,
        });
      }
    });

    return Array.from(byDate.values()).sort((a, b) => a.date - b.date);
  }, [filteredSlots]);

  useEffect(() => {
    if (!selectedDate && calendarDays.length > 0) {
      setSelectedDate(calendarDays[0]);
    }
  }, [calendarDays, selectedDate, setSelectedDate]);

  const getSlotsForDay = (day) =>
    filteredSlots.filter((slot) => slot.dateStr === day.dateStr);

  const handleBooking = async () => {
    if (!selectedSlot) return;
    setIsSubmitting(true);
    setBookingError("");

    try {
      if (!studentName || !studentEmail) {
        throw new Error("Please provide your name and email to continue.");
      }

      const response = await apiFetch(`/class-slots/${selectedSlot.id}/book`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: user.id,
          studentName,
          studentEmail,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        if (response.status === 409) {
          throw new Error(payload?.error || "This slot is no longer available.");
        }
        throw new Error(payload?.error || "Unable to book this class right now.");
      }

      const data = await response.json();
      const bookedSlot = data?.slot;

      setAvailableSlots((prev) =>
        prev
          .map((slot) =>
            slot.id === bookedSlot?.id
              ? {
                  ...slot,
                  seatsAvailable: bookedSlot?.remainingSeats ?? 0,
                  available: (bookedSlot?.remainingSeats ?? 0) > 0,
                }
              : slot
          )
          .filter((slot) => slot.available)
      );
      setStep(3);
    } catch (error) {
      console.error("Booking failed:", error);
      setBookingError(error?.message || "Booking failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (step === 2) {
      setBookingError("");
    }
  }, [step]);

  return (
    <div className="min-h-screen bm-page-bg overflow-x-hidden">
      <Header />

      <main className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <PageHeader step={step} />

          {/* All steps properly contained for mobile */}
          <div className="w-full max-w-full overflow-x-hidden">
            {/* Step 1: Calendar & Filters */}
            {step === 1 && (
              <BookingStep1
                filters={filters}
                calendarDays={calendarDays}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                getSlotsForDay={getSlotsForDay}
                handleSlotSelection={handleSlotSelection}
                canBook={user?.role === "student"}
                isLoading={slotsLoading}
                errorMessage={slotsError}
              />
            )}

            {/* Step 2: Confirm Details */}
            {step === 2 && selectedSlot && (
              <BookingStep2
                selectedSlot={selectedSlot}
                timezone={timezone}
                setStep={setStep}
                handleBooking={handleBooking}
                isSubmitting={isSubmitting}
                studentName={studentName}
                studentEmail={studentEmail}
                setStudentName={setStudentName}
                setStudentEmail={setStudentEmail}
                bookingError={bookingError}
              />
            )}

            {/* Step 3: Success Screen */}
            {step === 3 && selectedSlot && (
              <BookingStep3
                selectedSlot={selectedSlot}
                resetBooking={resetBooking}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
