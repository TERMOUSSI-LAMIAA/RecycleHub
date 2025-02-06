import { CollectionRequest } from "../../../core/models/request.model";

export interface RequestState {
    requests: CollectionRequest[];
    loading: boolean;
    error: string | null;
}

export const initialRequestState: RequestState = {
    requests: [],
    loading: false,
    error: null,
};