const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const sharedConfig = require('../../libs/shared/ui/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Extend the shared configuration
  presets: [sharedConfig],
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  // Any user-panel specific customizations can go here,
  // they will be merged with the shared config
  theme: {
    extend: {},
  },
  plugins: [],
};
