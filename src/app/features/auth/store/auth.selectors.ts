import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "../../../core/models/user.model";

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
    selectAuthState,
    (state) => state.user
);

export const selectIsAuthenticated = createSelector(
    selectAuthState,
    (state) => state.isAuthenticated
);