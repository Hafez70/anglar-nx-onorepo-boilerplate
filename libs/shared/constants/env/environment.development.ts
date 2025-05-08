import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  
  // API Configuration
  apiUrl: 'http://localhost:3000/api/',
  apiVersion: 'v1',
  
  // Authentication
  authTokenExpiration: 60,  // 60 minutes
  refreshTokenExpiration: 1440,  // 24 hours
  
  // Feature Flags
  features: {
    enableNotifications: true,
    enableDarkMode: true,
    enableAnalytics: false,  // Typically disabled in development
  },
  
  // Logging
  logLevel: 'debug',
  
  // Storage Keys
  storageKeys: {
    authToken: 'auth_token',
    refreshToken: 'refresh_token',
    userPreferences: 'user_preferences',
  },
  
  // Timeouts
  timeouts: {
    apiRequest: 30000,  // 30 seconds
    inactivity: 30,  // 30 minutes
  },
};