import { useState } from "react";

export function useDashboardState() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [homework, setHomework] = useState([
    { id: 1, title: "Complete vocabulary exercise 4A", completed: false },
    { id: 2, title: "Watch grammar video: Present Perfect", completed: true },
    {
      id: 3,
      title: "Write essay: My favorite hobby (200 words)",
      completed: false,
    },
    { id: 4, title: "Practice pronunciation drills", completed: false },
  ]);
  const [hasUpcomingClass, setHasUpcomingClass] = useState(true);

  const toggleHomework = (id) => {
    setHomework(
      homework.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const completedCount = homework.filter((h) => h.completed).length;

  return {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    homework,
    toggleHomework,
    completedCount,
    hasUpcomingClass,
    setHasUpcomingClass,
  };
}
