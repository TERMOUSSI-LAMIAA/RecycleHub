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

    // Get user points
    getUserPoints(userId: string): Observable<number> {
        const allPoints: Points[] = this.getAllPoints();
        const userPoints = allPoints.find(p => p.userId === userId);
        return of(userPoints ? userPoints.totalPoints : 0);
    }

    // Add points based on waste type and weight
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

    // Private helper: Calculate points based on type & weight
    private calculatePoints(wasteType: WasteType, weight: number): number {
        const pointsPerKg = {
            plastic: 2,
            glass: 1,
            paper: 1,
            metal: 5
        };

        const kgWeight = weight / 1000; // Convert grams to kg
        return (pointsPerKg[wasteType] || 1) * kgWeight;
    }

    // Private helper: Retrieve all points records
    private getAllPoints(): Points[] {
        const pointsStr = this.localStorageService.getItem(this.POINTS_KEY);
        return pointsStr ? JSON.parse(pointsStr) : [];
    }

    // Private helper: Save points records
    private savePoints(points: Points[]): void {
        this.localStorageService.setItem(this.POINTS_KEY, JSON.stringify(points));
    }
}