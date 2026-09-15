import { Route } from '@angular/router';

export const authRoutes: Route[] = [
    {
        path: '',
        loadComponent: () => import('./auth').then((m) => m.Auth),
    },
    // {
    //     path: 'forgot-password',
    //     loadComponent: () => import('./forgot-password/forgot-password').then((m) => m.ForgotPassword),
    // },
    {
        path: 'login',
        loadComponent: () => import('./login/login').then((m) => m.Login),
    },
    {
        path: 'register',
        loadComponent: () => import('./register/register').then((m) => m.Register),
    },
    {
        path: 'otp',
        loadComponent: () => import('./otp/otp').then((m) => m.Otp),
    },
];