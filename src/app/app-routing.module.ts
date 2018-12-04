import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import{LoginComponent} from './auth/login/login.component';
import{RegisterComponent} from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { dasboardRoutes } from './dashboard/dashboard.routes';
import { AuthGuardService } from './auth/auth-guard.service';

const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {
    path:'',
    component:DashboardComponent,
    children:dasboardRoutes,
    canActivate:[AuthGuardService]
  },
  {path:'**',redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
