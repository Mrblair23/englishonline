import { WelcomeHeader } from "./WelcomeHeader";
import { LevelCard } from "./LevelCard";
import { NextClassCard } from "./NextClassCard";
import { PlanCard } from "./PlanCard";
import { HomeworkCard } from "./HomeworkCard";
import { QuickActions } from "./QuickActions";

export function OverviewTab({
  userName,
  hasUpcomingClass,
  homework,
  onToggleHomework,
  completedCount,
  onBookClass,
  onViewSchedule,
  onChangePayments,
}) {
  return (
    <>
      <WelcomeHeader userName={userName} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <LevelCard />
        <NextClassCard
          hasUpcomingClass={hasUpcomingClass}
          onBookClass={onBookClass}
        />
        <PlanCard />
        <HomeworkCard
          homework={homework}
          onToggleHomework={onToggleHomework}
          completedCount={completedCount}
        />
      </div>

      <QuickActions
        onBookClass={onBookClass}
        onViewSchedule={onViewSchedule}
        onChangePayments={onChangePayments}
      />
    </>
  );
}
