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


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'products',
        component: ProductsComponent
    },
    {
        path: 'orders',
        component: OrdersComponent
    },
    {
        path: 'order-details',
        component: OrderDetailsComponent
    },
    {
        path: 'customers',
        component: CustomersComponent
    },
    {
        path: 'customer-details',
        component: CustomerDetailsComponent
    },
    {
        path: 'analytics',
        component: AnalyticsComponent
    },
    {
        path: 'settings',
        component: SettingsComponent
    },
    {
        path: '**',
        component: PageNotFoundComponent
    },
];