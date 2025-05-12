// src/app/core/services/session.service.ts
// Adjust path based on your folder structure, e.g., src/app/services/session.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, timer, Subscription } from 'rxjs'; // Import timer and Subscription
import { User } from '../models/user'; // Assuming you have a User model interface

@Injectable({
  providedIn: 'root' // Provided in root, accessible application-wide
})
export class SessionService {

  private tokenSubject: BehaviorSubject<string | null>;
  public token$: Observable<string | null>;

  private userSubject: BehaviorSubject<User | null>;
  public user$: Observable<User | null>;

  private tokenTimerSubscription: Subscription | null = null; // To manage the auto-logout timer

  constructor(private router: Router) {
    // Initialize subjects from localStorage on service creation
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    this.tokenSubject = new BehaviorSubject<string | null>(storedToken);
    this.token$ = this.tokenSubject.asObservable();

    this.userSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.user$ = this.userSubject.asObservable();

    // If a token exists on service creation (e.g., after page refresh),
    // set up the auto-logout timer based on remaining time or a fixed duration
    if (storedToken) {
      // IMPORTANT: If your backend provides token expiration time, use that
      // to calculate the remaining time and set the timer accordingly.
      // For this example, we'll use a fixed 1-hour timer after service init
      // if a token is found. A more robust solution would decode the JWT expiry.
       this.startAutoLogoutTimer(3600 * 1000); // 3600 seconds * 1000 ms/sec = 1 hour
    }
  }

  // Get the current token value synchronously
  public get currentTokenValue(): string | null {
    return this.tokenSubject.value;
  }

  // Get the current user value synchronously
  public get currentUserValue(): User | null {
    return this.userSubject.value;
  }

  // Call this method after a successful login response from AuthService
  startSession(token: string, user: User): void {
    // Store token and user data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    // Update subjects
    this.tokenSubject.next(token);
    this.userSubject.next(user);

    // Start the auto-logout timer
    // IMPORTANT: Replace 3600 * 1000 with the actual token expiration time in milliseconds
    // You might need to decode the JWT token to get the 'exp' claim.
    // Example (using a hypothetical jwtDecode function):
    // const decodedToken = jwtDecode(token);
    // const expiryTime = decodedToken.exp * 1000; // exp is usually in seconds
    // const currentTime = Date.now();
    // const remainingTime = expiryTime - currentTime;
    // this.startAutoLogoutTimer(remainingTime);
    this.startAutoLogoutTimer(3600 * 1000); // Using fixed 1 hour for demonstration
  }

  // Starts the timer for automatic logout
  private startAutoLogoutTimer(durationMs: number): void {
    // Clear any existing timer
    if (this.tokenTimerSubscription) {
      this.tokenTimerSubscription.unsubscribe();
    }

    // Start a new timer
    this.tokenTimerSubscription = timer(durationMs).subscribe(() => {
      console.log('Token expired, performing automatic logout.');
      this.logout(); // Perform logout when timer finishes
    });
  }

  // Performs the logout action
  logout(): void {
    console.log('Logging out...');
    // Clear data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear subjects
    this.tokenSubject.next(null);
    this.userSubject.next(null);

    // Stop the auto-logout timer
    if (this.tokenTimerSubscription) {
      this.tokenTimerSubscription.unsubscribe();
      this.tokenTimerSubscription = null;
    }

    // Navigate to the login page
    this.router.navigate(['/login']); // Or your designated login page
  }

  // Optional: Check if the user is currently logged in
  isLoggedIn(): boolean {
    return !!this.currentTokenValue;
  }

  // Optional: Check if the token is potentially expired (frontend check - less reliable than backend 401)
  // This would require decoding the JWT token to get its expiration time ('exp' claim)
  // isTokenExpired(): boolean {
  //   const token = this.currentTokenValue;
  //   if (!token) return true;
  //   try {
  //     const decodedToken = jwtDecode(token); // Requires a JWT decoding library
  //     const expiryTime = decodedToken.exp * 1000;
  //     return Date.now() >= expiryTime;
  //   } catch (error) {
  //     console.error('Error decoding token:', error);
  //     return true; // Assume expired if decoding fails
  //   }
  // }
}
