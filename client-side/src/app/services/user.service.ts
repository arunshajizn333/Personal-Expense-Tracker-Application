// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  _id: string;
  userName: string;
  email: string;
  // Add other user properties if available from your backend response
  // e.g., createdAt, updatedAt, etc.
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/user'; // Base URL for user endpoints
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('user');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Assuming Bearer token authentication
    });
  }

  getUserProfile(): Observable<User> {
    // This method could be used if you have a GET /profile endpoint
    // For now, we'll rely on localStorage and update it after a PUT
    // If you want to fetch fresh data from backend on component load, implement this
    // return this.http.get<User>(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() });
    // For now, let's assume the user data in localStorage is the source of truth initially
    if (this.currentUserValue) {
      return new Observable(observer => observer.next(this.currentUserValue as User));
    }
    // Or handle case where user is not in local storage but token exists
    // Potentially redirect to login or try to fetch profile
    return throwError(() => new Error('User not found in local storage.'));
  }

  updateUserProfile(userData: { userName?: string; email?: string }): Observable<{ message: string; user: User }> {
    if (!userData.userName && !userData.email) {
      return throwError(() => new Error('At least one field (username or email) is required for update.'));
    }
    return this.http.put<{ message: string; user: User }>(`${this.apiUrl}/profile`, userData, { headers: this.getAuthHeaders() })
      .pipe(
        tap(response => {
          // Update localStorage and BehaviorSubject with the new user data
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']); // Or your designated logout/login page
    // You might want to add a backend call to invalidate the token if your backend supports it
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}