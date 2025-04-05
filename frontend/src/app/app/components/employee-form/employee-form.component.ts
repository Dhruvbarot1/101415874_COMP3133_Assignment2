import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $firstName: String!,
    $lastName: String!,
    $email: String!,
    $department: String!,
    $position: String!,
    $profilePicture: String
  ) {
    addEmployee(
      firstName: $firstName,
      lastName: $lastName,
      email: $email,
      department: $department,
      position: $position,
      profilePicture: $profilePicture
    ) {
      id
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID!,
    $firstName: String,
    $lastName: String,
    $email: String,
    $department: String,
    $position: String,
    $profilePicture: String
  ) {
    updateEmployee(
      id: $id,
      firstName: $firstName,
      lastName: $lastName,
      email: $email,
      department: $department,
      position: $position,
      profilePicture: $profilePicture
    ) {
      id
    }
  }
`;

const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    getEmployee(id: $id) {
      firstName
      lastName
      email
      department
      position
      profilePicture
    }
  }
`;

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule
  ],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  empForm!: FormGroup;
  profileImageBase64: string = '';
  isEditMode: boolean = false;
  employeeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.empForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['Information Technology', Validators.required],
      position: ['', Validators.required]
    });

    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployee(this.employeeId);
    }
  }

  loadEmployee(id: string) {
    this.apollo.watchQuery<any>({
      query: GET_EMPLOYEE,
      variables: { id }
    }).valueChanges.subscribe(({ data }) => {
      const emp = data.getEmployee;
      if (emp) {
        this.empForm.patchValue(emp);
        this.profileImageBase64 = emp.profilePicture || '';
      }
    });
  }

  onFileChange(event: any): void {
    const reader = new FileReader();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.profileImageBase64 = reader.result as string;
      };
    }
  }

  submit(): void {
    if (this.empForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const { firstName, lastName, email, department, position } = this.empForm.value;

    if (this.isEditMode) {
      this.apollo.mutate({
        mutation: UPDATE_EMPLOYEE,
        variables: {
          id: this.employeeId,
          firstName,
          lastName,
          email,
          department,
          position,
          profilePicture: this.profileImageBase64
        }
      }).subscribe({
        next: () => {
          alert('✅ Employee updated successfully!');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          alert('❌ Failed to update employee: ' + err.message);
        }
      });
    } else {
      this.apollo.mutate({
        mutation: ADD_EMPLOYEE,
        variables: {
          firstName,
          lastName,
          email,
          department,
          position,
          profilePicture: this.profileImageBase64
        }
      }).subscribe({
        next: () => {
          alert('✅ Employee added successfully!');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          alert('❌ Failed to add employee: ' + err.message);
        }
      });
    }
  }
}
