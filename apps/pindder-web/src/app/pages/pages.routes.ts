import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Styles } from './styles/styles';
import { Clients } from './clients/clients';
import { Orders } from './orders/orders';
import { Settings } from './settings/settings';
import { NewStyle } from './new-style/new-style';

export const pagesRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    { path: 'orders', component: Orders },
    { path: 'clients', component: Clients },
    { path: 'styles', component: Styles },
    { path: 'styles/new', component: NewStyle },
    { path: 'settings', component: Settings },
];