import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

export type Theme = 'dark' | 'winter' | 'fall' | 'summer' | 'spring' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  
  // Use signal to track the current theme state
  public currentTheme: WritableSignal<Theme> = signal<Theme>('light');

  // Define the theme order
  public readonly themeOrder: Theme[] = ['dark', 'winter', 'fall', 'summer', 'spring', 'light'];

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initTheme();
  }

  initTheme(): void {
    // Check local storage first
    const storedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    if (storedTheme && this.themeOrder.includes(storedTheme)) {
      this.setTheme(storedTheme);
      return;
    }
    
    // If no stored preference, check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.setTheme('dark');
      return;
    }
    
    // Default to light theme
    this.setTheme('light');
    
    // Listen for changes in system preference
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem(this.THEME_KEY)) { // Only update if user hasn't set a preference
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
  }

  /**
   * Set the current theme
   * @param theme The theme to set
   */
  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    
    // Remove all theme classes first
    this.document.body.classList.remove(...this.themeOrder);
    
    // Add the current theme class
    this.document.body.classList.add(theme);
  }

  /**
   * Toggle between light and dark themes
   * @deprecated Use setTheme instead
   */
  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Get the next theme in the order
   */
  getNextTheme(currentTheme: Theme): Theme {
    const currentIndex = this.themeOrder.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % this.themeOrder.length;
    return this.themeOrder[nextIndex];
  }

  /**
   * Get the previous theme in the order
   */
  getPreviousTheme(currentTheme: Theme): Theme {
    const currentIndex = this.themeOrder.indexOf(currentTheme);
    const prevIndex = (currentIndex - 1 + this.themeOrder.length) % this.themeOrder.length;
    return this.themeOrder[prevIndex];
  }
}