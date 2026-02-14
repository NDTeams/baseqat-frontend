import DashboardCards from "@/components/dashboard/dashboard-cards";
import StatisticsCards from "@/components/dashboard/statistics-cards";  
import ChartsSection from "@/components/dashboard/charts-section";
export default function Home() {
  return (
    <div className="space-y-6 bg-gray-50">
      <DashboardCards />
      <StatisticsCards />
      <ChartsSection />
       
    </div>

  );
}
