import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { LOGIN_MUTATION } from '../../graphql/queries';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/employees']);
    }
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    const { usernameOrEmail, password } = this.loginForm.value;

    this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { usernameOrEmail, password }
    }).subscribe({
      next: (result: any) => {
        const { token, user } = result.data.login;
        this.authService.setToken(token);
        this.authService.setUser(user);
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.error = err.message || 'Login failed. Please check your credentials.';
        this.loading = false;
      }
    });
  }
}
