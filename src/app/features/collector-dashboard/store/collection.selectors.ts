import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CollectionState } from "./collector-dashboard.reducer";

export const selectCollectionState = createFeatureSelector<CollectionState>('collection');
export const selectAvailableCollections = createSelector(
    selectCollectionState,
    (state) => state.availableCollections.filter(c =>
        !state.cityFilter || c.collectAddress.toLowerCase().includes(state.cityFilter.toLowerCase())
    )
);