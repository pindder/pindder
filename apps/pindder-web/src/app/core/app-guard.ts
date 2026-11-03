import { CanActivateFn } from '@angular/router';

export const appGuard: CanActivateFn = (route, state) => {
  return true;
};
