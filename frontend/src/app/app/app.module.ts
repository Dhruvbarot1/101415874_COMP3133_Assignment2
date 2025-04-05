import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';  // Main component of your app
import { AppRoutingModule } from './app-routing.module';  // Corrected import for routing module

// Import your components
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    EmployeesComponent,
    EmployeeFormComponent,
    EmployeeDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule  // Include routing module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
