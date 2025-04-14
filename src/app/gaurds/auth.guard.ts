import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = JSON.parse(localStorage.getItem('token') as string)
  console.log(">>>>> guard >> ", isLoggedIn);  

  if (isLoggedIn) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }

};
