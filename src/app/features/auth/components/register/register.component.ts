import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required], // Required
      phone: ['', Validators.required], // Required
      birthDate: ['', Validators.required], // Required
      profileImage: [''], // Optional field
      city: ['', Validators.required] // Required
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).pipe(
        catchError(error => {
          console.error('Registration failed:', error.message);
          return of(null); // Handle error appropriately
        })
      ).subscribe(user => {
        if (user) {
          console.log('Registration successful:', user);
          this.router.navigate(['/requests/list']);
        }
      });
    }
  }
}
