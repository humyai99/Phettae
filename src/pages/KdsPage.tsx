import React, { useState } from 'react';
import { Order } from '../models';
import KdsColumn from '../components/kds/KdsColumn';
import './KdsPage.css';

type StationType = 'kitchen' | 'tea_station';

interface KdsPageProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: 'in_progress' | 'ready') => void;
  onCancelItem: (orderId: string, itemId: string) => void;
}

const KdsPage: React.FC<KdsPageProps> = ({ orders, onUpdateStatus, onCancelItem }) => {
  const [activeStation, setActiveStation] = useState<StationType>('kitchen');

  const filterOrderForStation = (order: Order, station: StationType): Order | null => {
    const relevantItems = order.items.filter(item => item.station === station);
    if (relevantItems.length === 0) {
      return null;
    }
    return { ...order, items: relevantItems };
  };

  const newOrders = orders
    .filter(o => o.status === 'new')
    .map(o => filterOrderForStation(o, activeStation))
    .filter((o): o is Order => o !== null);

  const inProgressOrders = orders
    .filter(o => o.status === 'in_progress')
    .map(o => filterOrderForStation(o, activeStation))
    .filter((o): o is Order => o !== null);

  const readyOrders = orders
    .filter(o => o.status === 'ready')
    .map(o => filterOrderForStation(o, activeStation))
    .filter((o): o is Order => o !== null);

  return (
    <div className="kds-page">
      <div className="kds-header">
        <h1>Kitchen Display System</h1>
        <div className="station-toggle">
          <button
            className={activeStation === 'kitchen' ? 'active' : ''}
            onClick={() => setActiveStation('kitchen')}>
            Kitchen
          </button>
          <button
            className={activeStation === 'tea_station' ? 'active' : ''}
            onClick={() => setActiveStation('tea_station')}>
            Tea Station
          </button>
        </div>
      </div>
      <div className="kds-columns-container">
        <KdsColumn title="New" orders={newOrders} onUpdateStatus={onUpdateStatus} onCancelItem={onCancelItem} />
        <KdsColumn title="In Progress" orders={inProgressOrders} onUpdateStatus={onUpdateStatus} onCancelItem={onCancelItem} />
        <KdsColumn title="Ready" orders={readyOrders} onUpdateStatus={onUpdateStatus} onCancelItem={onCancelItem} />
      </div>
    </div>
  );
};

export default KdsPage;
