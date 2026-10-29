import { Onboarding } from './components/onboarding/onboarding';
import { authGuard } from './core/auth-guard';
import { onboardingGuard, preventOnboardingRepeatGuard } from './core/onboarding-guard';
import { AppLayout } from './layouts/app-layout/app.layout';
import { AuthLayout } from './layouts/auth-layout/auth.layout';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'app',
        pathMatch: 'full',
    },
    {
        path: 'onboarding',
        component: Onboarding,
        canActivate: [preventOnboardingRepeatGuard]
    },
    {
        path: 'auth',
        component: AuthLayout,
        loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
        canActivate: [onboardingGuard]
    },
    {
        path: 'app',
        canActivate: [authGuard],
        component: AppLayout,
        loadChildren: () => import('./pages/pages.routes').then((m) => m.pagesRoutes),
    },
    {
        path: 'notifications',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/notifications/notification').then((m) => m.Notification),
    }
];
