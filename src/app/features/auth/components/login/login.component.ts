import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth.actions';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service'
import { catchError, delay, filter, of, take } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { selectUser } from '../../store/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
        .pipe(
          // Wait a bit to ensure authentication state is updated
          delay(100),
          catchError(error => {
            console.error('Login failed:', error);
            this.errorMessage = error.message || 'Login failed';
            return of(null);
          })
        )
        .subscribe(user => {
          if (user) {
            console.log('User logged in:', user);
            // First dispatch the action
            this.store.dispatch(AuthActions.loginSuccess({ user }));

            // Wait for the next tick to ensure store is updated
            setTimeout(() => {
              if (user.userType === 'individual') {
                console.log('Navigating to requests list');
                this.router.navigate(['/requests/list'])
                  .then(success => console.log('Navigation success:', success))
                  .catch(err => console.error('Navigation error:', err));
              } else if (user.userType === 'collector') {
                console.log('Navigating to collector dashboard');
                this.router.navigate(['/collector/dashboard'])
                  .then(success => console.log('Navigation success:', success))
                  .catch(err => console.error('Navigation error:', err));
              }
            }, 0);
          }
        });
    }
  }
}
