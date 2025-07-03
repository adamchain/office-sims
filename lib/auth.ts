import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// For web, we'll use localStorage as a fallback
const storage = {
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  
  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

export interface User {
  id: string;
  phoneNumber: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

class AuthService {
  private static instance: AuthService;
  private user: User | null = null;
  private listeners: ((state: AuthState) => void)[] = [];

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const userData = await storage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  }

  private notifyListeners() {
    const state: AuthState = {
      user: this.user,
      isLoading: false,
      isAuthenticated: !!this.user,
    };
    this.listeners.forEach(listener => listener(state));
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    // Immediately call with current state
    listener({
      user: this.user,
      isLoading: false,
      isAuthenticated: !!this.user,
    });

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  async sendVerificationCode(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate sending SMS (in production, this would call your SMS service)
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store the code temporarily (in production, this would be server-side)
      await storage.setItem(`verification_code_${phoneNumber}`, code);
      await storage.setItem(`verification_code_timestamp_${phoneNumber}`, Date.now().toString());
      
      // For demo purposes, we'll show the code in console
      console.log(`Verification code for ${phoneNumber}: ${code}`);
      
      // In production, you would integrate with SMS services like:
      // - Twilio
      // - AWS SNS
      // - Firebase Auth
      // - Supabase Auth with SMS
      
      return {
        success: true,
        message: `Verification code sent to ${phoneNumber}. Check console for demo code.`
      };
    } catch (error) {
      console.error('Error sending verification code:', error);
      return {
        success: false,
        message: 'Failed to send verification code. Please try again.'
      };
    }
  }

  async verifyCode(phoneNumber: string, code: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      // Get stored code and timestamp
      const storedCode = await storage.getItem(`verification_code_${phoneNumber}`);
      const timestamp = await storage.getItem(`verification_code_timestamp_${phoneNumber}`);
      
      if (!storedCode || !timestamp) {
        return {
          success: false,
          message: 'No verification code found. Please request a new code.'
        };
      }

      // Check if code is expired (5 minutes)
      const codeAge = Date.now() - parseInt(timestamp);
      if (codeAge > 5 * 60 * 1000) {
        await storage.removeItem(`verification_code_${phoneNumber}`);
        await storage.removeItem(`verification_code_timestamp_${phoneNumber}`);
        return {
          success: false,
          message: 'Verification code has expired. Please request a new code.'
        };
      }

      // Verify code
      if (storedCode !== code) {
        return {
          success: false,
          message: 'Invalid verification code. Please try again.'
        };
      }

      // Clean up verification code
      await storage.removeItem(`verification_code_${phoneNumber}`);
      await storage.removeItem(`verification_code_timestamp_${phoneNumber}`);

      // Create or get user
      let user = await this.getUserByPhone(phoneNumber);
      if (!user) {
        user = await this.createUser(phoneNumber);
      } else {
        user.lastLoginAt = new Date().toISOString();
        await this.saveUser(user);
      }

      this.user = user;
      await storage.setItem('user', JSON.stringify(user));
      this.notifyListeners();

      return {
        success: true,
        message: 'Successfully signed in!',
        user
      };
    } catch (error) {
      console.error('Error verifying code:', error);
      return {
        success: false,
        message: 'Failed to verify code. Please try again.'
      };
    }
  }

  private async getUserByPhone(phoneNumber: string): Promise<User | null> {
    try {
      const usersData = await storage.getItem('users');
      if (!usersData) return null;
      
      const users: User[] = JSON.parse(usersData);
      return users.find(u => u.phoneNumber === phoneNumber) || null;
    } catch (error) {
      console.error('Error getting user by phone:', error);
      return null;
    }
  }

  private async createUser(phoneNumber: string): Promise<User> {
    const user: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      phoneNumber,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    await this.saveUser(user);
    return user;
  }

  private async saveUser(user: User) {
    try {
      const usersData = await storage.getItem('users');
      let users: User[] = usersData ? JSON.parse(usersData) : [];
      
      const existingIndex = users.findIndex(u => u.id === user.id);
      if (existingIndex >= 0) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }
      
      await storage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  async signOut() {
    this.user = null;
    await storage.removeItem('user');
    this.notifyListeners();
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.user;
  }
}

export const authService = AuthService.getInstance();