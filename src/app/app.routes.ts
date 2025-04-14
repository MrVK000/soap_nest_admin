import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { CustomersComponent } from './components/customers/customers.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SettingsComponent } from './components/settings/settings.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './gaurds/auth.guard';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: 'products',
        component: ProductsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [authGuard]
    },
    {
        path: 'order-details',
        component: OrderDetailsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'customers',
        component: CustomersComponent,
        canActivate: [authGuard]
    },
    {
        path: 'customer-details',
        component: CustomerDetailsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'analytics',
        component: AnalyticsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [authGuard]
    },
    {
        path: '**',
        component: PageNotFoundComponent
    },
];