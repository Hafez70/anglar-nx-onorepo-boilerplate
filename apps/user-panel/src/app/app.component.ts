import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslationService, HeaderComponent } from '@shared/ui';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ZoneStore } from '@zone';
@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent  {
  zoneStore = inject(ZoneStore)
  title = 'APP.TITLE';
  isLoading = signal(true);

  constructor(public translationService: TranslationService) {
    if (this.translationService.areTranslationsLoaded()) {
      this.isLoading.set(false);
    }
    toSignal(
      this.translationService.waitForTranslationsLoaded().pipe(tap(() => {
        this.isLoading.set(false);
      }
      )),
      { initialValue: true }
    );
  }
}
