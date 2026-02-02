import Sidebar from "@/components/(site)/sidebar";
import DashboardMain from "@/components/(site)/dashboard-main";
export default function StudentDashboard() {
    return (
    <main className="pt-40 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <DashboardMain />
        </div>
      </div>
    </main>
  );
}