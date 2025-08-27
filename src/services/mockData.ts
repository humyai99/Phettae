import { Order, Table, MenuCategory, MenuItem } from '../models';

//==============================================================================
// MOCK MENU DATA
//==============================================================================

export const mockCategories: MenuCategory[] = [
  { id: 'cat-1', name: 'ข้าวมันไก่', sort_order: 1 },
  { id: 'cat-2', name: 'เครื่องดื่ม', sort_order: 2 },
  { id: 'cat-3', name: 'ชา', sort_order: 3 },
];

export const mockMenuItems: MenuItem[] = [
  // ข้าวมันไก่
  {
    id: 'km-1',
    sku: 'A001',
    name: 'ข้าวมันไก่ธรรมดา',
    price: 50,
    category_id: 'cat-1',
    station: 'kitchen',
    color_on_kds: '#FFC107',
    modifier_groups: [
      {
        id: 'mod-group-1',
        name: 'ขนาด',
        required: true,
        allow_multiple: false,
        options: [
          { id: 'mod-opt-1a', name: 'ธรรมดา', price_change: 0 },
          { id: 'mod-opt-1b', name: 'พิเศษ', price_change: 10 },
        ]
      },
      {
        id: 'mod-group-2',
        name: 'เพิ่มเติม',
        required: false,
        allow_multiple: true,
        options: [
          { id: 'mod-opt-2a', name: 'ไม่เอาหนัง', price_change: 0 },
          { id: 'mod-opt-2b', name: 'ไม่เอากระดูก', price_change: 0 },
          { id: 'mod-opt-2c', name: 'ตับ', price_change: 10 },
          { id: 'mod-opt-2d', name: 'ข้อไก่', price_change: 10 },
        ]
      },
      {
        id: 'mod-group-3',
        name: 'ความเผ็ด (น้ำจิ้ม)',
        required: false,
        allow_multiple: false,
        options: [
          { id: 'mod-opt-3a', name: 'เผ็ดน้อย', price_change: 0 },
          { id: 'mod-opt-3b', name: 'เผ็ดปกติ', price_change: 0 },
          { id: 'mod-opt-3c', name: 'เผ็ดมาก', price_change: 0 },
        ]
      }
    ]
  },
  { id: 'km-2', sku: 'A002', name: 'ข้าวมันไก่สิงคโปร์', price: 60, category_id: 'cat-1', station: 'kitchen', color_on_kds: '#FFC107' },
  { id: 'km-3', sku: 'A003', name: 'ข้าวมันไก่ทอด', price: 60, category_id: 'cat-1', station: 'kitchen', color_on_kds: '#FF9800' },
  { id: 'km-4', sku: 'A004', name: 'ข้าวมันตับไก่', price: 60, category_id: 'cat-1', station: 'kitchen', color_on_kds: '#FFC107' },
  { id: 'km-5', sku: 'A005', name: 'ข้าวยำไก่แซ่บ', price: 60, category_id: 'cat-1', station: 'kitchen', color_on_kds: '#F44336' },

  // เครื่องดื่ม
  {
    id: 'dr-1',
    sku: 'B001',
    name: 'น้ำเปล่า',
    price: 10,
    category_id: 'cat-2',
    station: 'kitchen',
    color_on_kds: '#2196F3',
  },
  {
    id: 'dr-2',
    sku: 'B002',
    name: 'โค้ก',
    price: 20,
    category_id: 'cat-2',
    station: 'kitchen',
    color_on_kds: '#9E9E9E',
    modifier_groups: [
      {
        id: 'mod-group-4',
        name: 'ขนาด',
        required: true,
        allow_multiple: false,
        options: [
          { id: 'mod-opt-4a', name: 'แก้วเล็ก', price_change: 0 },
          { id: 'mod-opt-4b', name: 'แก้วใหญ่', price_change: 5 },
        ]
      }
    ]
  },

  // ชา
  {
    id: 'tea-1',
    sku: 'C001',
    name: 'ชานมไข่มุก',
    price: 40,
    category_id: 'cat-3',
    station: 'tea_station',
    color_on_kds: '#4CAF50',
    modifier_groups: [
       {
        id: 'mod-group-5',
        name: 'ขนาด',
        required: true,
        allow_multiple: false,
        options: [
          { id: 'mod-opt-5a', name: 'แก้วเล็ก', price_change: 0 },
          { id: 'mod-opt-5b', name: 'แก้วใหญ่', price_change: 10 },
        ]
      },
      {
        id: 'mod-group-6',
        name: 'ท็อปปิ้ง',
        required: false,
        allow_multiple: true,
        options: [
          { id: 'mod-opt-6a', name: 'บุกบราวชูก้า', price_change: 5 },
          { id: 'mod-opt-6b', name: 'บุกไข่มุก', price_change: 5 },
        ]
      }
    ]
  }
];


//==============================================================================
// MOCK ORDER & TABLE DATA (from previous step)
//==============================================================================
const now = Date.now();

export const mockOrders: Order[] = [
  {
    id: '#A001',
    firestore_id: 'order-1',
    type: 'dine_in',
    status: 'new',
    table_number: 5,
    items: [
      {
        id: 'li-1-1',
        menu_item_id: 'km-1',
        menu_item_name: 'ข้าวมันไก่ต้ม',
        quantity: 1,
        base_price: 50,
        selected_modifiers: [
          { group_id: 'size', group_name: 'ขนาด', option_id: 'size-2', option_name: 'พิเศษ', price_change: 10 },
          { group_id: 'extra', group_name: 'เพิ่มเติม', option_id: 'extra-1', option_name: 'ไม่เอาหนัง', price_change: 0 }
        ],
        line_item_total: 60,
        station: 'kitchen',
        status: 'new'
      },
      {
        id: 'li-1-2',
        menu_item_id: 'tea-1',
        menu_item_name: 'ชานมไข่มุก',
        quantity: 1,
        base_price: 40,
        selected_modifiers: [
          { group_id: 'topping', group_name: 'ท็อปปิ้ง', option_id: 'top-1', option_name: 'บุกไข่มุก', price_change: 5 }
        ],
        line_item_total: 45,
        station: 'tea_station',
        status: 'new'
      }
    ],
    subtotal: 105,
    discount: 0,
    total: 105,
    timestamps: { created_at: now - 60000 * 2 }, // 2 minutes ago
    sla_exceeded: false,
    created_by_user_id: 'user-waitstaff-1'
  },
  {
    id: '#A002',
    firestore_id: 'order-2',
    type: 'takeaway',
    status: 'in_progress',
    items: [
      {
        id: 'li-2-1',
        menu_item_id: 'km-2',
        menu_item_name: 'ข้าวมันไก่ทอด',
        quantity: 2,
        base_price: 60,
        selected_modifiers: [],
        line_item_total: 120,
        station: 'kitchen',
        status: 'new'
      }
    ],
    subtotal: 120,
    discount: 0,
    total: 120,
    timestamps: { created_at: now - 60000 * 6, in_progress_at: now - 60000 * 3 }, // 6 mins ago, started 3 mins ago
    sla_exceeded: true, // This one has exceeded the 5 min SLA
    created_by_user_id: 'user-waitstaff-1'
  },
  {
    id: '#A003',
    firestore_id: 'order-3',
    type: 'delivery',
    status: 'new',
    delivery_info: {
      platform: 'Grab',
      order_number: 'GF-12345'
    },
    items: [
      {
        id: 'li-3-1',
        menu_item_id: 'tea-2',
        menu_item_name: 'ชาเขียวมัทฉะ',
        quantity: 1,
        base_price: 50,
        selected_modifiers: [],
        line_item_total: 50,
        station: 'tea_station',
        status: 'new'
      }
    ],
    subtotal: 50,
    discount: 0,
    total: 50,
    timestamps: { created_at: now - 60000 * 1 }, // 1 minute ago
    sla_exceeded: false,
    created_by_user_id: 'user-waitstaff-2'
  }
];

export const mockTables: Table[] = [
  { id: 1, status: 'available' },
  { id: 2, status: 'available' },
  { id: 3, status: 'occupied', current_order_id: 'order-x' },
  { id: 4, status: 'available' },
  { id: 5, status: 'occupied', current_order_id: '#A001' },
  { id: 6, status: 'available' },
  { id: 7, status: 'available' },
  { id: 8, status: 'needs_cleaning' },
  { id: 9, status: 'available' },
  { id: 10, status: 'available' },
];
