import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { adminAuthGuard } from './shared/guards/admin-auth.guard';

export const routes: Routes = [
    { path: "", redirectTo: "events", pathMatch: "full" },
    { path: "dashboard", loadComponent: () => import("./admin/dashboard/dashboard.component").then((c) => c.DashboardComponent), canActivate: [adminAuthGuard], 
        children: [{
          path: 'dashboard-events',
          loadComponent: () =>
            import('./admin/dashboard-events/dashboard-events.component').then((c) => c.DashboardEventsComponent), canActivate: [adminAuthGuard],
        },
        {
          path: 'dashboard-users',
          loadComponent: () =>
            import('./admin/dashboard-users/dashboard-users.component').then((c) => c.DashboardUsersComponent), canActivate: [adminAuthGuard],
        },
        {
          path: 'dashboard-tickets',
          loadComponent: () =>
            import('./admin/dashboard-tickets/dashboard-tickets.component').then((c) => c.DashboardTicketsComponent), canActivate: [adminAuthGuard],
        },
        {
          path: 'dashboard-orders',
          loadComponent: () =>
            import('./admin/dashboard-orders/dashboard-orders.component').then((c) => c.DashboardOrdersComponent), canActivate: [adminAuthGuard],
        },
        {
          path: 'dashboard-locations',
          loadComponent: () =>
            import('./admin/dashboard-locations/dashboard-locations.component').then((c) => c.DashboardLocationsComponent), canActivate: [adminAuthGuard],
        },
        {
          path: 'dashboard-seats',
          loadComponent: () =>
            import('./admin/dashboard-seats/dashboard-seats.component').then((c) => c.DashboardSeatsComponent), canActivate: [adminAuthGuard],
        }
    ]},    
    { path: "login", loadComponent: () => import("./login/login.component").then((c) => c.LoginComponent) },
    { path: "register", loadComponent: () => import("./register/register.component").then((c) => c.RegisterComponent) },
    { path: "events", loadComponent: () => import("./events/events.component").then((c) => c.EventsComponent) },
    { path: "event-details/:id", loadComponent: () => import("./events/event-details/event-details.component").then((c) => c.EventDetailsComponent) },
    { path: "reservation/:id", loadComponent: () => import("./reservation/reservation.component").then((c) => c.ReservationComponent), canActivate: [authGuard] },
    { path: "profile", loadComponent: () => import("./profile/profile.component").then((c) => c.ProfileComponent), canActivate: [authGuard] },
    { path: "order-history", loadComponent: () => import("./order-history/order-history.component").then((c) => c.OrderHistoryComponent), canActivate: [authGuard] },
    { path: "**", redirectTo:"events" }
];
