import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule,],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the form with validation
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: [''],
      phone: [''],
      birthDate: [''],
      city: ['', Validators.required],
      profileImage: [''] // Optional field
    });
  }

  ngOnInit(): void {
    // Fetch the current user data when the component initializes
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.profileForm.patchValue(user); // Populate form with current user data
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      // Call update method from AuthService
      this.authService.updateUser(this.profileForm.value).pipe(
        catchError(error => {
          console.error('Update failed:', error.message);
          return of(null); // Handle error appropriately
        })
      ).subscribe(user => {
        if (user) {
          console.log('Profile updated successfully:', user);
          // Optionally show a success message or navigate somewhere
        }
      });
    }
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Call delete method from AuthService
      this.authService.deleteAccount().pipe(
        catchError(error => {
          console.error('Account deletion failed:', error.message);
          return of(null); // Handle error appropriately
        })
      ).subscribe(() => {
        console.log('Account deleted successfully');
        this.router.navigate(['/login']); // Redirect after deletion
      });
    }
  }
}
