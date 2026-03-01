import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const authService = inject(AuthService);

  const isLoggedIn = authService.isLoggedIn();

  if (!isLoggedIn) {
    snackBar.open('Please log in to continue', 'Close', { duration: 2000 });
    router.navigate(['/login']);
    return false;
  }
  return true;
};
