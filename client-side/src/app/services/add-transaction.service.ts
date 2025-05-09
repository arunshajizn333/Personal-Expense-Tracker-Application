import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface TransactionPayload {
  userId: string;
  type: 'income' | 'expense' | 'savings'; // Added 'savings' as it was in view-transactions
  amount: number;
  mode: string;
  category: string;
  date: string; // ISOString
  note: string; // This will be the 'title' from the form
  // The optional 'note' from the textarea is not included here based on backend example
}

@Injectable({
  providedIn: 'root'
})
export class AddTransactionService {
  private apiUrl = 'http://localhost:3000/transactions/add';

  constructor(private http: HttpClient) { }

  private getAuthDetails(): { headers: HttpHeaders, userId: string | null } {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    let userId: string | null = null;

    if (userString) {
      try {
        const user = JSON.parse(userString);
        userId = user._id || user.id; // Prefer _id, fallback to id
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }

    if (!token) {
      console.error('Authentication token not found in local storage.');
      // In a real app, you might want to redirect to login or handle this more gracefully
    }
    if (!userId) {
      console.error('User ID not found in local storage.');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return { headers, userId };
  }

  addTransaction(transactionData: Omit<TransactionPayload, 'userId'>): Observable<any> {
    const authDetails = this.getAuthDetails();

    if (!authDetails.userId) {
      return throwError(() => new Error('User ID is missing. Cannot add transaction.'));
    }
    if (!authDetails.headers.has('Authorization') || authDetails.headers.get('Authorization') === 'Bearer null') {
        return throwError(() => new Error('Authentication token is missing. Cannot add transaction.'));
    }

    const payload: TransactionPayload = {
      ...transactionData,
      userId: authDetails.userId
    };

    return this.http.post<any>(this.apiUrl, payload, { headers: authDetails.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && typeof error.error === 'string') {
        errorMessage += `\nDetails: ${error.error}`;
      } else if (error.error && error.error.message) {
        errorMessage += `\nDetails: ${error.error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
