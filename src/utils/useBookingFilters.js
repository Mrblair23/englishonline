import { useState } from "react";

export function useBookingFilters() {
  const [timezone, setTimezone] = useState("EST (UTC-5)");
  const [classType, setClassType] = useState("all");
  const [duration, setDuration] = useState("all");
  const [skillFocus, setSkillFocus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("calendar");

  const timezones = [
    "EST (UTC-5)",
    "CST (UTC-6)",
    "PST (UTC-8)",
    "GMT (UTC+0)",
    "CET (UTC+1)",
    "IST (UTC+5:30)",
    "JST (UTC+9)",
  ];

  const classTypes = [
    { value: "all", label: "All Types" },
    { value: "private", label: "Private 1-on-1" },
    { value: "group", label: "Group Class" },
  ];

  const durations = [
    { value: "all", label: "Any Duration" },
    { value: "30", label: "30 minutes" },
    { value: "60", label: "60 minutes" },
  ];

  const skillFocuses = [
    { value: "all", label: "All Skills" },
    { value: "conversation", label: "Conversation" },
    { value: "pronunciation", label: "Pronunciation" },
    { value: "interview", label: "Interview Prep" },
    { value: "business", label: "Business English" },
  ];

  const activeFilters = [
    classType !== "all" && classTypes.find((t) => t.value === classType)?.label,
    duration !== "all" && durations.find((d) => d.value === duration)?.label,
    skillFocus !== "all" &&
      skillFocuses.find((s) => s.value === skillFocus)?.label,
  ].filter(Boolean);

  const clearAllFilters = () => {
    setClassType("all");
    setDuration("all");
    setSkillFocus("all");
  };

  return {
    timezone,
    setTimezone,
    classType,
    setClassType,
    duration,
    setDuration,
    skillFocus,
    setSkillFocus,
    showFilters,
    setShowFilters,
    viewMode,
    setViewMode,
    timezones,
    classTypes,
    durations,
    skillFocuses,
    activeFilters,
    clearAllFilters,
  };
}
