import { computed, Inject} from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { IProfileEntity } from '../domain/profile.domain';
import { ProfileService } from '../service/profile.service';


export interface ProfileState {
    profile: IProfileEntity | null;
    isLoading: boolean;
    error: string | null;
  }
  
  /**
   * Initial profile state
   */
  export const initialProfileState: ProfileState = {
    profile: null,
    isLoading: false,
    error: null,
  };
/**
 * Profile store service for managing profile state using NgRx signal store
 */
export const ProfileStore = signalStore(
    { providedIn: 'root' },
    withState(initialProfileState),
    withMethods((store, profileService : ProfileService= Inject(ProfileService)) => ({
    /**
     * Load the current user's profile
     */
    loadProfile(){
        this.setLoading(true);
        profileService.getMyProfile().subscribe({
          next: (profile:IProfileEntity) => {
            this.setProfile(profile);
          },
          error: (err) => {
            console.error('Error loading zone:', err);
          }
        });
    },
    setLoading(isLoading: boolean) {
        patchState(store, { isLoading });
      },
      setProfile(profile: IProfileEntity | null) {
        patchState(store, { profile, isLoading: false, error: null });
      },
  }))
);
