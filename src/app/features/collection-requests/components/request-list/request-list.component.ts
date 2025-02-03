import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [],
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.scss'
})
export class RequestListComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user?.userType !== 'individual') {
      this.router.navigate(['/login']);
    }
  }
}
