import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// ✅ Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// ✅ Required for routerLink in the template
import { RouterModule } from '@angular/router';

const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule, // ✅ Added to support routerLink
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'] // Optional styling
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  signup(): void {
    const { email, password } = this.signupForm.value;

    this.apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: { email, password }
    }).subscribe({
      next: () => {
        alert('Signup successful! Redirecting to login...');
        this.router.navigate(['/']); // ✅ Redirect to login
      },
      error: (err) => {
        alert('Signup failed: ' + err.message);
      }
    });
  }
}
