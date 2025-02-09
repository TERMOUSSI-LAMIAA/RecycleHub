import { Component, OnInit } from '@angular/core';
import { PointsService } from '../../../../core/services/points.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PointsConversionComponentComponent } from '../points-conversion-component/points-conversion-component.component';

@Component({
  selector: 'app-points-dashboard',
  standalone: true,
  imports: [PointsConversionComponentComponent],
  templateUrl: './points-dashboard.component.html',
  styleUrl: './points-dashboard.component.scss'
})
export class PointsDashboardComponent implements OnInit {
  userPoints: number = 0;
  userId: string = '';
  remainingPoints: number = 0;  
  
  constructor(private pointsService: PointsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.loadUserPoints();
      }
    });
  }

  loadUserPoints(): void {
    this.pointsService.getUserPoints(this.userId).subscribe(points => {
      this.userPoints = points;
      this.remainingPoints = points; 
    });
  }

  updateRemainingPoints(updatedPoints: number): void {
    this.remainingPoints = updatedPoints;
    this.userPoints = updatedPoints; 
  }
}
