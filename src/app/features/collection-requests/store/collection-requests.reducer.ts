import { createReducer, on } from '@ngrx/store';
import { CollectionRequest } from '../../../core/models/request.model';
import { clearRequestError, createRequest, createRequestFailure, createRequestSuccess, deleteRequestSuccess, loadFilteredRequestsByCityFailure, loadFilteredRequestsByCitySuccess, loadRequestsSuccess, updateRequestFailure, updateRequestStatus, updateRequestStatusFailure, updateRequestStatusSuccess, updateRequestSuccess } from './collection-requests.actions';

export interface CollectionRequestState {
    requests: CollectionRequest[];
    error: string | null;
    loading: boolean;
}

export const initialState: CollectionRequestState = {
    requests: [],
    error: null,
        loading: false
};

export const collectionRequestsReducer = createReducer(
    initialState,
    on(loadRequestsSuccess, (state, { requests }) => ({ ...state, requests })),
 
    on(loadFilteredRequestsByCitySuccess, (state, { requests }) => ({
        ...state,
        requests,  
        error: null 
    })),

    on(loadFilteredRequestsByCityFailure, (state, { error }) => ({
        ...state,
        requests: [], 
        error 
    })),
    on(deleteRequestSuccess, (state, { requestId }) => ({
        ...state,
        requests: state.requests.filter(req => req.id !== requestId),
    })),
      on(createRequest, state => ({
          ...state,
          error: null
      })),
    on(createRequestSuccess, (state, { request }) => ({
        ...state,
        requests: [...state.requests, request]
    })),
    on(createRequestFailure, (state, { error }) => {
        console.log("Reducer handling createRequestFailure:", error);
    return { ...state, loading: false, error };
    }),
    on(updateRequestSuccess, (state, { updatedRequest }) => ({
        ...state,
        requests: state.requests.map(req =>
            req.id === updatedRequest.id ? updatedRequest : req
        ),
        error: null
    })),
    on(updateRequestFailure, (state, { error }) => ({
        ...state,
        error
    })),
    on(clearRequestError, (state) => ({
        ...state,
        error: null
    }))
    , on(updateRequestStatus, (state) => ({
        ...state,
        loading: true,  
        error: null
    })),

    on(updateRequestStatusSuccess, (state, { requestId, newStatus }) => ({
        ...state,
        loading: false,
        requests: state.requests.map(request =>
            request.id === requestId
                ? { ...request, status: newStatus }
                : request
        )
    })),

    on(updateRequestStatusFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error  
    }))
);