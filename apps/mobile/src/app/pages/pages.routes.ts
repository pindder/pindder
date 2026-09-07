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
    }
];