export interface Environment {
  production: boolean;
  
  // API Configuration
  apiUrl: string;
  apiVersion: string;
  
  // Authentication
  authTokenExpiration: number;  // in minutes
  refreshTokenExpiration: number;  // in minutes
  
  // Feature Flags
  features: {
    enableNotifications: boolean;
    enableDarkMode: boolean;
    enableAnalytics: boolean;
  };
  
  // Logging
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  
  // Storage Keys
  storageKeys: {
    authToken: string;
    refreshToken: string;
    userPreferences: string;
  };
  
  // Timeouts
  timeouts: {
    apiRequest: number;  // in milliseconds
    inactivity: number;  // in minutes
  };
}