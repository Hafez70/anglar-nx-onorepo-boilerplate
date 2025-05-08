import { environment as devEnvironment } from './environment.development';
import { environment as prodEnvironment } from './environment.production';

// Automatically detect environment based on Angular's build system
// This will use the environment variables injected during build time
declare const ngDevMode: boolean | undefined;
declare const process: { env: { [key: string]: string } };

// For standalone Angular apps, we can detect the environment during runtime
// by checking if we're in development mode
let isDevMode = true;

// Try to detect Angular's development mode
if (typeof ngDevMode === 'undefined' || ngDevMode === false) {
  isDevMode = false;
} else if (typeof process !== 'undefined' && process.env && process.env['NODE_ENV'] === 'production') {
  isDevMode = false;
}

// Export the appropriate environment based on detected mode
export const environment = isDevMode ? devEnvironment : prodEnvironment;

// Re-export types
export type { Environment } from './environment.interface';