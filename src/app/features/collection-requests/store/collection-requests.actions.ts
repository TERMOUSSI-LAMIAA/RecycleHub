import { createAction, props } from "@ngrx/store";
import { CollectionRequest } from "../../../core/models/request.model";

export const loadRequests = createAction('[Request List] Load Requests');
export const loadRequestsSuccess = createAction(
    '[Request List] Load Requests Success',
    props<{ requests: CollectionRequest[] }>()
);
export const loadRequestsFailure = createAction(
    '[Request List] Load Requests Failure',
    props<{ error: any }>()
);