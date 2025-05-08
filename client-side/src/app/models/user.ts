export interface User {
  id?: string | number; // Optional: if your backend returns an ID or requires it for some operations
  userName: string;
  email: string;
  password?: string; // Password is sent for signup/login, but usually not stored directly in frontend state after login
  // Add any other user-related fields
}