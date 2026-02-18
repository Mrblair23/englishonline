import { Filter, ChevronDown } from "lucide-react";

export function FiltersSidebar({ filters }) {
  const {
    timezone,
    setTimezone,
    classType,
    setClassType,
    duration,
    setDuration,
    skillFocus,
    setSkillFocus,
    timezones,
    classTypes,
    durations,
    skillFocuses,
    activeFilters,
    clearAllFilters,
  } = filters;

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
          <Filter size={20} />
          <span>Filters</span>
        </h3>
        {activeFilters.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-[#1e3a8a] font-semibold hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Timezone */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Timezone
        </label>
        <div className="relative">
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1e3a8a] focus:outline-none font-medium appearance-none bg-white cursor-pointer"
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={20}
          />
        </div>
      </div>

      {/* Class Type */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Class Type
        </label>
        <div className="space-y-2">
          {classTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setClassType(type.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all text-left ${
                classType === type.value
                  ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Duration
        </label>
        <div className="space-y-2">
          {durations.map((dur) => (
            <button
              key={dur.value}
              onClick={() => setDuration(dur.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all text-left ${
                duration === dur.value
                  ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {dur.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Focus */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Skill Focus
        </label>
        <div className="space-y-2">
          {skillFocuses.map((skill) => (
            <button
              key={skill.value}
              onClick={() => setSkillFocus(skill.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all text-left ${
                skillFocus === skill.value
                  ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {skill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFilters.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Active Filters
          </p>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, i) => (
              <span
                key={i}
                className="inline-flex items-center space-x-1 bg-[#1e3a8a] text-white px-3 py-1 rounded-full text-xs font-semibold"
              >
                <span>{filter}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
