import React, { useState, useEffect } from 'react';
import { Order, OrderLineItem } from '../../models';
import './OrderCard.css';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: 'in_progress' | 'ready') => void;
  onCancelItem: (orderId: string, itemId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus, onCancelItem }) => {
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const startTime = order.timestamps.in_progress_at || order.timestamps.created_at;
      const now = Date.now();
      const diff = now - startTime;
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };
    const timerId = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(timerId);
  }, [order.timestamps]);

  const getOrderTitle = (order: Order) => {
    switch (order.type) {
      case 'dine_in': return `Table ${order.table_number}`;
      case 'takeaway': return `Takeaway`;
      case 'delivery': return `Delivery (${order.delivery_info?.platform})`;
    }
  };

  const renderLineItem = (item: OrderLineItem) => (
    <li key={item.id} className={`line-item ${item.status === 'cancelled' ? 'cancelled' : ''}`}>
      <div className="item-main-info">
        <span className="quantity">{item.quantity}x</span>
        <div className="item-details">
          <span className="item-name">{item.menu_item_name}</span>
          {item.selected_modifiers.map(mod => (
            <span key={mod.option_id} className="modifier"> - {mod.option_name}</span>
          ))}
          {item.notes && <span className="notes">Note: {item.notes}</span>}
        </div>
      </div>
      {order.status !== 'ready' && item.status !== 'cancelled' && (
         <button className="cancel-item-btn" onClick={() => onCancelItem(order.firestore_id!, item.id)}>
            &times;
          </button>
      )}
    </li>
  );

  return (
    <div className={`order-card ${order.status} ${order.sla_exceeded ? 'sla-exceeded' : ''}`}>
      <div className="card-header">
        <h3>{getOrderTitle(order)}</h3>
        <div className="details">
          <span>{order.id}</span>
          <span className="timer">{elapsedTime}</span>
        </div>
      </div>
      <ul className="line-item-list">
        {order.items.map(renderLineItem)}
      </ul>
      <div className="card-footer">
        {order.status === 'new' && (
          <button className="btn-start" onClick={() => onUpdateStatus(order.firestore_id!, 'in_progress')}>Start</button>
        )}
        {order.status === 'in_progress' && (
          <button className="btn-ready" onClick={() => onUpdateStatus(order.firestore_id!, 'ready')}>Ready</button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
