import React, { useState } from 'react';
import { DeliveryPlatform } from '../../models';
import './DeliveryInfoForm.css';

interface DeliveryInfoFormProps {
  onConfirm: (details: { platform: DeliveryPlatform; order_number: string }) => void;
  onBack: () => void;
}

const DeliveryInfoForm: React.FC<DeliveryInfoFormProps> = ({ onConfirm, onBack }) => {
  const [platform, setPlatform] = useState<DeliveryPlatform | ''>('');
  const [orderNumber, setOrderNumber] = useState('');

  const isFormValid = platform && orderNumber.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onConfirm({ platform, order_number: orderNumber });
    }
  };

  return (
    <div className="selection-overlay">
      <form className="selection-container delivery-form" onSubmit={handleSubmit}>
        <div className="selection-header">
          <button type="button" onClick={onBack} className="back-button">←</button>
          <h2>Delivery Details</h2>
        </div>
        <div className="form-content">
          <div className="form-group">
            <label htmlFor="platform">Platform</label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as DeliveryPlatform | '')}
              required
            >
              <option value="" disabled>Select a platform</option>
              <option value="Shopee">Shopee</option>
              <option value="Grab">Grab</option>
              <option value="LINE MAN">LINE MAN</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="orderNumber">Order Number</label>
            <input
              id="orderNumber"
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g., GF-12345"
              required
            />
          </div>
          <button type="submit" className="confirm-btn" disabled={!isFormValid}>
            Confirm Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryInfoForm;
