import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@shared/env';
import { IProfileEntity } from '../domain/profile.domain';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'My/profile';

  /**
   * Fetches the current user's Profile from the API
   * @returns An Observable of Profile containing zone data
   */
  getMyProfile(): Observable<IProfileEntity> {
    return this.http.get<IProfileEntity>(`${this.apiUrl}`);
  }

  /**
   * Update the current user's profile
   * @param profile The profile data to update
   */
  updateProfile(profile: Partial<IProfileEntity>) {
    return this.http.patch<IProfileEntity>(this.apiUrl, profile);
  }
}
