import React from 'react';
import { Order } from '../../models';
import OrderCard from './OrderCard';
import './KdsColumn.css';

interface KdsColumnProps {
  title: string;
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: 'in_progress' | 'ready') => void;
  onCancelItem: (orderId: string, itemId: string) => void;
}

const KdsColumn: React.FC<KdsColumnProps> = ({ title, orders, onUpdateStatus, onCancelItem }) => {
  return (
    <div className="kds-column">
      <div className="column-header">
        <h2>{title} ({orders.length})</h2>
      </div>
      <div className="column-content">
        {orders.map(order => (
          <OrderCard
            key={order.firestore_id}
            order={order}
            onUpdateStatus={onUpdateStatus}
            onCancelItem={onCancelItem}
          />
        ))}
      </div>
    </div>
  );
};

export default KdsColumn;
