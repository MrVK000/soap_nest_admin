import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  /**
   * Checks if token exists and is not expired (JWT exp claim).
   * Invalid/expired tokens are cleared and false is returned.
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token || token.length === 0) {
      return false;
    }
    if (this.isTokenExpired(token)) {
      this.logout();
      return false;
    }
    return true;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeJwtPayload(token);
      if (!payload?.exp) return false; // No exp = treat as not expired
      const expSeconds = typeof payload.exp === 'number' ? payload.exp : Number(payload.exp);
      const nowSeconds = Math.floor(Date.now() / 1000);
      return expSeconds < nowSeconds;
    } catch {
      return true; // Invalid token = treat as expired
    }
  }

  private decodeJwtPayload(token: string): { exp?: number } | null {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as { exp?: number };
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string {
    const token = localStorage.getItem(TOKEN_KEY)?.trim() ?? '';
    return token;
  }

  refreshToken(): Observable<{ token: string }> {
    const csrf = document.cookie.split('; ').find(r => r.startsWith('csrfToken='))?.split('=')[1] ?? '';
    return this.http.post<{ token: string }>(
      `${environment.apiBaseUrl}auth/refresh`,
      {},
      { withCredentials: true, headers: { 'x-csrf-token': csrf } }
    ).pipe(tap((res) => this.setToken(res.token)));
  }

  /**
   * Clears all auth-related data. Use this as the single logout entry point.
   */
  logout(): void {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }
}
