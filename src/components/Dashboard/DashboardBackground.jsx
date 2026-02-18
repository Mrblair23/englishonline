import { Coffee, BookOpen } from "lucide-react";

export function DashboardBackground() {
  return (
    <>
      {/* Warm background ambiance */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-radial from-[#F2B705]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-radial from-[#3FA9A6]/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 right-10 opacity-5 hidden xl:block pointer-events-none">
        <Coffee size={80} className="text-[#F2B705]" />
      </div>
      <div className="absolute bottom-10 left-10 opacity-5 hidden xl:block pointer-events-none">
        <BookOpen size={100} className="text-[#1F2A44]" />
      </div>
    </>
  );
}
