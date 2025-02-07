import { createAction, props } from "@ngrx/store";
import { CollectionRequest } from "../../../core/models/request.model";

export const loadRequests = createAction('[Request List] Load Requests');
export const loadRequestsSuccess = createAction('[Request List] Load Requests Success', props<{ requests: CollectionRequest[] }>());
export const loadRequestsFailure = createAction('[Request List] Load Requests Failure', props<{ error: string }>());

export const loadFilteredRequestsByCity = createAction(
    '[Request] Load Filtered Requests By City'
);

export const loadFilteredRequestsByCitySuccess = createAction(
    '[Request] Load Filtered Requests By City Success',
    props<{ requests: CollectionRequest[] }>()
);

export const loadFilteredRequestsByCityFailure = createAction(
    '[Request] Load Filtered Requests By City Failure',
    props<{ error: string }>()
);
export const deleteRequest = createAction('[Request List] Delete Request', props<{ requestId: string }>());
export const deleteRequestSuccess = createAction('[Request List] Delete Request Success', props<{ requestId: string }>());
export const deleteRequestFailure = createAction('[Request List] Delete Request Failure', props<{ error: string }>());

export const createRequest = createAction(
    '[Request Form] Create Request',
    props<{ requestData: any }>()  // ? any -> actual type 
);

export const createRequestSuccess = createAction(
    '[Request Form] Create Request Success',
    props<{ request: CollectionRequest }>()
);

export const createRequestFailure = createAction(
    '[Request Form] Create Request Failure',
    props<{ error: string }>()
);

export const updateRequest = createAction(
    '[Collection Request] Update Request',
    props<{ requestId: string; updatedData: Partial<CollectionRequest> }>()
);

export const updateRequestSuccess = createAction(
    '[Collection Request] Update Request Success',
    props<{ updatedRequest: CollectionRequest }>()
);

export const updateRequestFailure = createAction(
    '[Collection Request] Update Request Failure',
    props<{ error: string }>()
);
export const clearRequestError = createAction('[Collection Request] Clear Error');