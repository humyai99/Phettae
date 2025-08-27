import { MenuItem } from './menu';

/**
 * Represents a modifier that was selected for an order item.
 * e.g., { groupName: "Size", optionName: "Large", price_change: 10 }
 */
export interface SelectedModifier {
  group_id: string;
  group_name: string;
  option_id: string;
  option_name: string;
  price_change: number;
}

/**
 * Represents a single line item in an order.
 * e.g., 2 x "Khaomankai" with "Special" and "No Skin".
 */
export interface OrderLineItem {
  id: string; // Unique ID for this line item within the order
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  base_price: number; // Price of the item before modifiers
  selected_modifiers: SelectedModifier[];
  line_item_total: number; // quantity * (base_price + sum of modifier price_changes)
  notes?: string;
  status: 'new' | 'cancelled' | 'refired';
  station: 'kitchen' | 'tea_station';
}

export type OrderType = 'dine_in' | 'takeaway' | 'delivery';
export type OrderStatus = 'new' | 'in_progress' | 'ready' | 'closed' | 'cancelled';
export type DeliveryPlatform = 'Shopee' | 'Grab' | 'LINE MAN';

/**
 * The main Order object.
 */
export interface Order {
  id: string; // The human-readable queue number, e.g., #A001
  firestore_id?: string; // The actual document ID in Firestore

  type: OrderType;
  status: OrderStatus;

  // Details specific to the order type
  table_number?: number; // For 'dine_in'
  delivery_info?: {
    platform: DeliveryPlatform;
    order_number: string;
  };

  items: OrderLineItem[];

  // Financials
  subtotal: number;
  discount: number;
  total: number;

  // Timestamps to track the order lifecycle and calculate SLA
  timestamps: {
    created_at: number; // Unix timestamp
    in_progress_at?: number;
    ready_at?: number;
    closed_at?: number;
    cancelled_at?: number;
  };

  // To track performance
  sla_exceeded: boolean;

  // Reference to the user who created the order
  created_by_user_id: string;
}
