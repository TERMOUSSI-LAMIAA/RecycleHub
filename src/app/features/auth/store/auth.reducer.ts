import { createReducer, on } from "@ngrx/store";
import { AuthState } from "../../../core/models/user.model";
import * as AuthActions from './auth.actions';

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    error: null,
    loading: false,
    
};

export const authReducer = createReducer(
    initialState,
    on(AuthActions.login, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(AuthActions.loginSuccess, (state, { user }) => ({
        ...state,
        user,
        isAuthenticated: true,
        loading: false,
        error: null
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    })),
    on(AuthActions.register, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(AuthActions.registerSuccess, (state, { user }) => ({
        ...state,
        user,
        isAuthenticated: true,
        loading: false,
        error: null
    })),
    on(AuthActions.registerFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    })),
    on(AuthActions.logout, () => initialState)
);