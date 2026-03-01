import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { catchError, finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

function getDefaultHttpErrorMessage(error: { status?: number; statusText?: string }): string {
  if (!error?.status) return 'Network error. Please check your connection.';
  if (error.status >= 500) return 'Server error. Please try again later.';
  if (error.status === 404) return 'Resource not found.';
  if (error.status >= 400) return error.statusText || 'Request failed. Please try again.';
  return 'Something went wrong. Please try again.';
}

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);
//   const snackBar = inject(MatSnackBar);
//   const loader = inject(LoadingService);
//   const token = authService.getToken();

//   loader.show();

//   if (token) {
//     const clonedRequest = req.clone({
//       headers: new HttpHeaders({
//         'Authorization': `Bearer ${token}`,
//       })
//     });
//     return next(clonedRequest).pipe(
//       catchError((error) => {
//         console.error("Error: ", error);
//         if (error.status === 401 || error.status === 403) {
//           authService.logout();
//           snackBar.open("Please login", 'Close', { duration: 3000 });
//           router.navigate(['/login']);
//         }
//         return throwError(() => error);
//       }), finalize(() => loader.hide())
//     );
//   }
//   return next(req);
// };



export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const loader = inject(LoadingService);

  const token = authService.getToken();

  // 🚫 Skip loader if "x-show" is explicitly set to "false"
  const skipLoader = req.headers.get('x-show') === 'false';

  if (!skipLoader) {
    loader.show();
  }

  // 🧹 Remove the custom header before sending to the backend
  let modifiedReq = req.clone({
    headers: req.headers.delete('x-show'),
  });

  // Add Authorization if token exists
  if (token) {
    modifiedReq = modifiedReq.clone({
      headers: modifiedReq.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(modifiedReq).pipe(
    catchError((error) => {
      console.error('HTTP Error:', error);
      if (error.status === 401 || error.status === 403) {
        authService.logout();
        snackBar.open('Session expired. Please login again.', 'Close', { duration: 3000 });
        router.navigate(['/login']);
      } else if (error.status == null || error.status >= 500) {
        const message = getDefaultHttpErrorMessage(error);
        snackBar.open(message, 'Close', { duration: 4000 });
      }
      return throwError(() => error);
    }),
    finalize(() => {
      if (!skipLoader) {
        loader.hide();
      }
    })
  );
};
