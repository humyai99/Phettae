import React, { useState } from 'react';
import { mockCategories, mockMenuItems, mockTables } from '../services/mockData';
import MenuCategoryTabs from '../components/pos/MenuCategoryTabs';
import MenuItemCard from '../components/pos/MenuItemCard';
import ModifierModal from '../components/pos/ModifierModal';
import OrderCart from '../components/pos/OrderCart';
import OrderTypeSelection from '../components/pos/OrderTypeSelection';
import TableSelection from '../components/pos/TableSelection';
import DeliveryInfoForm from '../components/pos/DeliveryInfoForm';
import PaymentModal from '../components/pos/PaymentModal';
import { MenuItem, OrderLineItem, OrderType, Order, PaymentMethod, DeliveryPlatform } from '../models';
import type { NewOrderPayload } from '../App'; // Use type-only import
import './PosPage.css';

type OrderStep = 'TYPE_SELECTION' | 'DETAIL_SELECTION' | 'MENU';
type OrderDetails = { table_number?: number; delivery_info?: { platform: DeliveryPlatform; order_number: string } };

interface PosPageProps {
  orders: Order[];
  onSendOrder: (payload: NewOrderPayload) => void;
  onProcessPayment: (orderId: string, method: PaymentMethod, amountReceived?: number) => void;
}

const PosPage: React.FC<PosPageProps> = ({ orders, onSendOrder, onProcessPayment }) => {
  const [orderStep, setOrderStep] = useState<OrderStep>('TYPE_SELECTION');
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({});
  const [categories] = useState(mockCategories);
  const [menuItems] = useState(mockMenuItems);
  const [tables] = useState(mockTables);
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id || '');
  const [cartItems, setCartItems] = useState<OrderLineItem[]>([]);
  const [isModifierModalOpen, setIsModifierModalOpen] = useState(false);
  const [selectedItemForModifier, setSelectedItemForModifier] = useState<MenuItem | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<Order | null>(null);

  const resetOrderFlow = () => {
    setCartItems([]);
    setOrderDetails({});
    setOrderType(null);
    setOrderStep('TYPE_SELECTION');
  };

  const handleSelectOrderType = (type: OrderType) => { setOrderType(type); if (type === 'takeaway') { setOrderDetails({}); setOrderStep('MENU'); } else { setOrderStep('DETAIL_SELECTION'); } };
  const handleSelectTable = (tableId: number) => { setOrderDetails({ table_number: tableId }); setOrderStep('MENU'); };
  const handleConfirmDelivery = (details: { platform: DeliveryPlatform; order_number: string }) => { setOrderDetails({ delivery_info: details }); setOrderStep('MENU'); };
  const handleBackToTypeSelection = () => { setOrderStep('TYPE_SELECTION'); setOrderType(null); };
  const handleSelectCategory = (categoryId: string) => setActiveCategoryId(categoryId);
  const handleCloseModifierModal = () => { setIsModifierModalOpen(false); setSelectedItemForModifier(null); };

  const handleSelectItem = (item: MenuItem) => {
    if (!item.modifier_groups || item.modifier_groups.length === 0) {
      const existingItem = cartItems.find(cartItem => cartItem.menu_item_id === item.id && cartItem.selected_modifiers.length === 0);
      if (existingItem) handleUpdateQuantity(existingItem.id, existingItem.quantity + 1);
      else {
        const lineItem: OrderLineItem = { id: `${item.id}-${Date.now()}`, menu_item_id: item.id, menu_item_name: item.name, quantity: 1, base_price: item.price, selected_modifiers: [], line_item_total: item.price, station: item.station, status: 'new' };
        setCartItems(prev => [...prev, lineItem]);
      }
    } else {
      setSelectedItemForModifier(item);
      setIsModifierModalOpen(true);
    }
  };

  const handleAddToCart = (item: OrderLineItem) => { setCartItems(prev => [...prev, item]); handleCloseModifierModal(); };
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => { if (newQuantity <= 0) handleRemoveItem(itemId); else setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQuantity, line_item_total: (item.base_price + item.selected_modifiers.reduce((s, m) => s + m.price_change, 0)) * newQuantity } : item)); };
  const handleRemoveItem = (itemId: string) => setCartItems(prev => prev.filter(item => item.id !== itemId));
  const handleSendOrderClick = () => { if (!orderType) return; onSendOrder({ type: orderType, details: orderDetails, items: cartItems }); resetOrderFlow(); };
  const handleOpenPaymentModal = (order: Order) => { setSelectedOrderForPayment(order); setIsPaymentModalOpen(true); };
  const handleClosePaymentModal = () => { setIsPaymentModalOpen(false); setSelectedOrderForPayment(null); };
  const handleProcessPaymentClick = (orderId: string, method: PaymentMethod, amountReceived?: number) => { onProcessPayment(orderId, method, amountReceived); handleClosePaymentModal(); };

  if (orderStep === 'TYPE_SELECTION') return <OrderTypeSelection onSelectOrderType={handleSelectOrderType} />;
  if (orderStep === 'DETAIL_SELECTION') {
    if (orderType === 'dine_in') return <TableSelection tables={tables} onSelectTable={handleSelectTable} onBack={handleBackToTypeSelection} />;
    if (orderType === 'delivery') return <DeliveryInfoForm onConfirm={handleConfirmDelivery} onBack={handleBackToTypeSelection} />;
  }

  const readyForBillOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="pos-page">
      <div className="main-pos-view">
        <div className="menu-container">
          <header className="pos-header"><h1>New Order</h1></header>
          <MenuCategoryTabs categories={categories} activeCategoryId={activeCategoryId} onSelectCategory={handleSelectCategory} />
          <div className="menu-grid">
            {menuItems.filter(item => item.category_id === activeCategoryId).map(item => <MenuItemCard key={item.id} item={item} onSelectItem={handleSelectItem} />)}
          </div>
        </div>
        <div className="cart-container">
          <OrderCart cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onSendOrder={handleSendOrderClick} />
        </div>
      </div>
      <div className="billing-view">
        <header className="pos-header"><h2>Ready for Payment</h2></header>
        <div className="billing-list">
          {readyForBillOrders.length === 0 ? <p>No orders ready for payment.</p> : readyForBillOrders.map(order => (
            <div key={order.id} className="billing-item" onClick={() => handleOpenPaymentModal(order)}>
              <span>{order.id} ({order.type === 'dine_in' ? `Table ${order.table_number}` : order.type})</span>
              <strong>{order.total.toLocaleString()} THB</strong>
            </div>
          ))}
        </div>
      </div>
      {isModifierModalOpen && selectedItemForModifier && <ModifierModal item={selectedItemForModifier} onClose={handleCloseModifierModal} onAddToCart={handleAddToCart} />}
      {isPaymentModalOpen && selectedOrderForPayment && <PaymentModal order={selectedOrderForPayment} onClose={handleClosePaymentModal} onProcessPayment={handleProcessPaymentClick} />}
    </div>
  );
};

export default PosPage;
