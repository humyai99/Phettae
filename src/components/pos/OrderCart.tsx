import React from 'react';
import { OrderLineItem } from '../../models';
import './OrderCart.css';

interface OrderCartProps {
  cartItems: OrderLineItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onSendOrder: () => void;
}

const OrderCart: React.FC<OrderCartProps> = ({ cartItems, onUpdateQuantity, onRemoveItem, onSendOrder }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.line_item_total, 0);

  const renderCartItem = (item: OrderLineItem) => (
    <div key={item.id} className="cart-item">
      <div className="item-info">
        <span className="item-name">{item.menu_item_name}</span>
        <div className="item-modifiers">
          {item.selected_modifiers.map(mod => mod.option_name).join(', ')}
        </div>
      </div>
      <div className="item-controls">
        <div className="quantity-control">
          <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
        </div>
        <span className="item-price">{(item.line_item_total).toLocaleString()}</span>
        <button className="remove-btn" onClick={() => onRemoveItem(item.id)}>&times;</button>
      </div>
    </div>
  );

  return (
    <div className="order-cart">
      <header className="cart-header">
        <h3>Current Order</h3>
      </header>
      <div className="cart-items-list">
        {cartItems.length === 0 ? (
          <p className="empty-cart-message">Select items from the menu to start an order.</p>
        ) : (
          cartItems.map(renderCartItem)
        )}
      </div>
      <footer className="cart-footer">
        <div className="total-section">
          <span className="total-label">Total</span>
          <span className="total-amount">{subtotal.toLocaleString()} THB</span>
        </div>
        <button
          className="send-order-btn"
          disabled={cartItems.length === 0}
          onClick={onSendOrder}
        >
          Send to Kitchen
        </button>
      </footer>
    </div>
  );
};

export default OrderCart;
