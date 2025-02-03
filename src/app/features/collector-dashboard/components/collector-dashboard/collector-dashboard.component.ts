import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collector-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './collector-dashboard.component.html',
  styleUrl: './collector-dashboard.component.scss'
})
export class CollectorDashboardComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user?.userType !== 'collector') {
      this.router.navigate(['/login']);
    }
  }
}
