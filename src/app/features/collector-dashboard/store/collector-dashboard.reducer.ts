import { createReducer, on } from "@ngrx/store";
import { CollectionRequest } from "../../../core/models/request.model";
import * as CollectionActions from './collector-dashboard.actions';

export interface CollectionState {
    availableCollections: CollectionRequest[];
    cityFilter: string;
    loading: boolean;
    error: string | null;
}

export const initialState: CollectionState = {
    availableCollections: [],
    cityFilter: '',
    loading: false,
    error: null
};

export const collectionReducer = createReducer(
    initialState,

    on(CollectionActions.loadAvailableCollections, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(CollectionActions.loadAvailableCollectionsSuccess, (state, { collections }) => ({
        ...state,
        availableCollections: collections,
        loading: false
    })),

    on(CollectionActions.loadAvailableCollectionsFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    })),

    on(CollectionActions.filterCollectionsByCity, (state, { city }) => ({
        ...state,
        cityFilter: city
    })),

    on(CollectionActions.acceptCollection, (state, { requestId }) => ({
        ...state,
        availableCollections: state.availableCollections.filter(c => c.id !== requestId)
    }))
);