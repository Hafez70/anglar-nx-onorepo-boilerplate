import { Pipe, PipeTransform, inject, OnDestroy } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { Subject, takeUntil } from 'rxjs';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Changed to impure so it updates when translations are loaded
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private translationService = inject(TranslationService);
  private destroy$ = new Subject<void>();
  private lastKey = '';
  private lastValue = '';
  
  constructor() {
    // Subscribe to translation changes
    this.translationService.translationsLoaded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Re-translate the last key when translations change
        if (this.lastKey) {
          this.lastValue = this.translationService.translate(this.lastKey);
        }
      });
  }
  
  transform(key: string): string {
    this.lastKey = key;
    this.lastValue = this.translationService.translate(key);
    return this.lastValue;
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}