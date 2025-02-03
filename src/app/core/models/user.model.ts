export interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    birthDate: Date;
    profileImage?: string;
    userType: 'collector' | 'individual';
    city: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    error: string | null;
    loading: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    birthDate: Date;
    profileImage?: string;
    city: string;
}