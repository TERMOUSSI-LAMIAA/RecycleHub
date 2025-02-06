
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as RequestActions from './collection-requests.actions';
import { CollectionRequestService } from '../../../core/services/collection-request.service';


@Injectable()
export class CollectionRequestsEffects {

    loadRequests$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RequestActions.loadRequests),  // ✅ Ensure correct import
            mergeMap(() =>
                this.requestService.getUserRequests().pipe(
                    map(requests => RequestActions.loadRequestsSuccess({ requests })),  // ✅ Use correct action
                    catchError(error => of(RequestActions.loadRequestsFailure({ error: error.message })))  // ✅ Ensure correct action
                )
            )
        )
    );

    deleteRequest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RequestActions.deleteRequest),  // ✅ Use correct action
            mergeMap(({ requestId }) =>
                this.requestService.deleteRequest(requestId).pipe(
                    map(() => RequestActions.deleteRequestSuccess({ requestId })),  // ✅ Ensure correct action
                    catchError(error => of(RequestActions.deleteRequestFailure({ error: error.message })))  // ✅ Ensure correct action
                )
            )
        )
    );

    constructor(private actions$: Actions, private requestService: CollectionRequestService) { }
}