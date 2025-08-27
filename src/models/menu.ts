/**
 * Represents a single choice within a modifier group.
 * e.g., "Small" or "Large" for a "Size" group.
 */
export interface ModifierOption {
  id: string;
  name: string;
  price_change: number; // e.g., 0 for small, 10 for large
}

/**
 * Represents a group of choices for a menu item.
 * e.g., "Size", "Spice Level", "Toppings"
 */
export interface ModifierGroup {
  id: string;
  name: string; // "Size", "Toppings"
  required: boolean;
  // For single-choice groups (like size), this would be a radio button.
  // For multi-choice groups (like toppings), this would be checkboxes.
  allow_multiple: boolean;
  options: ModifierOption[];
}

/**
 * Represents a single item on the menu.
 * e.g., "Khaomankai", "Iced Tea"
 */
export interface MenuItem {
  id: string;
  sku: string; // e.g., A001
  name: string;
  description?: string;
  price: number; // Base price
  category_id: string;
  modifier_groups?: ModifierGroup[];
  // To which station this item's order should be sent
  station: 'kitchen' | 'tea_station';
  color_on_kds: string; // Hex code for the KDS card
}

/**
 * Represents a category of menu items.
 * e.g., "Khaomankai", "Drinks", "Tea"
 */
export interface MenuCategory {
  id: string;
  name: string;
  sort_order: number;
}
