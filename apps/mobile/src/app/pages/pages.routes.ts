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
        path: 'orders/:id',
        loadComponent: () => import('./order-view/order-view').then((m) => m.OrderView),
    },
    {
        path: 'clients',
        loadComponent: () => import('./clients/clients').then((m) => m.Clients),
    },
    {
        path: 'clients/:id',
        loadComponent: () => import('./client-view/client-view').then((m) => m.ClientView),
    },
    {
        path: 'styles',
        loadComponent: () => import('./designs/designs').then((m) => m.Designs),
    },
    {
        path: 'styles/:id',
        loadComponent: () => import('./design-view/design-view').then((m) => m.DesignView),
    },
    {
        path: 'profile',
        loadComponent: () => import('./settings/settings').then((m) => m.Settings),
    },
    {
        path: 'profile/edit',
        loadComponent: () => import('./edit-profile/edit-profile').then((m) => m.EditProfile),
    },
    {
        path: 'profile/premium',
        loadComponent: () => import('./premium/premium').then((m) => m.Premium),
    },
    {
        path: 'profile/referrals',
        loadComponent: () => import('./referrals/referrals').then((m) => m.Referrals),
    },
    {
        path: 'profile/help',
        loadComponent: () => import('./help/help').then((m) => m.Help),
    },
    {
        path: 'profile/contact',
        loadComponent: () => import('./contact/contact').then((m) => m.Contact),
    },
];