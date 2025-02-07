import { createAction, props } from "@ngrx/store";
import { CollectionRequest } from "../../../core/models/request.model";

export const loadAvailableCollections = createAction('[Collection] Load Available');
export const loadAvailableCollectionsSuccess = createAction(
    '[Collection] Load Available Success',
    props<{ collections: CollectionRequest[] }>()
);

export const loadAvailableCollectionsFailure = createAction(
    '[Collection] Load Available Failure',
    props<{ error: string }>()
)
export const filterCollectionsByCity = createAction(
    '[Collection] Filter By City',
    props<{ city: string }>()
);
export const acceptCollection = createAction(
    '[Collection] Accept',
    props<{ requestId: string }>()
);