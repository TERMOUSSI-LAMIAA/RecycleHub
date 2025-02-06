import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CollectionRequestState } from "./collection-requests.reducer";

export const selectRequestState = createFeatureSelector<CollectionRequestState>('collectionRequests');

export const selectRequests = createSelector(
    selectRequestState,
    (state) => state.requests
);