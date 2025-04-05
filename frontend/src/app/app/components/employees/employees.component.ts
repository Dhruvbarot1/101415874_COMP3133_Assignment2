import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

const GET_EMPLOYEES = gql`
  query {
    getEmployees {
      id
      firstName
      lastName
      email
      department
      position
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchTerm: string = '';
  displayedColumns: string[] = ['name', 'department', 'position', 'actions'];

  constructor(private apollo: Apollo, private router: Router) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.apollo.watchQuery<any>({
      query: GET_EMPLOYEES
    }).valueChanges.subscribe((res) => {
      this.employees = res.data.getEmployees;
      this.filteredEmployees = [...this.employees];
    });
  }

  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredEmployees = this.employees.filter(emp =>
      emp.department.toLowerCase().includes(term) ||
      emp.position.toLowerCase().includes(term)
    );
  }

  viewDetails(emp: any): void {
    this.router.navigate(['/employee', emp.id]);
  }

  editEmployee(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.apollo.mutate({
        mutation: DELETE_EMPLOYEE,
        variables: { id }
      }).subscribe({
        next: () => {
          this.fetchEmployees(); // Refresh list
        },
        error: (err) => {
          alert('Delete failed: ' + err.message);
        }
      });
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
