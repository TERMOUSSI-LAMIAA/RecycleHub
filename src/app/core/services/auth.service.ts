import { Injectable } from '@angular/core';
import { LoginCredentials, RegisterCredentials, User } from '../models/user.model';
import { BehaviorSubject, delay, Observable, of, throwError } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'currentUser';

  // Add a BehaviorSubject to track authentication state
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    this.initializeCollectors();
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const user = this.getCurrentUser();
    this.currentUserSubject.next(user);
  }
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  login(credentials: LoginCredentials): Observable<User> {
    const users = this.getUsers();
    const user = users.find(u =>
      u.email === credentials.email &&
      u.password === credentials.password
    );

    if (user) {
      this.localStorageService.setItem(
        this.CURRENT_USER_KEY,
        JSON.stringify(user)
      );
      this.currentUserSubject.next(user);
      return of(user).pipe(delay(1000));
    }
    return throwError(() => new Error('Invalid credentials'));
  }

  register(credentials: RegisterCredentials): Observable<User> {
    const users = this.getUsers();
    if (users.some(u => u.email === credentials.email)) {
      return throwError(() => new Error('Email already exists'));
    }

    const newUser: User = {
      id: Date.now().toString(),
      ...credentials,
      userType: 'individual'
    };

    users.push(newUser);
    this.localStorageService.setItem(
      this.USERS_KEY,
      JSON.stringify(users)
    );
    this.localStorageService.setItem(
      this.CURRENT_USER_KEY,
      JSON.stringify(newUser)
    );
    this.currentUserSubject.next(newUser);
    return of(newUser).pipe(delay(1000));
  }

  logout(): void {
    this.localStorageService.removeItem(this.CURRENT_USER_KEY);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    const userStr = this.localStorageService.getItem(this.CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private getUsers(): User[] {
    const usersStr = this.localStorageService.getItem(this.USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  }

  private initializeCollectors(): void {
    const users = this.getUsers();
    if (!users.some(u => u.userType === 'collector')) {
      const collectors: User[] = [
        {
          id: 'collector1',
          email: 'collector1@recyclehub.com',
          password: 'collector123',
          firstName: 'John',
          lastName: 'Collector',
          address: '123 Collection St',
          phone: '0612345678',
          birthDate: new Date('1990-01-01'),
          userType: 'collector',
          city: 'Casablanca'
        }
      ];
      this.localStorageService.setItem(
        this.USERS_KEY,
        JSON.stringify([...users, ...collectors])
      );
    }
  }

  updateUser(updatedUserData: Partial<User>): Observable<User> {
    const users = this.getUsers();
    const currentUser = this.getCurrentUser();

    if (currentUser) {
      const index = users.findIndex(u => u.id === currentUser.id);
      if (index !== -1) {
        // Update user data
        users[index] = { ...users[index], ...updatedUserData };
        this.localStorageService.setItem(this.USERS_KEY, JSON.stringify(users));
        this.localStorageService.setItem(this.CURRENT_USER_KEY, JSON.stringify(users[index]));
        this.currentUserSubject.next(users[index]); // Update current user
        return of(users[index]).pipe(delay(1000)); // Simulate delay for demo purposes
      }
    }

    return throwError(() => new Error('User not found'));
  }

  deleteAccount(): Observable<void> {
    const users = this.getUsers();
    const currentUser = this.getCurrentUser();

    if (currentUser) {
      const updatedUsers = users.filter(u => u.id !== currentUser.id);
      this.localStorageService.setItem(this.USERS_KEY, JSON.stringify(updatedUsers));
      this.localStorageService.removeItem(this.CURRENT_USER_KEY);
      this.currentUserSubject.next(null); // Clear current user
      return of(undefined).pipe(delay(1000)); // Simulate delay for demo purposes
    }

    return throwError(() => new Error('User not found'));
  }
}
