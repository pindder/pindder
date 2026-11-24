import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Styles } from './styles/styles';
import { Clients } from './clients/clients';
import { Orders } from './orders/orders';
import { Settings } from './settings/settings';
import { NewStyle } from './new-style/new-style';
import { ViewOrder } from './view-order/view-order';
import { Measurements } from './measurements/measurements';
import { Brands } from './brands/brands';
import { ViewBrand } from './view-brand/view-brand';

export const pagesRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    { path: 'measurements', component: Measurements },
    { path: 'orders', component: Orders },
    { path: 'orders/:id', component: ViewOrder },
    { path: 'clients', component: Clients },
    { path: 'brands', component: Brands },
    { path: 'brands/:id', component: ViewBrand },
    { path: 'styles', component: Styles },
    { path: 'styles/new', component: NewStyle },
    { path: 'settings', component: Settings },
];