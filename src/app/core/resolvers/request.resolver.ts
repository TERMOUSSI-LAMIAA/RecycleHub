import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { CollectionRequest } from "../models/request.model";
import { CollectionRequestService } from "../services/collection-request.service";

@Injectable({
    providedIn: 'root'
})
export class RequestResolver implements Resolve<CollectionRequest[]> {
    constructor(private requestService: CollectionRequestService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CollectionRequest[]> {
        return this.requestService.getUserRequests(); 
    }
}