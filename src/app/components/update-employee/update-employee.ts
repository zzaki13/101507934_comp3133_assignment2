import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { GET_EMPLOYEE_BY_ID, UPDATE_EMPLOYEE } from '../../graphql/queries';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './update-employee.html',
  styleUrl: './update-employee.scss'
})
export class UpdateEmployee implements OnInit {
  updateForm: FormGroup;
  loading = false;
  loadingData = true;
  error = '';
  employeeId: string = '';
  photoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.updateForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(0)]],
      date_of_joining: ['', [Validators.required]],
      department: ['', [Validators.required]],
      employee_photo: ['']
    });
  }

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';

    this.apollo.watchQuery({
      query: GET_EMPLOYEE_BY_ID,
      variables: { id: this.employeeId },
      fetchPolicy: 'network-only'
    }).valueChanges.subscribe({
      next: (result: any) => {
        this.ngZone.run(() => {
          const emp = result.data.searchEmployeeById;
          const rawDate = emp.date_of_joining;
          let dateStr = '';
          if (rawDate) {
            const d = new Date(isNaN(Number(rawDate)) ? rawDate : Number(rawDate));
            dateStr = d.toISOString().split('T')[0];
          }
          this.updateForm.patchValue({
            first_name: emp.first_name,
            last_name: emp.last_name,
            email: emp.email,
            gender: emp.gender,
            designation: emp.designation,
            salary: emp.salary,
            date_of_joining: dateStr,
            department: emp.department,
            employee_photo: emp.employee_photo || ''
          });
          if (emp.employee_photo) this.photoPreview = emp.employee_photo;
          this.loadingData = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.error = 'Failed to load employee data.';
          this.loadingData = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        this.error = 'Image size must be under 2MB.';
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.ngZone.run(() => {
          this.photoPreview = e.target.result;
          this.updateForm.patchValue({ employee_photo: e.target.result });
          this.error = '';
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.updateForm.invalid) return;

    this.loading = true;
    this.error = '';

    const values = this.updateForm.value;

    this.apollo.mutate({
      mutation: UPDATE_EMPLOYEE,
      variables: {
        id: this.employeeId,
        ...values,
        salary: parseFloat(values.salary)
      }
    }).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.router.navigate(['/employees']);
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.error = err.message || 'Failed to update employee. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }
}
