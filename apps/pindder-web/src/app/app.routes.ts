import { Route } from '@angular/router';
import { AppLayout } from './layouts/app-layout/app-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { authGuard } from './core/auth-guard';
import { appGuard } from './core/app-guard';

export const appRoutes: Route[] = [
    { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
    { path: 'catalogs/:id', loadComponent: () => import('./pages/catalogs/catalogs').then(m => m.Catalogs) },
    { path: 'auth', component: AuthLayout, canActivate: [appGuard], loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes) },
    { path: 'app', component: AppLayout, canActivate: [authGuard], loadChildren: () => import('./pages/pages.routes').then(m => m.pagesRoutes) },
    { path: '**', redirectTo: '' }
];
