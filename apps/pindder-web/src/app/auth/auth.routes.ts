import { Route } from "@angular/router";

export const authRoutes: Route[] = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./sign-in/sign-in').then(m => m.SignIn) },
    { path: 'register', loadComponent: () => import('./sign-up/sign-up').then(m => m.SignUp) },
    { path: 'verify-otp', loadComponent: () => import('./otp/otp').then(m => m.Otp) }
];