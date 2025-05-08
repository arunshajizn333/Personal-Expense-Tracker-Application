export interface User {
  userName: string;  // User's chosen username
  email: string;     // User's email address
  password: string;  // User's password (may need to be hashed before sending to the backend)
  rememberMe?: boolean; // Whether the user wants to be remembered on subsequent logins
  lastActivity?: Date;  // Optional field for tracking the last time the user was active
}
