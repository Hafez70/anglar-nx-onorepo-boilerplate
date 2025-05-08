import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';


@Component({
  selector: 'ui-header',
  standalone: true,
  imports: [CommonModule, TranslatePipe, LanguageSelectorComponent, ThemeToggleComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private translationService = inject(TranslationService);
  
  isMenuOpen = signal<boolean>(false);
  
  // Use the translation service's isRtl signal
  isRtl = this.translationService.isRtl;

  ngOnInit(): void {
    // Ensure any document clicks outside the menu will close it
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.header-menu') && !target.closest('.burger-menu-button')) {
        this.isMenuOpen.set(false);
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }
}