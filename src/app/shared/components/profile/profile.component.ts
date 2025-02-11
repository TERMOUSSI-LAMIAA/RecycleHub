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
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      firstName: ['', Validators.required], 
      lastName: ['', Validators.required], 
      address: ['', Validators.required], 
      phone: ['', Validators.required], 
      birthDate: ['', Validators.required], 
      city: ['', Validators.required], 
      profileImage: [''] 
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
      this.imageUrl = e.target.result; 
      this.profileForm.patchValue({ profileImage: this.imageUrl }); 
    };

    reader.readAsDataURL(file); 
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.authService.updateUser(this.profileForm.value).pipe(
        catchError(error => {
          console.error('Update failed:', error.message);
          return of(null); 
        })
      ).subscribe(user => {
        if (user) {
          console.log('Profile updated successfully:', user);
          this.updateSuccess = true; 
          setTimeout(() => {
            this.updateSuccess = false; 
          }, 3000)        }
      });
    }
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.authService.deleteAccount().pipe(
        catchError(error => {
          console.error('Account deletion failed:', error.message);
          return of(null); 
        })
      ).subscribe(() => {
        console.log('Account deleted successfully');
        this.router.navigate(['/login']);
      });
    }
  }


}
