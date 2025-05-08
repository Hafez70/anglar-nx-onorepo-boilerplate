import {
  patchState,
  signalStore,
  withMethods,
  withState
} from '@ngrx/signals';
import { IProfileEntity } from '../domain/profile.domain';
import { ProfileService } from '../service/profile.service';
import { inject } from '@angular/core';

export interface ProfileState {
  profile: IProfileEntity | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial profile statez
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
  withMethods((store) => {
    const profileService = inject(ProfileService);
    return {
      /**
       * Load the current user's profile
       */
      loadProfile() {
        this.setLoading(true);
        profileService.getMyProfile().subscribe({
          next: (profile: IProfileEntity) => {
            this.setProfile(profile);
          },
          error: (err) => {
            console.error('Error loading zone:', err);
          },
        });
      },
      setLoading(isLoading: boolean) {
        patchState(store, { isLoading });
      },
      setProfile(profile: IProfileEntity | null) {
        patchState(store, { profile, isLoading: false, error: null });
      },
    };
  })
);
