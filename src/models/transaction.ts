import { Order } from './order';

export type PaymentMethod = 'cash' | 'qr_transfer';

export type TransactionStatus = 'completed' | 'refunded';

/**
 * Represents a financial transaction associated with an order.
 * A transaction is created when an order is successfully paid for.
 */
export interface Transaction {
  id: string; // Firestore document ID
  order_id: string; // The ID of the order being paid for

  amount: number; // The final amount paid
  method: PaymentMethod;
  status: TransactionStatus;

  // The employee who processed the payment
  processed_by_user_id: string;

  // The employee who approved a refund, if applicable
  refunded_by_user_id?: string;

  created_at: number; // Unix timestamp
  refunded_at?: number;
}
