import { useState } from "react";

export function useBookingState() {
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSlotSelection = (slot, date) => {
    setSelectedSlot({ ...slot, date });
    setStep(2);
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedSlot(null);
    setSelectedDate(null);
  };

  return {
    step,
    setStep,
    selectedSlot,
    setSelectedSlot,
    isSubmitting,
    setIsSubmitting,
    selectedDate,
    setSelectedDate,
    handleSlotSelection,
    resetBooking,
  };
}
