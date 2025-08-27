import React from 'react';
import { OrderType } from '../../models';
import './OrderTypeSelection.css';

interface OrderTypeSelectionProps {
  onSelectOrderType: (type: OrderType) => void;
}

const OrderTypeSelection: React.FC<OrderTypeSelectionProps> = ({ onSelectOrderType }) => {
  return (
    <div className="order-type-overlay">
      <div className="order-type-container">
        <h2>Start New Order</h2>
        <div className="button-container">
          <button onClick={() => onSelectOrderType('dine_in')}>
            Dine-In
          </button>
          <button onClick={() => onSelectOrderType('takeaway')}>
            Takeaway
          </button>
          <button onClick={() => onSelectOrderType('delivery')}>
            Delivery
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTypeSelection;
