import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PointsDashboardComponent } from '../../../features/points-system/components/points-dashboard/points-dashboard.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PointsDashboardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  updateSuccess: boolean = false;
  imageUrl: string | null = null; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the form with validation
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Required
      firstName: ['', Validators.required], // Required
      lastName: ['', Validators.required], // Required
      address: ['', Validators.required], // Required
      phone: ['', Validators.required], // Required
      birthDate: ['', Validators.required], // Required
      city: ['', Validators.required], // Required
      profileImage: [''] // Optional field
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.profileForm.patchValue(user); 

        this.imageUrl = user.profileImage || null; 
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.readFile(file);
    }
  }

  readFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imageUrl = e.target.result; // Set the preview URL
      this.profileForm.patchValue({ profileImage: this.imageUrl }); // Store in form
    };

    reader.readAsDataURL(file); // Read as Data URL (base64)
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
          this.updateSuccess = true; 
          setTimeout(() => {
            this.updateSuccess = false; // Reset success flag after a delay
          }, 3000)        }
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
