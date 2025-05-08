const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Base color themes
        primary: {
          light: '#4f46e5', // Indigo for light mode
          dark: '#818cf8', // Lighter indigo for dark mode
          DEFAULT: '#4f46e5', // Default color for primary (falls back to light mode)
          spring: '#10b981', // Emerald-500
          summer: '#f59e0b', // Amber-500
          fall: '#b45309', // Amber-800
          winter: '#3b82f6', // Blue-500
        },
        background: {
          light: '#ffffff',
          dark: '#1e293b', // Slate-800
          DEFAULT: '#ffffff', // Default color for background (falls back to light mode)
          spring: '#ecfdf5', // Emerald-50
          summer: '#fff7ed', // Amber-50
          fall: '#fef3c7', // Amber-100
          winter: '#eff6ff', // Blue-50
        },
        surface: {
          light: '#f8fafc', // Slate-50
          dark: '#334155', // Slate-700
          DEFAULT: '#f8fafc', // Default color for surface (falls back to light mode)
          spring: '#d1fae5', // Emerald-100
          summer: '#ffedd5', // Amber-100
          fall: '#fde68a', // Amber-200
          winter: '#bfdbfe', // Blue-200
        },
        text: {
          light: '#0f172a', // Slate-900
          dark: '#f1f5f9', // Slate-100
          DEFAULT: '#0f172a', // Default color for text (falls back to light mode)
          spring: '#064e3b', // Emerald-900
          summer: '#7c2d12', // Amber-900
          fall: '#78350f', // Amber-950
          winter: '#1e3a8a', // Blue-900
        },
        // Additional colors that might be useful across components
        border: {
          light: '#e2e8f0', // Slate-200
          dark: '#475569', // Slate-600
          DEFAULT: '#e2e8f0', // Default color for borders
          spring: '#6ee7b7', // Emerald-300
          summer: '#fcd34d', // Amber-300
          fall: '#fbbf24', // Amber-400
          winter: '#60a5fa', // Blue-400
        },
        error: {
          light: '#dc3545',
          dark: '#ff6b6b',
          DEFAULT: '#dc3545',
          spring: '#ef4444', // Red-500
          summer: '#b91c1c', // Red-700
          fall: '#991b1b', // Red-800
          winter: '#dc2626', // Red-600
        },
        success: {
          light: '#28a745',
          dark: '#4ade80',
          DEFAULT: '#28a745',
          spring: '#10b981', // Emerald-500
          summer: '#059669', // Emerald-600
          fall: '#047857', // Emerald-700
          winter: '#34d399', // Emerald-400
        },
        warning: {
          light: '#ffc107',
          dark: '#fcd34d',
          DEFAULT: '#ffc107',
          spring: '#fbbf24', // Amber-400
          summer: '#f59e0b', // Amber-500
          fall: '#d97706', // Amber-600
          winter: '#fbbf24', // Amber-400
        },
        // Theme-specific accent colors
        accent: {
          spring: '#8b5cf6', // Violet-500
          summer: '#f43f5e', // Rose-500
          fall: '#d97706', // Amber-600
          winter: '#0ea5e9', // Sky-500
          light: '#6366f1', // Indigo-500
          dark: '#a78bfa', // Violet-400
          DEFAULT: '#6366f1', // Default accent color
        },
        // Theme-specific secondary colors
        secondary: {
          spring: '#4ade80', // Green-400
          summer: '#fb923c', // Orange-400
          fall: '#ea580c', // Orange-600
          winter: '#93c5fd', // Blue-300
          light: '#a855f7', // Purple-500
          dark: '#c4b5fd', // Violet-300
          DEFAULT: '#a855f7', // Default secondary color
        },
      },
      // Theme-specific shadows
      boxShadow: {
        spring:
          '0 4px 6px -1px rgb(16 185 129 / 0.1), 0 2px 4px -2px rgb(16 185 129 / 0.1)',
        summer:
          '0 4px 6px -1px rgb(245 158 11 / 0.1), 0 2px 4px -2px rgb(245 158 11 / 0.1)',
        fall: '0 4px 6px -1px rgb(180 83 9 / 0.1), 0 2px 4px -2px rgb(180 83 9 / 0.1)',
        winter:
          '0 4px 6px -1px rgb(59 130 246 / 0.1), 0 2px 4px -2px rgb(59 130 246 / 0.1)',
      },
      // Theme-specific gradients
      backgroundImage: {
        'spring-gradient': 'linear-gradient(to right, #10b981, #8b5cf6)',
        'summer-gradient': 'linear-gradient(to right, #f59e0b, #f43f5e)',
        'fall-gradient': 'linear-gradient(to right, #b45309, #ea580c)',
        'winter-gradient': 'linear-gradient(to right, #3b82f6, #0ea5e9)',
        'light-gradient': 'linear-gradient(to right, #4f46e5, #a855f7)',
        'dark-gradient': 'linear-gradient(to right, #818cf8, #c4b5fd)',
      },
    },
  },
  plugins: [],
};
