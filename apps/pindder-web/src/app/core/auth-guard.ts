import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);

  const { value: token } = await Preferences.get({
    key: 'access_token'
  });

  if (token) {
    return true;
  }

  return router.createUrlTree(['/auth']);
};
