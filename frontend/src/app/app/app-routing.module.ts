import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import components directly from the correct paths
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { AuthGuard } from './services/auth.guard';

export const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employees', component: EmployeesComponent, canActivate: [AuthGuard] },
  { path: 'add', component: EmployeeFormComponent, canActivate: [AuthGuard] },
  { path: 'employee/:id', component: EmployeeDetailComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' } // wildcard fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
