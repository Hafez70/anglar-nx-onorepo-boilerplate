import { Injectable, inject } from '@angular/core';
import { IZoneEntity } from '../domain/zone.domain';
import { ZoneStore } from './zone.store';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoneFacade {
  private store = inject(ZoneStore);
  
  // Observable selectors
  zone$ = toObservable(this.store.zone);
  isLoading$ = toObservable(this.store.isLoading);
  error$ = toObservable(this.store.error);

  // Signal selectors
  readonly zone = this.store.zone;
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;

  // Public methods for other libraries to use
  getMyZone(): Observable<IZoneEntity | null> {
    this.store.setLoading(true);
    
    // In a real implementation, this would call an API
    // This is a mock implementation
    return of(this.store.zone()).pipe(
      tap(zone => {
        if (!zone) {
          this.store.setError(`Zone not found`);
        }
        this.store.setLoading(false);
      }),
      catchError(error => {
        this.store.setError(error.message || 'Failed to get zone');
        return of(null);
      })
    );
  }

  clearError(): void {
    this.store.clearError();
  }
}