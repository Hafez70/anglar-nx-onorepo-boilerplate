import { Route } from '@angular/router';
import { AuthGuard, LoginComponent } from '@authorizatione';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const appRoutes: Route[] = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: DashboardComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];
