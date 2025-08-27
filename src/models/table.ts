export type TableStatus = 'available' | 'occupied' | 'needs_cleaning';

/**
 * Represents a single table in the restaurant.
 */
export interface Table {
  id: number; // The table number, e.g., 1, 2, 10
  status: TableStatus;

  // The ID of the order currently associated with this table.
  // This will be null if the table is available.
  current_order_id?: string;
}
