import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/products/products.component').then((m) => m.ProductsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'product-details/:id',
    loadComponent: () =>
      import('./components/product-details/product-details.component').then((m) => m.ProductDetailsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'feature-products',
    loadComponent: () =>
      import('./components/featured-products/featured-products.component').then((m) => m.FeaturedProductsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'coupons',
    loadComponent: () =>
      import('./components/coupons/coupons.component').then((m) => m.CouponsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./components/orders/orders.component').then((m) => m.OrdersComponent),
    canActivate: [authGuard],
  },
  {
    path: 'order-details/:id',
    loadComponent: () =>
      import('./components/order-details/order-details.component').then((m) => m.OrderDetailsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('./components/customers/customers.component').then((m) => m.CustomersComponent),
    canActivate: [authGuard],
  },
  {
    path: 'messages',
    loadComponent: () =>
      import('./components/messages/messages.component').then((m) => m.MessagesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'reviews',
    loadComponent: () =>
      import('./components/reviews/reviews.component').then((m) => m.ReviewsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'customer-details/:id',
    loadComponent: () =>
      import('./components/customer-details/customer-details.component').then((m) => m.CustomerDetailsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./components/analytics/analytics.component').then((m) => m.AnalyticsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./components/settings/settings.component').then((m) => m.SettingsComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
