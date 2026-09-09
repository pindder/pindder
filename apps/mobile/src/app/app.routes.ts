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
        path: 'auth',
        component: AuthLayout,
        loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
    },
    {
        path: 'app',
        component: AppLayout,
        loadChildren: () => import('./pages/pages.routes').then((m) => m.pagesRoutes),
    },
];
