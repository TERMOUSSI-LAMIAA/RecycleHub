import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PointsService } from '../../../../core/services/points.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-points-conversion-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './points-conversion-component.component.html',
  styleUrl: './points-conversion-component.component.scss'
})
export class PointsConversionComponentComponent implements OnInit {
  voucherAmount: number | null = null;
  remainingPoints: number | null = null;
  errorMessage: string | null = null;
  @Output() pointsUpdated = new EventEmitter<number>(); 
  
  constructor(
    private pointsService: PointsService,
    private authService: AuthService 
  ) { }

  ngOnInit(): void {
  }

  convertPoints(): void {
    this.errorMessage = null; // Clear any previous errors
    const user = this.authService.getCurrentUser(); // Get current user
    if (!user) {
      this.errorMessage = 'User not authenticated.';
      return;
    }

    this.pointsService.convertPointsToVoucher(user.id).subscribe({
      next: (result) => {
        this.voucherAmount = result.voucher;
        this.remainingPoints = result.remainingPoints;

        this.pointsUpdated.emit(result.remainingPoints);
      },
      error: (error) => {
        this.errorMessage = 'Error converting points: ' + error.message;
        this.voucherAmount = null;
        this.remainingPoints = null;
      }
    });
  }
}
