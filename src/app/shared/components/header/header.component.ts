import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isLoggedIn$!: Observable<boolean>;
  userType: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.currentUser$.pipe(
      map(user => {
        if (user) {
          this.userType = user.userType;
        }
        return !!user;
      })
    );
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
