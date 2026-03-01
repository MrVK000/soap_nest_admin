import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false when no token is stored', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should return true when valid token is stored', () => {
    const validToken = createJwtToken({ exp: Math.floor(Date.now() / 1000) + 3600 });
    service.setToken(validToken);
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should return false and clear token when token is expired', () => {
    const expiredToken = createJwtToken({ exp: Math.floor(Date.now() / 1000) - 3600 });
    service.setToken(expiredToken);
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getToken()).toBe('');
  });

  it('should clear all auth data on logout', () => {
    service.setToken('some-token');
    service.logout();
    expect(service.getToken()).toBe('');
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should get and set token correctly', () => {
    const token = 'test-jwt-token';
    service.setToken(token);
    expect(service.getToken()).toBe(token);
  });
});

function createJwtToken(payload: object): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa('signature');
  return `${header}.${body}.${signature}`;
}
