import React, { useEffect } from 'react';
import { Order, Transaction } from '../../models';
import './Receipt.css';

interface ReceiptProps {
  order: Order;
  transaction: Transaction;
}

const Receipt: React.FC<ReceiptProps> = ({ order, transaction }) => {
  useEffect(() => {
    // Automatically trigger the print dialog when the component mounts
    window.print();
  }, []);

  return (
    <div className="receipt">
      <div className="receipt-header">
        <h2>Khaomankai Restaurant</h2>
        <p>Your Order: {order.id}</p>
        <p>{new Date(transaction.created_at).toLocaleString()}</p>
      </div>
      <hr />
      <div className="receipt-body">
        {order.items.map(item => (
          <div key={item.id} className="receipt-item">
            <div className="item-name">{item.quantity}x {item.menu_item_name}</div>
            <div className="item-price">{item.line_item_total.toLocaleString()}</div>
          </div>
        ))}
      </div>
      <hr />
      <div className="receipt-footer">
        <div className="receipt-total">
          <span>Total</span>
          <span>{order.total.toLocaleString()} THB</span>
        </div>
        <div className="payment-details">
          <span>Payment Method</span>
          <span>{transaction.method === 'cash' ? 'Cash' : 'QR Transfer'}</span>
        </div>
        {transaction.method === 'cash' && (
          <div className="payment-details">
            <span>Amount Received</span>
            <span>{(transaction.amount).toLocaleString()} THB</span>
          </div>
        )}
        {transaction.method === 'cash' && (
           <div className="payment-details">
            <span>Change</span>
            <span>{(transaction.amount - order.total).toLocaleString()} THB</span>
          </div>
        )}
      </div>
      <hr />
      <div className="thank-you">
        <p>Thank you!</p>
        <img src="https://i.imgur.com/g2yXp2f.png" alt="QR Code for review" className="qr-code" />
        <p>Scan to give feedback</p>
      </div>
    </div>
  );
};

export default Receipt;
