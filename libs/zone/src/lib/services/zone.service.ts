import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IZoneEntity } from '../domain/zone.domain';
import { environment } from '@shared/env';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Fetches the current user's zone from the API
   * @returns An Observable of IZoneEntity containing zone data
   */
  getMyZone(): Observable<IZoneEntity> {
    return this.http.get<IZoneEntity>(`${this.apiUrl}My/zone`);
  }
}