import React, { useMemo } from 'react';
import { Order, Transaction } from '../models';
import StatCard from '../components/dashboard/StatCard';
import './DashboardPage.css';

interface DashboardPageProps {
  orders: Order[];
  transactions: Transaction[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ orders, transactions }) => {
  const analytics = useMemo(() => {
    const closedOrders = orders.filter(o => o.status === 'closed');

    // 1. Total Sales
    const totalSales = transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    // 2. Best-Selling Items
    const itemCounts = new Map<string, number>();
    closedOrders.forEach(order => {
      order.items.forEach(item => {
        const currentCount = itemCounts.get(item.menu_item_name) || 0;
        itemCounts.set(item.menu_item_name, currentCount + item.quantity);
      });
    });
    const bestSellingItems = Array.from(itemCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5

    // 3. Average Cooking Time
    const cookTimes = closedOrders
      .map(o => {
        if (o.timestamps.ready_at && o.timestamps.in_progress_at) {
          return o.timestamps.ready_at - o.timestamps.in_progress_at;
        }
        return null;
      })
      .filter((t): t is number => t !== null);

    const avgCookTimeMs = cookTimes.length > 0 ? cookTimes.reduce((a, b) => a + b, 0) / cookTimes.length : 0;
    const avgCookTimeSec = Math.round(avgCookTimeMs / 1000);

    // 4. SLA Exceeded Orders
    const slaExceededCount = orders.filter(o => o.sla_exceeded).length;

    return {
      totalSales,
      bestSellingItems,
      avgCookTimeSec,
      slaExceededCount,
      totalOrders: orders.length
    };
  }, [orders, transactions]);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      <div className="dashboard-content">
        <div className="stats-grid">
          <StatCard title="Total Sales" value={`${analytics.totalSales.toLocaleString()} THB`} icon="💰" />
          <StatCard title="Total Orders" value={analytics.totalOrders} icon="🧾" />
          <StatCard title="Avg. Cook Time" value={`${analytics.avgCookTimeSec} s`} icon="⏱️" />
          <StatCard title="SLA Exceeded" value={analytics.slaExceededCount} icon="⚠️" />
        </div>
        <div className="lists-container">
          <div className="list-card">
            <h3>Best-Selling Items</h3>
            <ol>
              {analytics.bestSellingItems.map(([name, count]) => (
                <li key={name}>
                  <span>{name}</span>
                  <strong>{count}</strong>
                </li>
              ))}
            </ol>
          </div>
          {/* Placeholder for more lists */}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
