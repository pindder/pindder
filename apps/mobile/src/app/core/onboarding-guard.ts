import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// 1. Guard for your main app routes (redirects to onboarding if missing)
export const onboardingGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const onboarded = localStorage.getItem('onboarded');

  if (!onboarded) {
    return router.parseUrl('/onboarding');
  }
  return true;
};


// 2. Guard for the onboarding route itself (redirects away if already seen)
export const preventOnboardingRepeatGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const onboarded = localStorage.getItem('onboarded');

  if (onboarded) {
    return router.parseUrl('/login'); // Or '/dashboard' depending on your flow
  }
  return true;
};