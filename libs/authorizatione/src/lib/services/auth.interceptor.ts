import { Injectable, inject, signal } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, finalize, tap, map } from 'rxjs/operators';
import { environment } from '@shared/env';
import { TokenService } from './token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authUrl = `${environment.apiUrl}/Account`;
  
  private isRefreshing = signal<boolean>(false);
  private refreshTokenValue = signal<string | null>(null);
  private tokenService = inject(TokenService);

  // Inject HttpClient directly for token refresh - breaking the circular dependency
  constructor(private http: HttpClient) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip authentication for login and refresh token endpoints
    if (this.isAuthRequest(request)) {
      return next.handle(request);
    }

    // Add auth header if not already present
    if (!request.headers.has('Authorization')) {
      request = this.addAuthHeader(request);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private isAuthRequest(request: HttpRequest<any>): boolean {
    return (
      request.url.includes(this.authUrl+'/login') || 
      request.url.includes(this.authUrl+'/refresh-token')
    );
  }

  private addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    const headers = this.tokenService.getAuthHeaders();
    if (headers.has('Authorization')) {
      return request.clone({
        headers: request.headers.set('Authorization', headers.get('Authorization') || '')
      });
    }
    return request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing()) {
      this.isRefreshing.set(true);
      this.refreshTokenValue.set(null);

      return this.refreshToken().pipe(
        switchMap(token => {
          this.refreshTokenValue.set(token);
          return next.handle(this.addAuthHeader(request));
        }),
        catchError(error => {
          // If refresh token fails, clear tokens
          this.tokenService.clearTokens();
          return throwError(() => error);
        }),
        finalize(() => {
          this.isRefreshing.set(false);
        })
      );
    } else {
      // For concurrent requests during token refresh, we still need to use RxJS
      // since we can't "await" inside an interceptor
      return new Observable<HttpEvent<any>>(observer => {
        const checkRefreshInterval = setInterval(() => {
          const token = this.refreshTokenValue();
          if (token) {
            clearInterval(checkRefreshInterval);
            next.handle(this.addAuthHeader(request)).subscribe(observer);
          }
        }, 100);
        
        // Cleanup logic
        return () => {
          clearInterval(checkRefreshInterval);
        };
      });
    }
  }
  
  // Implement token refresh directly in the interceptor to avoid circular dependency
  private refreshToken(): Observable<string> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<{ token: string, refreshToken: string }>(
      `${this.authUrl}/refresh-token`, 
      { refreshToken }
    ).pipe(
      tap(response => {
        this.tokenService.setTokens(response.token, response.refreshToken);
      }),
      map(response => response.token)
    );
  }
}