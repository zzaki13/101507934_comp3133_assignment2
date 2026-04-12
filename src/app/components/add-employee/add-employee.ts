import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { ADD_EMPLOYEE } from '../../graphql/queries';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.scss'
})
export class AddEmployee {
  addForm: FormGroup;
  loading = false;
  error = '';
  photoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.addForm = this.fb.group({
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
          this.addForm.patchValue({ employee_photo: e.target.result });
          this.error = '';
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.addForm.invalid) return;

    this.loading = true;
    this.error = '';

    const values = this.addForm.value;

    this.apollo.mutate({
      mutation: ADD_EMPLOYEE,
      variables: {
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
          this.error = err.message || 'Failed to add employee. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }
}
