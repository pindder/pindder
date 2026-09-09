import { Route } from "@angular/router";

export const pagesRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full', 
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
    },
    {
        path: 'orders',
        loadComponent: () => import('./orders/orders').then((m) => m.Orders),
    },
    {
        path: 'clients',
        loadComponent: () => import('./clients/clients').then((m) => m.Clients),
    },
    {
        path: 'styles',
        loadComponent: () => import('./designs/designs').then((m) => m.Designs),
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
    },
    {
        path: 'profile',
        loadComponent: () => import('./settings/settings').then((m) => m.Settings),
    }
];