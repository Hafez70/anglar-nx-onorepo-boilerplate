import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { ThemeService } from '@shared/ui';
import { IZoneEntity } from '../domain/zone.domain';
import { ZoneService } from '../services/zone.service';

export interface ZoneState {
  zone: IZoneEntity| null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ZoneState = {
  zone: null,
  isLoading: false,
  error: null
};

export const ZoneStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  withMethods((store, zoneService = inject(ZoneService),themeService = inject(ThemeService)) => ({
    setZones(zone: IZoneEntity) {
      themeService.setTheme(zone?.theme ?? 'light');
      patchState(store, { zone, isLoading: false, error: null });
    },

    // Load my zone from API
    loadMyZone() {
      this.setLoading(true );
      zoneService.getMyZone().subscribe({
        next: (zoneEntity) => {
          this.setZones(zoneEntity);
        },
        error: (err) => {
          console.error('Error loading zone:', err);
          this.setError('Failed to load zone data');
        }
      });
    },
    // set zones
  
    // Set loading state
    setLoading(isLoading: boolean) {
      patchState(store, { isLoading });
    },

    // Set error
    setError(error: string) {
      patchState(store, { error, isLoading: false });
    },

    // Clear error
    clearError() {
      patchState(store, { error: null });
    }
  })),
  withHooks((store) => ({
    onInit: () => {
      // Initialize the store or perform any setup actions
      console.log('ZoneStore initialized');
      // Load zones when the store initializes
      store.loadMyZone();
    }
  }))

);