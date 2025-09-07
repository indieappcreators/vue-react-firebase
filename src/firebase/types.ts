import type { User as FirebaseUser } from 'firebase/auth';

// Re-export Firebase User type for convenience
export type User = FirebaseUser;

// Custom user interface that extends Firebase User if needed
export interface AppUser extends FirebaseUser {
  // Add any custom properties here
  // For example: displayName, photoURL, etc.
}

// Authentication state interface
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

// Login form data interface
export interface LoginFormData {
  email: string;
}

// Sign up form data interface
export interface SignUpFormData {
  email: string;
  password: string;
}
