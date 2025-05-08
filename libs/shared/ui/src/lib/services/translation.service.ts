import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';

export interface TranslationSet {
  [key: string]: TranslationSet;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translationsState = signal<TranslationSet>({});
  private currentLangState = signal<string>(this.getInitialLanguage());
  private loadingState = signal<boolean>(true);
  
  readonly translations = computed(() => this.translationsState());
  readonly currentLang = computed(() => this.currentLangState());
  readonly isRtl = computed(() => this.currentLangState() === 'fa');
  readonly isLoading = computed(() => this.loadingState());
  
  // Subject to notify components when translations are loaded
  private translationsLoaded = new BehaviorSubject<boolean>(false);
  readonly translationsLoaded$ = this.translationsLoaded.asObservable();
  
  constructor(private http: HttpClient) {
    // Load the default language translations
    this.loadTranslations(this.currentLangState()).subscribe();
  }
  
  private getInitialLanguage(): string {
    // Try to load language from localStorage if it exists
    const savedLang = localStorage.getItem('user-panel-language');
    return savedLang || 'fa'; // Farsi as default
  }
  
  loadTranslations(lang: string): Observable<TranslationSet> {
    // Set loading state to true at the start
    this.loadingState.set(true);
    
    // Use the default language (fa) if not provided
    const language = lang || localStorage.getItem('user-panel-language') ||'fa';
    
    // Import translation file directly from assets without HTTP call
    return this.http.get<TranslationSet>(`assets/i18n/${language}.json`).pipe(
      tap(translations => {
        this.translationsState.set(translations);
        this.currentLangState.set(language);
        localStorage.setItem('user-panel-language', language);
        document.documentElement.dir = this.isRtl() ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
        // Notify that translations are loaded
        this.translationsLoaded.next(true);
      }),
      catchError(error => {
        console.error(`Failed to load translations for ${language}:`, error);
        // If there's an error loading the requested language, try to load Farsi as fallback
        if (language !== 'fa') {
          console.log('Falling back to Farsi (fa) translations');
          return this.http.get<TranslationSet>('assets/i18n/fa.json').pipe(
            tap(translations => {
              this.translationsState.set(translations);
              this.currentLangState.set('fa');
              localStorage.setItem('user-panel-language', 'fa');
              document.documentElement.dir = 'rtl';
              document.documentElement.lang = 'fa';
              // Notify that translations are loaded
              this.translationsLoaded.next(true);
            }),
            catchError(fallbackError => {
              console.error('Failed to load fallback translations:', fallbackError);
              this.translationsLoaded.next(true); // Still notify even though we failed
              return of({} as TranslationSet);
            })
          );
        }
        this.translationsLoaded.next(true); // Still notify even though we failed
        return of({} as TranslationSet);
      }),
      finalize(() => {
        // Mark loading as complete
        this.loadingState.set(false);
      })
    );
  }
  
  setLanguage(lang: string): Observable<TranslationSet> {
    return this.loadTranslations(lang);
  }
  
  translate(key: string): string {
    const keys = key.split('.');
    let result: TranslationSet = this.translationsState();
    
    // If we're still loading and don't have translations yet, return the key
    if (this.loadingState() && Object.keys(result).length === 0) {
      return key;
    }
    
    for (const k of keys) {
      if (typeof result !== 'object' || !(k in result)) {
        return key; // Return key if we can't navigate further
      }
      result = result[k] as TranslationSet;
    }
    
    return typeof result === 'string' ? result : key;
  }
  
  getCurrentLanguage(): string {
    return this.currentLangState();
  }
  
  /**
   * Checks if translations have been loaded
   * @returns true if translations are loaded, false otherwise
   */
  areTranslationsLoaded(): boolean {
    return this.translationsLoaded.value;
  }
  
  /**
   * Waits for translations to be loaded
   * @returns An Observable that emits true when translations are loaded
   */
  waitForTranslationsLoaded(): Observable<boolean> {
    // If translations are already loaded, return immediately
    if (this.translationsLoaded.value) {
      return of(true);
    }
    // Otherwise, wait for the next emission
    return this.translationsLoaded$;
  }
}