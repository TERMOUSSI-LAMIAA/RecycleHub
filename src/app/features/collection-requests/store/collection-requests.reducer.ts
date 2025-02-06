import { createReducer, on } from '@ngrx/store';
import { CollectionRequest } from '../../../core/models/request.model';
import { createRequest, createRequestFailure, createRequestSuccess, deleteRequestSuccess, loadRequestsSuccess } from './collection-requests.actions';

export interface CollectionRequestState {
    requests: CollectionRequest[];
    error: string | null;
}

export const initialState: CollectionRequestState = {
    requests: [],
    error: null
};

export const collectionRequestsReducer = createReducer(
    initialState,
    on(loadRequestsSuccess, (state, { requests }) => ({ ...state, requests })),
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
    on(createRequestFailure, (state, { error }) => ({
        ...state,
        error
    }))
);