import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { GET_EMPLOYEES, DELETE_EMPLOYEE, SEARCH_EMPLOYEES } from '../../graphql/queries';
import { AuthService } from '../../services/auth.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss'
})
export class EmployeeList implements OnInit {
  employees: any[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  searchType = 'department';
  searching = false;
  currentUser: any;

  constructor(
    private apollo: Apollo,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.error = '';

    this.apollo.query({
      query: GET_EMPLOYEES,
      fetchPolicy: 'network-only'
    }).subscribe({
      next: (result: any) => {
        this.employees = result.data.getEmployees;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load employees. Please try again.';
        this.loading = false;
      }
    });
  }

  search() {
    if (!this.searchTerm.trim()) {
      this.loadEmployees();
      return;
    }

    this.searching = true;
    this.error = '';

    const variables: any = {};
    if (this.searchType === 'department') {
      variables['department'] = this.searchTerm.trim();
    } else {
      variables['designation'] = this.searchTerm.trim();
    }

    this.apollo.query({
      query: SEARCH_EMPLOYEES,
      variables,
      fetchPolicy: 'network-only'
    }).subscribe({
      next: (result: any) => {
        this.employees = result.data.searchEmployeeByDesignationOrDepartment;
        this.searching = false;
      },
      error: (err) => {
        this.error = err.message || 'Search failed. Please try again.';
        this.searching = false;
      }
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.loadEmployees();
  }

  deleteEmployee(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) return;

    this.apollo.mutate({
      mutation: DELETE_EMPLOYEE,
      variables: { id }
    }).subscribe({
      next: () => {
        this.employees = this.employees.filter(e => e._id !== id);
      },
      error: () => {
        this.error = 'Failed to delete employee.';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
