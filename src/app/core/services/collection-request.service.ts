import { Injectable } from "@angular/core";
import { Observable, throwError, of } from "rxjs";
import { CollectionRequest, RequestStatus, WasteType } from "../models/request.model";
import { AuthService } from "./auth.service";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class CollectionRequestService {
    private readonly REQUESTS_KEY = 'collection_requests';

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) { }

    // Get all requests for current user
    getUserRequests(): Observable<CollectionRequest[]> {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            return throwError(() => new Error('User not authenticated'));
        }

        const allRequests = this.getAllRequests();
        const userRequests = allRequests.filter(req => req.userId === currentUser.id);

        return of(userRequests);
    }

    // Create a new collection request
    createRequest(request: Omit<CollectionRequest, 'id' | 'status'>): Observable<CollectionRequest> {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            return throwError(() => new Error('User not authenticated'));
        }

        // Validate number of existing requests
        const userRequests = this.getAllRequests().filter(
            req => req.userId === currentUser.id &&
                [RequestStatus.PENDING, RequestStatus.OCCUPIED, RequestStatus.IN_PROGRESS].includes(req.status)
        );

        if (userRequests.length >= 3) {
            console.log("Too many pending requests!"); 
            return throwError(() => new Error('Maximum 3 simultaneous requests allowed'));
        }

        // // Validate total weight
        // const totalWeight = request.wasteTypes.reduce((sum, type) => sum + this.getEstimatedWeight(type), 0);
        if (request.estimatedWeight > 10000) { 
            console.log("10KG max"); 

            return throwError(() => new Error('Total collection weight cannot exceed 10kg'));
        }

        // Validate minimum weight
        if (request.estimatedWeight < 1000) {
            return throwError(() => new Error('Minimum collection weight is 1000g'));
        }

        const newRequest: CollectionRequest = {
            ...request,
            id: Date.now().toString(),
            userId: currentUser.id,
            status: RequestStatus.PENDING,
        };

        const allRequests = this.getAllRequests();
        allRequests.push(newRequest);
        this.saveRequests(allRequests);

        return of(newRequest);
    }

    // Update an existing request
    updateRequest(requestId: string, updates: Partial<CollectionRequest>): Observable<CollectionRequest> {
        const allRequests = this.getAllRequests();
        const requestIndex = allRequests.findIndex(req => req.id === requestId);

        if (requestIndex === -1) {
            return throwError(() => new Error('Request not found'));
        }

        // Only allow updates to pending requests
        if (allRequests[requestIndex].status !== RequestStatus.PENDING) {
            return throwError(() => new Error('Only pending requests can be modified'));
        }

        const updatedRequest = { ...allRequests[requestIndex], ...updates };
        allRequests[requestIndex] = updatedRequest;
        this.saveRequests(allRequests);

        return of(updatedRequest);
    }

    // Delete a request
    deleteRequest(requestId: string): Observable<void> {
        const allRequests = this.getAllRequests();
        const requestIndex = allRequests.findIndex(req => req.id === requestId);

        if (requestIndex === -1) {
            return throwError(() => new Error('Request not found'));
        }

        // Only allow deletion of pending requests
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
    // Private helper methods
    public getAllRequests(): CollectionRequest[] {
        const requestsStr = this.localStorageService.getItem(this.REQUESTS_KEY);
        return requestsStr ? JSON.parse(requestsStr) : [];
    }

    private saveRequests(requests: CollectionRequest[]): void {
        this.localStorageService.setItem(this.REQUESTS_KEY, JSON.stringify(requests));
    }

    // Helper to get estimated weight for waste type
    private getEstimatedWeight(type: WasteType): number {
        // This could be expanded or moved to a configuration
        switch (type) {
            case WasteType.PLASTIC: return 2000; // 2kg
            case WasteType.METAL: return 5000;   // 5kg
            case WasteType.PAPER: return 1000;   // 1kg
            case WasteType.GLASS: return 1000;   // 1kg
            default: return 0;
        }
    }
}