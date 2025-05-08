import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService, Theme } from '../../services/theme.service';

@Component({
  selector: 'ui-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);
  
  // Get all available themes
  themes = this.themeService.themeOrder;

  // Get current theme from the service
  currentTheme = this.themeService.currentTheme;
  
  /**
   * Set the theme based on clicking a specific node
   */
  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  /**
   * Get icon for a theme
   */
  getThemeIcon(theme: Theme): string {
    switch(theme) {
      case 'dark': return 'moon';
      case 'winter': return 'snow';
      case 'fall': return 'leaf';
      case 'summer': return 'sun';
      case 'spring': return 'flower';
      case 'light': return 'brightness';
      default: return '';
    }
  }
}