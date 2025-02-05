import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RequestState } from "./collection-requests.reducer";

export const selectRequestState = createFeatureSelector<RequestState>('requests');

export const selectRequests = createSelector(
    selectRequestState,
    (state) => state.requests
);