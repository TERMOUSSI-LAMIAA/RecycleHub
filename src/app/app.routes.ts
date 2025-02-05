import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { RequestListComponent } from './features/collection-requests/components/request-list/request-list.component';
import { CollectorDashboardComponent } from './features/collector-dashboard/components/collector-dashboard/collector-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { RequestResolver } from './core/resolvers/request.resolver';

export const routes: Routes = [
    // { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'requests/list',
        component: RequestListComponent,
        canActivate: [authGuard],
        data: {
            allowedUserTypes: ['individual']
        },
        resolve: {
            requests: RequestResolver
        }
    },
    {
        path: 'collector/dashboard',
        component: CollectorDashboardComponent,
        canActivate: [authGuard],
        data: {
            allowedUserTypes: ['collector']
        }
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard]
    },
    {
        path: '**',
        component: LoginComponent
    }
];
