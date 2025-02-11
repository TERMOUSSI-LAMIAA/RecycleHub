import { Injectable } from "@angular/core";
import { Observable, throwError, of, delay } from "rxjs";
import { CollectionRequest, RequestStatus, WasteType } from "../models/request.model";
import { AuthService } from "./auth.service";
import { LocalStorageService } from "./local-storage.service";
import { PointsService } from "./points.service";

@Injectable({
    providedIn: 'root'
})
export class CollectionRequestService {
    private readonly REQUESTS_KEY = 'collection_requests';

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private pointsService: PointsService
    ) { }

    getUserRequests(): Observable<CollectionRequest[]> {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            return throwError(() => new Error('User not authenticated'));
        }

        const allRequests = this.getAllRequests();
        const userRequests = allRequests.filter(req => req.userId === currentUser.id);

        return of(userRequests);
    }

    createRequest(request: Omit<CollectionRequest, 'id' | 'status' | 'userId'>): Observable<CollectionRequest> {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            return throwError(() => new Error('User not authenticated'));
        }

        const userRequests = this.getAllRequests().filter(
            req => req.userId === currentUser.id &&
                [RequestStatus.PENDING, RequestStatus.OCCUPIED, RequestStatus.IN_PROGRESS].includes(req.status)
        );

        if (userRequests.length >= 3) {
            console.log("Too many pending requests!");
            return throwError(() => new Error('Maximum 3 pending requests allowed'));
        }

        let totalWeight = 0;
        if (request.wasteDetails && request.wasteDetails.length > 0) {
            totalWeight = request.wasteDetails.reduce((sum, detail) => sum + detail.estimatedWeight, 0);
        }

        if (totalWeight > 10000) {
            console.log("10KG max");
            return throwError(() => new Error('Total collection weight cannot exceed 10kg'));
        }

        if (totalWeight < 1000) {
            return throwError(() => new Error('Minimum collection weight is 1000g'));
        }

        const newRequest: CollectionRequest = {
            id: Date.now().toString(),
            userId: currentUser.id,
            status: RequestStatus.PENDING,
            wasteDetails: request.wasteDetails,
            collectAddress: request.collectAddress,
            scheduledDate: request.scheduledDate,
            scheduledTimeSlot: request.scheduledTimeSlot,
            additionalNotes: request.additionalNotes,
            photos: request.photos
        };

        const allRequests = this.getAllRequests();
        allRequests.push(newRequest);
        this.saveRequests(allRequests);

        return of(newRequest);
    }

    updateRequest(requestId: string, updates: Partial<CollectionRequest>): Observable<CollectionRequest> {
        const allRequests = this.getAllRequests();
        const requestIndex = allRequests.findIndex(req => req.id === requestId);

        if (requestIndex === -1) {
            return throwError(() => new Error('Request not found'));
        }

        if (allRequests[requestIndex].status !== RequestStatus.PENDING) {
            return throwError(() => new Error('Only pending requests can be modified'));
        }

        const updatedRequest: CollectionRequest = { ...allRequests[requestIndex], ...updates };

        let totalWeight = 0;
        if (updatedRequest.wasteDetails && updatedRequest.wasteDetails.length > 0) {
            totalWeight = updatedRequest.wasteDetails.reduce((sum, detail) => sum + detail.estimatedWeight, 0);
        }

        if (totalWeight > 10000) {
            console.log("10KG max");
            return throwError(() => new Error('Total collection weight cannot exceed 10kg'));
        }

        if (totalWeight < 1000) {
            return throwError(() => new Error('Minimum collection weight is 1000g'));
        }

        allRequests[requestIndex] = updatedRequest;
        this.saveRequests(allRequests);

        return of(updatedRequest);

    }

    deleteRequest(requestId: string): Observable<void> {
        const allRequests = this.getAllRequests();
        const requestIndex = allRequests.findIndex(req => req.id === requestId);

        if (requestIndex === -1) {
            return throwError(() => new Error('Request not found'));
        }

        if (allRequests[requestIndex].status !== RequestStatus.PENDING) {
            return throwError(() => new Error('Only pending requests can be deleted'));
        }

        allRequests.splice(requestIndex, 1);
        this.saveRequests(allRequests);

        return of(undefined);
    }

    filterRequestsByCity(): CollectionRequest[] {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser || currentUser.userType !== 'collector') {
            return [];
        }

        const allRequests = this.getAllRequests();
        const collectorCity = currentUser.city.toLowerCase();

        return allRequests.filter((request) => {
            const requestCity = request.collectAddress.split(',')[0].trim().toLowerCase();
            return requestCity === collectorCity;
        });
    }

    updateStatus(requestId: string, status: RequestStatus): Observable<CollectionRequest> {
        const allRequests = this.getAllRequests();
        const requestIndex = allRequests.findIndex(req => req.id === requestId);

        if (requestIndex === -1) {
            return throwError(() => new Error('Request not found'));
        }

        const updatedRequest = { ...allRequests[requestIndex], status };
        allRequests[requestIndex] = updatedRequest;
        this.saveRequests(allRequests);

        if (status === RequestStatus.VALIDATED) {
            const request = allRequests[requestIndex];
            request.wasteDetails.forEach(detail => {
                this.pointsService.addPoints(request.userId, detail.wasteType, detail.estimatedWeight).subscribe();
            });
        }

        return of(updatedRequest);
    }

    private getAllRequests(): CollectionRequest[] {
        const requestsStr = this.localStorageService.getItem(this.REQUESTS_KEY);
        return requestsStr ? JSON.parse(requestsStr) : [];
    }

    private saveRequests(requests: CollectionRequest[]): void {
        this.localStorageService.setItem(this.REQUESTS_KEY, JSON.stringify(requests));
    }

}