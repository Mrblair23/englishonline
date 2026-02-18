// Generate calendar days (current week + next week)
export const generateCalendarDays = () => {
  const days = [];
  const today = new Date(2026, 0, 30); // Jan 30, 2026

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date,
      dateStr: date.toISOString().split("T")[0],
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return days;
};

// Generate time slots with filters applied
export const generateTimeSlots = (date, filters) => {
  const { classType, duration, skillFocus } = filters;

  const slots = [
    {
      time: "09:00 AM",
      type: "private",
      duration: 60,
      focus: "conversation",
      available: true,
    },
    {
      time: "10:00 AM",
      type: "group",
      duration: 60,
      focus: "pronunciation",
      available: true,
    },
    {
      time: "10:30 AM",
      type: "private",
      duration: 30,
      focus: "interview",
      available: true,
    },
    {
      time: "12:00 PM",
      type: "group",
      duration: 60,
      focus: "conversation",
      available: false,
    },
    {
      time: "01:00 PM",
      type: "private",
      duration: 60,
      focus: "business",
      available: true,
    },
    {
      time: "02:30 PM",
      type: "private",
      duration: 30,
      focus: "pronunciation",
      available: true,
    },
    {
      time: "03:00 PM",
      type: "group",
      duration: 60,
      focus: "conversation",
      available: true,
    },
    {
      time: "04:30 PM",
      type: "private",
      duration: 60,
      focus: "interview",
      available: true,
    },
    {
      time: "05:00 PM",
      type: "group",
      duration: 60,
      focus: "business",
      available: true,
    },
    {
      time: "07:00 PM",
      type: "private",
      duration: 30,
      focus: "conversation",
      available: true,
    },
  ];

  // Apply filters
  return slots.filter((slot) => {
    if (classType !== "all" && slot.type !== classType) return false;
    if (duration !== "all" && slot.duration !== parseInt(duration))
      return false;
    if (skillFocus !== "all" && slot.focus !== skillFocus) return false;
    return true;
  });
};
