import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PosPage from './pages/PosPage';
import KdsPage from './pages/KdsPage';
import DashboardPage from './pages/DashboardPage';
import ManagementPage from './pages/ManagementPage';
import LoginPage from './pages/LoginPage';
import ReceiptPage from './pages/ReceiptPage';
import { Order, OrderLineItem, OrderType, Transaction, PaymentMethod } from './models';
import { mockOrders } from './services/mockData';
import './App.css';

interface NewOrderPayload {
  type: OrderType;
  details: { table_number?: number; delivery_info?: { platform: string; order_number: string } };
  items: OrderLineItem[];
}

function App() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const getNextOrderId = (): string => {
    const lastOrder = orders.slice().sort((a, b) => a.id.localeCompare(b.id)).pop();
    if (!lastOrder) return '#A001';
    let letter = lastOrder.id.charAt(1);
    let num = parseInt(lastOrder.id.substring(2), 10);
    if (num < 999) num++;
    else { num = 1; letter = String.fromCharCode(letter.charCodeAt(0) + 1); if (letter > 'Z') letter = 'A'; }
    return `#${letter}${num.toString().padStart(3, '0')}`;
  };

  const handleSendOrder = (payload: NewOrderPayload) => {
    const newOrder: Order = {
      id: getNextOrderId(),
      firestore_id: `order-${Date.now()}`, type: payload.type, status: 'new', ...payload.details,
      items: payload.items,
      subtotal: payload.items.reduce((sum, item) => sum + item.line_item_total, 0),
      discount: 0,
      total: payload.items.reduce((sum, item) => sum + item.line_item_total, 0),
      timestamps: { created_at: Date.now() }, sla_exceeded: false, created_by_user_id: 'user-pos-1',
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const handleUpdateKdsStatus = (orderId: string, newStatus: 'in_progress' | 'ready') => {
    setOrders(prev => prev.map(o => o.firestore_id === orderId ? { ...o, status: newStatus, timestamps: { ...o.timestamps, [newStatus === 'in_progress' ? 'in_progress_at' : 'ready_at']: Date.now() } } : o));
  };

  const handleCancelItem = (orderId: string, itemId: string) => {
    setOrders(prevOrders => prevOrders.map(order => {
      if (order.firestore_id === orderId) {
        const newItems = order.items.map(item => {
          if (item.id === itemId) {
            return { ...item, status: 'cancelled' };
          }
          return item;
        });
        // Also update the total price of the order
        const newTotal = newItems
          .filter(item => item.status !== 'cancelled')
          .reduce((sum, item) => sum + item.line_item_total, 0);
        return { ...order, items: newItems, total: newTotal };
      }
      return order;
    }));
  };

  const handleProcessPayment = (orderId: string, method: PaymentMethod, amountReceived?: number) => {
    const order = orders.find(o => o.firestore_id === orderId);
    if (!order) return;
    const newTransaction: Transaction = {
      id: `trans-${Date.now()}`, order_id: orderId,
      amount: method === 'cash' ? amountReceived! : order.total,
      method: method, status: 'completed', created_at: Date.now(), processed_by_user_id: 'user-pos-1',
    };
    setTransactions(prev => [...prev, newTransaction]);
    setOrders(prev => prev.map(o => o.firestore_id === orderId ? { ...o, status: 'closed', timestamps: { ...o.timestamps, closed_at: Date.now() } } : o));
    window.open(`/receipt/${orderId}`, '_blank', 'width=400,height=800');
    if (method === 'cash') alert("Ka-ching! Cash drawer opened.");
  };

  return (
    <Router>
      {/* The app now flows naturally, so dev navigation is removed. */}
      {/* For testing, you can manually navigate to /kds or /dashboard */}
      <Routes>
        <Route path="/" element={<PosPage orders={orders} onSendOrder={handleSendOrder} onProcessPayment={handleProcessPayment} />} />
        <Route path="/pos" element={<PosPage orders={orders} onSendOrder={handleSendOrder} onProcessPayment={handleProcessPayment} />} />
        <Route path="/kds" element={<KdsPage orders={orders} onUpdateStatus={handleUpdateKdsStatus} onCancelItem={handleCancelItem} />} />
        <Route path="/receipt/:orderId" element={<ReceiptPage orders={orders} transactions={transactions} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage orders={orders} transactions={transactions} />} />
        <Route path="/management" element={<ManagementPage />} />
      </Routes>
    </Router>
  );
}

export default App;
