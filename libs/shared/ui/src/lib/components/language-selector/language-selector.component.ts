import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'ui-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent {
  private translationService = inject(TranslationService);
  
  // Use the signal directly
  currentLanguage = this.translationService.currentLang;

  toggleLanguage(): void {
    const newLang = this.currentLanguage() === 'fa' ? 'en' : 'fa';
    this.translationService.setLanguage(newLang).subscribe();
  }

  switchToFarsi(): void {
    if (this.currentLanguage() !== 'fa') {
      this.translationService.setLanguage('fa').subscribe();
    }
  }

  switchToEnglish(): void {
    if (this.currentLanguage() !== 'en') {
      this.translationService.setLanguage('en').subscribe();
    }
  }
}