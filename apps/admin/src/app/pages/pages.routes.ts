import { Route } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Tailor } from './tailors/tailor';
import { Plan } from './plans/plan';
import { Subscription } from './subscriptions/subscription';
import { Order } from './orders/order';
import { User } from './users/user';
import { Payment } from './payments/payment';
import { Settings } from './settings/settings';
import { ViewTailor } from './view-tailor/view-tailor';
import { ViewOrder } from './view-order/view-order';
import { ViewPayment } from './view-payment/view-payment';
import { Teams } from './teams/teams';
import { TeamMember } from './team-member/team-member';

export const pagesRoutes: Route[] = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    { path: 'tailors', component: Tailor },
    { path: 'tailors/:id', component: ViewTailor },
    { path: 'users', component: User },
    { path: 'plans', component: Plan },
    { path: 'subscriptions', component: Subscription },
    { path: 'orders', component: Order },
    { path: 'orders/:id', component: ViewOrder },
    { path: 'payments', component: Payment },
    { path: 'payments/:id', component: ViewPayment },
    { path: 'settings', component: Settings },
    { path: 'team', component: Teams },
    { path: 'team/:id/member', component: TeamMember },
];
