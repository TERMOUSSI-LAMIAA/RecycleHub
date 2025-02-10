import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  imageUrl: string | null = null;

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
      address: ['', Validators.required], 
      phone: ['', Validators.required], 
      birthDate: ['', Validators.required], 
      profileImage: [''], 
      city: ['', Validators.required] 
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
      this.registerForm.patchValue({ profileImage: this.imageUrl }); // Store in form
    };

    reader.readAsDataURL(file); // Read as Data URL (base64)
  }
  
  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).pipe(
        catchError(error => {
          this.errorMessage = error.message;
          console.error('Registration failed:', error.message);
          return of(null); 
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
