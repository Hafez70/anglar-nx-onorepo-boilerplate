import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { Realm } from '../domain/realm.domain';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';

// Define the state interface
export interface RealmState {
  realms: Realm[];
  selectedRealmId: number | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: RealmState = {
  realms: [],
  selectedRealmId: null,
  loading: false,
  error: null
};

// Create the store with NgRx Signal Store
export const RealmStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  
  // Add computed properties
  withComputed((state) => ({
    selectedRealm: computed(() => {
      return state.selectedRealmId() !== null
        ? state.realms().find((realm:Realm) => realm.id === state.selectedRealmId())
        : null;
    }),
    
    // Get all realms
    allRealms: computed(() => state.realms()),
    
    // Status indicators
    isLoading: computed(() => state.loading()),
    hasError: computed(() => !!state.error()),
    errorMessage: computed(() => state.error())
  })),
  
  // Add methods for state changes
  withMethods((state) => {
    // Simulating a service that would be injected in a real app
    // const realmService = inject(RealmService);
    
    return {
      // Load all realms
      loadRealms: rxMethod<void>(pipe(
        tap(() => {
          patchState(state, { loading: true, error: null });
          
          // In a real application, you would call an API service here
          // This is a mock implementation
          setTimeout(() => {
            const mockRealms = [new Realm({ id: 1, name: 'school1' })];
            
            patchState(state, { 
              realms: mockRealms, 
              loading: false 
            });
          }, 500);
        })
      )),
      
      // Select a realm
      selectRealm(realmId: number): void {
        patchState(state, { selectedRealmId: realmId });
      },
      
      // Add a new realm
      addRealm(realm: Realm): void {
        patchState(state, (state:RealmState) => ({
          realms: [...state.realms, realm]
        }));
      },
      
      // Update an existing realm
      updateRealm(updatedRealm: Realm): void {
        patchState(state, (state:RealmState) => ({
          realms: state.realms.map((realm: Realm) => 
            realm.id === updatedRealm.id ? updatedRealm : realm
          )
        }));
      },
      
      // Delete a realm
      deleteRealm(realmId: number): void {
        patchState(state, (state:RealmState) => ({
          realms: state.realms.filter((realm: Realm) => realm.id !== realmId)
        }));
      },
      
      // Reset state
      resetState(): void {
        patchState(state, initialState);
      },
      
      // Handle errors
      setError(error: string): void {
        patchState(state, { error, loading: false });
      }
    };
  })
);