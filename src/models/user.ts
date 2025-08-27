export type UserRole = 'waitstaff' | 'chef' | 'tea_maker' | 'manager';

/**
 * Represents an employee user in the system.
 */
export interface User {
  id: string; // Firestore document ID
  name: string;

  /**
   * The 4-6 digit PIN for login.
   * IMPORTANT: This should be stored as a hash in a real production environment,
   * not as plain text. For this project, we'll assume a secure comparison mechanism.
   */
  pin: string;

  role: UserRole;
  is_active: boolean; // To easily disable a user's access
}

/**
 * Represents a log of user sessions.
 */
export interface SessionLog {
  id: string;
  user_id: string;
  user_name: string;
  action: 'login' | 'logout';
  timestamp: number; // Unix timestamp
}
