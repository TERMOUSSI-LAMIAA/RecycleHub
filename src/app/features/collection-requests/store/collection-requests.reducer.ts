import { createReducer, on } from '@ngrx/store';
import { loadRequests } from './collection-requests.actions';
import { CollectionRequest } from '../../../core/models/request.model';

export interface RequestState {
    requests: CollectionRequest[];
}

const loadRequestsFromStorage = (): CollectionRequest[] => {
    const data = localStorage.getItem('collection_requests');
    return data ? JSON.parse(data) : [];
};

export const initialState: RequestState = {
    requests: loadRequestsFromStorage(),
};

export const requestReducer = createReducer(
    initialState,
    on(loadRequests, (state) => ({
        ...state,
        requests: loadRequestsFromStorage(), 
    })),
    // on(addRequest, (state, { request }) => {
    //     const updatedRequests = [...state.requests, request];
    //     localStorage.setItem('collectionRequests', JSON.stringify(updatedRequests)); // Persist to LocalStorage
    //     return { ...state, requests: updatedRequests };
    // })
);
