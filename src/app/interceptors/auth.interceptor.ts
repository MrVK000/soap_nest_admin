import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

function getDefaultHttpErrorMessage(error: { status?: number; statusText?: string }): string {
  if (!error?.status) return 'Network error. Please check your connection.';
  if (error.status >= 500) return 'Server error. Please try again later.';
  if (error.status === 404) return 'Resource not found.';
  if (error.status >= 400) return error.statusText || 'Request failed. Please try again.';
  return 'Something went wrong. Please try again.';
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);
  const loader = inject(LoadingService);

  const token = authService.getToken();
  const skipLoader = req.headers.get('x-show') === 'false';

  if (!skipLoader) loader.show();

  let modifiedReq = req.clone({ headers: req.headers.delete('x-show') });

  if (token) {
    modifiedReq = modifiedReq.clone({
      headers: modifiedReq.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  const isAuthEndpoint = req.url.includes('/auth/refresh') || req.url.includes('/auth/logout');

  return next(modifiedReq).pipe(
    catchError((error) => {
      console.error('HTTP Error:', error);
      if ((error.status === 401 || error.status === 403) && !isAuthEndpoint) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newToken = authService.getToken();
            if (!newToken) throw error;
            return next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
          }),
          catchError((refreshErr) => {
            authService.logout();
            toast.error('Session expired. Please login again.');
            router.navigate(['/login']);
            return throwError(() => refreshErr);
          })
        );
      } else if (error.status == null || error.status >= 500) {
        toast.error(getDefaultHttpErrorMessage(error));
      }
      return throwError(() => error);
    }),
    finalize(() => {
      if (!skipLoader) loader.hide();
    })
  );
};
