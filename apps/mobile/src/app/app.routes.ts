import { Tabs } from './pages/tabs/tabs';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
    },
    {
        path: 'app',
        component: Tabs,
        loadChildren: () => import('./pages/pages.routes').then((m) => m.pagesRoutes),
    },
];
