import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.Login)
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/signup/signup').then(m => m.Signup)
  },
  {
    path: 'employees',
    loadComponent: () => import('./components/employee-list/employee-list').then(m => m.EmployeeList),
    canActivate: [authGuard]
  },
  {
    path: 'employees/add',
    loadComponent: () => import('./components/add-employee/add-employee').then(m => m.AddEmployee),
    canActivate: [authGuard]
  },
  {
    path: 'employees/:id/edit',
    loadComponent: () => import('./components/update-employee/update-employee').then(m => m.UpdateEmployee),
    canActivate: [authGuard]
  },
  {
    path: 'employees/:id',
    loadComponent: () => import('./components/view-employee/view-employee').then(m => m.ViewEmployee),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
