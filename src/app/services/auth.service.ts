import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  isLoggedIn(): boolean {
    const token: string = (localStorage.getItem('token')?.trim() ? localStorage.getItem('token')?.trim() : "") as string;
    return token.length > 0;
  }

  setToken(token: string): void {
    localStorage.setItem("token", token)
  }

  getToken(): string {
    return (localStorage.getItem('token')?.trim() ? localStorage.getItem('token')?.trim() : "") as string;
  }

  clearToken(): void {
    localStorage.setItem("token", "");
  }

  logout(): void {
    localStorage.setItem("user", "");
    localStorage.setItem("token", "");
  }
}
