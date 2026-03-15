import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const toast = inject(ToastService);
  const authService = inject(AuthService);

  if (!authService.isLoggedIn()) {
    toast.info('Please log in to continue');
    router.navigate(['/login']);
    return false;
  }
  return true;
};
