import { inject, Injectable } from '@angular/core';
import { ProfileStore } from './profile.store';
import { ProfileService } from '../service/profile.service';
import { IProfileEntity } from '../domain/profile.domain';

/**
 * Profile Facade Service
 *
 * This service acts as a facade to encapsulate the profile feature
 * and provide a clean API for other libraries and applications to use.
 */
@Injectable({
  providedIn: 'root',
})
export class ProfileFacade {
  private profileStore = inject(ProfileStore);
  readonly profile = this.profileStore.profile;
  readonly loading = this.profileStore.isLoading;

  fetchMyProfile(): void {
    this.profileStore.loadProfile();
  }

  setMyProfile(profile: IProfileEntity | null): void {
    this.profileStore.setProfile(profile);
  }

  getMyProfile(): IProfileEntity | null {
    return this.profileStore.profile();
  }
}
