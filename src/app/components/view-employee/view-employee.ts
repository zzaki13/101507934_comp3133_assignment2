import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { GET_EMPLOYEE_BY_ID } from '../../graphql/queries';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-employee',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './view-employee.html',
  styleUrl: './view-employee.scss'
})
export class ViewEmployee implements OnInit {
  employee: any = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apollo.watchQuery({
        query: GET_EMPLOYEE_BY_ID,
        variables: { id },
        fetchPolicy: 'network-only'
      }).valueChanges.subscribe({
        next: (result: any) => {
          this.ngZone.run(() => {
            this.employee = result.data.searchEmployeeById;
            this.loading = false;
            this.cdr.detectChanges();
          });
        },
        error: () => {
          this.ngZone.run(() => {
            this.error = 'Employee not found.';
            this.loading = false;
            this.cdr.detectChanges();
          });
        }
      });
    }
  }
}
