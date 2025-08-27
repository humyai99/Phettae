import React from 'react';
import { useParams } from 'react-router-dom';
import { Order, Transaction } from '../models';
import Receipt from '../components/pos/Receipt';

interface ReceiptPageProps {
  orders: Order[];
  transactions: Transaction[];
}

const ReceiptPage: React.FC<ReceiptPageProps> = ({ orders, transactions }) => {
  const { orderId } = useParams<{ orderId: string }>();

  const order = orders.find(o => o.firestore_id === orderId);
  const transaction = transactions.find(t => t.order_id === orderId);

  if (!order || !transaction) {
    return <div>Error: Order or Transaction not found.</div>;
  }

  return <Receipt order={order} transaction={transaction} />;
};

export default ReceiptPage;
