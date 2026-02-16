import { useState } from "react";
import type { StatCardProps } from "../../Types/KiduTypes/StatCard.types";
import { ActivityIcon, CheckCircle, Container, DollarSign, FileText } from "lucide-react";
import KiduStatsCardsGrid from "../../KIDU_COMPONENTS/KiduStatsCardsGrid";

export const DashboardStatCards: React.FC = () => {
  // Simulate fetching data
  const [stats, _setStats] = useState({
    totalCases: 1234,
    inProduction: 345,
    completed: 889,
    revenue: 125000,
  });

  const cards: StatCardProps[] = [
    {
      title: 'Total Cases',
      value: stats.totalCases.toLocaleString(),
      change: '+12% from last month',
      changeType: 'positive',
      icon: FileText,
      variant: 'primary',
    },
    {
      title: 'In Production',
      value: stats.inProduction.toLocaleString(),
      change: '+5% from last week',
      changeType: 'positive',
      icon: ActivityIcon,
      variant: 'info',
    },
    {
      title: 'Completed',
      value: stats.completed.toLocaleString(),
      change: '+18% from last month',
      changeType: 'positive',
      icon: CheckCircle,
      variant: 'success',
    },
    {
      title: 'Total Revenue',
      value: `$${(stats.revenue / 1000).toFixed(0)}K`,
      change: '+24% from last quarter',
      changeType: 'positive',
      icon: DollarSign,
      variant: 'success',
    },
  ];

  return (
    <Container>
      <div className="mb-4">
        <h2>Dashboard Overview</h2>
        <p className="text-muted">Monitor your key metrics at a glance</p>
      </div>
      <KiduStatsCardsGrid cards={cards} columns={4} />
    </Container>
  );
};
