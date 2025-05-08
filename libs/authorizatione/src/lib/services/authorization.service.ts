import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ProfileFacade } from '@profile';
import { environment } from '@shared/env';
import { AuthResponse, LoginCredentials } from '../models/authorization.model';
import { TokenService } from './token.service';


@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private readonly profileFacade = inject(ProfileFacade);
  private readonly tokenService = inject(TokenService);
  private readonly authUrl = `${environment.apiUrl}Account`;
  
  // Replace BehaviorSubjects with signals
  private isAuthenticatedState = signal<boolean>(false);
  
  // Create computed signals for public consumption
  readonly currentUserProfile = computed(() => this.profileFacade.profile());
  readonly isAuthenticated = computed(() => this.isAuthenticatedState());

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    if (this.tokenService.hasValidToken()) {
      // Set authenticated state immediately if token exists
      this.isAuthenticatedState.set(true);
      
      // Then validate the token asynchronously
      this.validateToken().subscribe({
        next: (isValid) => {
          if (isValid) {
            this.loadUserFromToken();
          } else {
            this.logout();
          }
        },
        error: () => this.logout()
      });
    }
  }

  private validateToken(): Observable<boolean> {
    return this.http.get<{ valid: boolean }>(`${this.authUrl}/validate-token`, {
      headers: this.tokenService.getAuthHeaders()
    }).pipe(
      map(response => response.valid),
      catchError(() => {
        // Try to use refresh token
        return this.refreshToken().pipe(
          map(() => true),
          catchError(() => {
            this.logout();
            return throwError(() => new Error('Invalid token'));
          })
        );
      })
    );
  }

  private loadUserFromToken(): void {
    this.profileFacade.fetchMyProfile();
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, credentials).pipe(
      tap(response => {
        this.tokenService.setTokens(response.token, response.refreshToken);
        this.profileFacade.setMyProfile(response.profile);
        this.isAuthenticatedState.set(true);
      }),
      catchError(error => {
        console.error('Login failed', error);
        return throwError(() => new Error('Login failed. Please check your credentials.'));
      })
    );
  }

  logout(): void {
    // Clear stored tokens
    this.tokenService.clearTokens();
    
    // Reset authentication state
    this.profileFacade.setMyProfile(null);
    this.isAuthenticatedState.set(false);
    
    // Optional: notify the server about logout
    this.http.post(`${this.authUrl}/logout`, {}, { headers: this.tokenService.getAuthHeaders() })
      .subscribe({
        next: () => console.log('Logged out successfully'),
        error: (err) => console.error('Error during logout', err)
      });
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<{ token: string, refreshToken: string }>(`${this.authUrl}/refresh-token`, { refreshToken }).pipe(
      tap(response => {
        this.tokenService.setTokens(response.token, response.refreshToken);
      }),
      map(response => response.token),
      catchError(error => {
        console.error('Token refresh failed', error);
        this.logout();
        return throwError(() => new Error('Token refresh failed'));
      })
    );
  }

  // This method is kept for backward compatibility
  getAuthHeaders() {
    return this.tokenService.getAuthHeaders();
  }

  // Method to get current authentication status for guards/components that don't use the computed signal
  getAuthStatus(): boolean {
    return this.isAuthenticatedState();
  }
}