import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { catchError, filter, Observable, of, switchMap, take } from "rxjs";
import { CollectionRequest } from "../models/request.model";
import { CollectionRequestService } from "../services/collection-request.service";
import { Store } from "@ngrx/store";
import { loadRequests } from "../../features/collection-requests/store/collection-requests.actions";
import { selectRequests } from "../../features/collection-requests/store/request.selectors";

@Injectable({
    providedIn: 'root'
})
export class RequestResolver implements Resolve<CollectionRequest[]> {  
    constructor(private store: Store) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CollectionRequest[]> {  // ✅ Change return type
        this.store.dispatch(loadRequests());
        return this.store.select(selectRequests).pipe(take(1));  // ✅ Return the observable with requests
    }
}