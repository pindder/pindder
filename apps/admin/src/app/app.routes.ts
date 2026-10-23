import { Route } from '@angular/router';
import { AppLayout } from './layouts/app-layout/app-layout';

export const appRoutes: Route[] = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes) },
    { path: 'app', component: AppLayout, loadChildren: () => import('./pages/pages.routes').then((m) => m.pagesRoutes) },
];
