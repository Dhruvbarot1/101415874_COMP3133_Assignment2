import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule, Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    getEmployee(id: $id) {
      id
      firstName
      lastName
      email
      department
      position
      profilePicture
      createdAt
    }
  }
`;

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  employee: any;

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.apollo
      .watchQuery({
        query: GET_EMPLOYEE,
        variables: { id }
      })
      .valueChanges.subscribe((res: any) => {
        this.employee = res.data.getEmployee;
      });
  }

  goBack(): void {
    this.location.back();
  }
}
