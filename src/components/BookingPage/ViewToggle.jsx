export function ViewToggle({ viewMode, setViewMode, timezone }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setViewMode("calendar")}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            viewMode === "calendar"
              ? "bg-white text-[#1e3a8a] shadow-sm"
              : "text-gray-600"
          }`}
        >
          Calendar View
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            viewMode === "list"
              ? "bg-white text-[#1e3a8a] shadow-sm"
              : "text-gray-600"
          }`}
        >
          List View
        </button>
      </div>
      <p className="text-sm text-gray-500">
        Times shown in{" "}
        <span className="font-bold text-gray-900">{timezone}</span>
      </p>
    </div>
  );
}
