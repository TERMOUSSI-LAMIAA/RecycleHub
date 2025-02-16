import { Observable, of } from "rxjs";
import { LocalStorageService } from "./local-storage.service";
import { Points } from "../models/points.model";
import { WasteType } from "../models/request.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
    
export class PointsService {
    private readonly POINTS_KEY = 'user_points';

    constructor(private localStorageService: LocalStorageService) { }

    getUserPoints(userId: string): Observable<number> {
        const allPoints: Points[] = this.getAllPoints();
        const userPoints = allPoints.find(p => p.userId === userId);
        return of(userPoints ? userPoints.totalPoints : 0);
    }

    addPoints(userId: string, wasteType: WasteType, weight: number): Observable<number> {
        let pointsEarned = this.calculatePoints(wasteType, weight);

        let allPoints = this.getAllPoints();
        let userPoints = allPoints.find(p => p.userId === userId);

        if (userPoints) {
            userPoints.totalPoints += pointsEarned;
        } else {
            userPoints = { userId, totalPoints: pointsEarned };
            allPoints.push(userPoints);
        }

        this.savePoints(allPoints);
        return of(userPoints.totalPoints);
    }

    private calculatePoints(wasteType: WasteType, weight: number): number {
        const pointsPerKg = {
            plastic: 2,
            glass: 1,
            paper: 1,
            metal: 5
        };

        const kgWeight = weight / 1000; //  grams to kg
        return (pointsPerKg[wasteType] || 1) * kgWeight;
    }

    private getAllPoints(): Points[] {
        const pointsStr = this.localStorageService.getItem(this.POINTS_KEY);
        return pointsStr ? JSON.parse(pointsStr) : [];
    }

    private savePoints(points: Points[]): void {
        this.localStorageService.setItem(this.POINTS_KEY, JSON.stringify(points));
    }
    
    convertPointsToVoucher(userId: string): Observable<{ voucher: number; remainingPoints: number }> {
        let allPoints = this.getAllPoints();
        let userPoints = allPoints.find(p => p.userId === userId);

        if (!userPoints || userPoints.totalPoints < 100) {
            return of({ voucher: 0, remainingPoints: userPoints ? userPoints.totalPoints : 0 });
        }

        let voucher = 0;
        let pointsUsed = 0;

        if (userPoints.totalPoints >= 500) {
            voucher = 350;
            pointsUsed = 500;
        } else if (userPoints.totalPoints >= 200) {
            voucher = 120;
            pointsUsed = 200;
        } else if (userPoints.totalPoints >= 100) {
            voucher = 50;
            pointsUsed = 100;
        }

        userPoints.totalPoints -= pointsUsed;
        this.savePoints(allPoints);

        return of({ voucher, remainingPoints: userPoints.totalPoints });
    }

}