// src/app/services/stats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Define an interface for the expected API response
export interface MonthlyStat {
  income: number;
  expense: number;
  savings: number | null; // savings can be null
}

export interface AnalyticsData {
  categoryStats: { [key: string]: number };
  monthlyStats: { [key: string]: MonthlyStat }; // Key is like "YYYY-M"
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private backendUrl = 'http://localhost:3000/transactions/analytics'; // Your backend URL

  constructor(private http: HttpClient) { }

  getAnalyticsData(): Observable<AnalyticsData> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found in localStorage');
      // You might want to redirect to login or handle this more gracefully
      return throwError(() => new Error('No authentication token found. Please login.'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<AnalyticsData>(this.backendUrl, { headers }).pipe(
      map(response => {
        // Basic validation or transformation if needed
        if (!response || !response.monthlyStats) {
          throw new Error('Invalid data structure received from API.');
        }
        // Process monthlyStats to ensure savings is a number
        // For simplicity, we'll take the first month's data if multiple exist
        const firstMonthKey = Object.keys(response.monthlyStats)[0];
        if (firstMonthKey) {
          const stats = response.monthlyStats[firstMonthKey];
          if (stats.savings === null) {
            // If savings is null, calculate it as income - expense
            stats.savings = stats.income - stats.expense;
          }
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.status === 401) {
        errorMessage = 'Unauthorized. Please login again.';
        // Optionally, navigate to login page
        // this.router.navigate(['/login']);
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}