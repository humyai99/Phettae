import React, { useState, useEffect } from 'react';
import { Order, PaymentMethod } from '../../models';
import './PaymentModal.css';

interface PaymentModalProps {
  order: Order;
  onClose: () => void;
  onProcessPayment: (orderId: string, method: PaymentMethod, amountReceived?: number) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ order, onClose, onProcessPayment }) => {
  const [activeTab, setActiveTab] = useState<PaymentMethod>('cash');
  const [amountReceived, setAmountReceived] = useState<string>('');
  const [change, setChange] = useState<number>(0);

  useEffect(() => {
    if (activeTab === 'cash' && amountReceived) {
      const received = parseFloat(amountReceived);
      if (!isNaN(received) && received >= order.total) {
        setChange(received - order.total);
      } else {
        setChange(0);
      }
    }
  }, [amountReceived, order.total, activeTab]);

  const handleConfirmCashPayment = () => {
    const received = parseFloat(amountReceived);
    if (!isNaN(received) && received >= order.total) {
      onProcessPayment(order.firestore_id!, 'cash', received);
    } else {
      alert('Amount received is less than total.');
    }
  };

  const handleConfirmQrPayment = () => {
    onProcessPayment(order.firestore_id!, 'qr_transfer');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Checkout Order: {order.id}</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          <div className="order-summary">
            <h4>Summary</h4>
            {order.items.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.quantity}x {item.menu_item_name}</span>
                <span>{item.line_item_total.toLocaleString()}</span>
              </div>
            ))}
            <hr />
            <div className="summary-total">
              <strong>Total</strong>
              <strong>{order.total.toLocaleString()} THB</strong>
            </div>
          </div>

          <div className="payment-tabs">
            <button className={activeTab === 'cash' ? 'active' : ''} onClick={() => setActiveTab('cash')}>Cash</button>
            <button className={activeTab === 'qr_transfer' ? 'active' : ''} onClick={() => setActiveTab('qr_transfer')}>QR Transfer</button>
          </div>

          <div className="payment-content">
            {activeTab === 'cash' && (
              <div className="cash-payment">
                <label htmlFor="amount-received">Amount Received</label>
                <input
                  type="number"
                  id="amount-received"
                  value={amountReceived}
                  onChange={e => setAmountReceived(e.target.value)}
                  placeholder="e.g., 500"
                />
                <div className="change-due">
                  <span>Change Due:</span>
                  <strong>{change.toLocaleString()} THB</strong>
                </div>
                <button className="confirm-payment-btn" onClick={handleConfirmCashPayment}>Confirm Payment</button>
              </div>
            )}
            {activeTab === 'qr_transfer' && (
              <div className="qr-payment">
                <img src="https://i.imgur.com/g2yXp2f.png" alt="Sample QR Code" />
                <p>Scan QR code to pay</p>
                <button className="confirm-payment-btn" onClick={handleConfirmQrPayment}>Confirm Payment Received</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
