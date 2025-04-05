import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { RouterModule, Router } from '@angular/router'; // ✅ Added RouterModule
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

// Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule, // ✅ Required for routerLink to work
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    const { email, password } = this.loginForm.value;
    this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password }
    }).subscribe({
      next: (result: any) => {
        const token = result.data.login.token;
        this.auth.setToken(token);
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        alert("Login failed: " + err.message);
      }
    });
  }
}
