import { createReducer, on } from '@ngrx/store';
import { CollectionRequest } from '../../../core/models/request.model';
import { deleteRequestSuccess, loadRequestsSuccess } from './collection-requests.actions';

export interface CollectionRequestState {
    requests: CollectionRequest[];
}

export const initialState: CollectionRequestState = {
    requests: [],
};

export const collectionRequestsReducer = createReducer(
    initialState,
    on(loadRequestsSuccess, (state, { requests }) => ({ ...state, requests })),
    on(deleteRequestSuccess, (state, { requestId }) => ({
        ...state,
        requests: state.requests.filter(req => req.id !== requestId),
    }))
);