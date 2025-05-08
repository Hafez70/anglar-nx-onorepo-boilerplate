import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  
  // API Configuration
  apiUrl: 'https://api.realm-of-tasks.com/api',
  apiVersion: 'v1',
  
  // Authentication
  authTokenExpiration: 30,  // 30 minutes (more strict in production)
  refreshTokenExpiration: 720,  // 12 hours
  
  // Feature Flags
  features: {
    enableNotifications: true,
    enableDarkMode: true,
    enableAnalytics: true,  // Enabled in production
  },
  
  // Logging
  logLevel: 'error',  // Only log errors in production
  
  // Storage Keys
  storageKeys: {
    authToken: 'auth_token',
    refreshToken: 'refresh_token',
    userPreferences: 'user_preferences',
  },
  
  // Timeouts
  timeouts: {
    apiRequest: 15000,  // 15 seconds
    inactivity: 15,  // 15 minutes
  },
};