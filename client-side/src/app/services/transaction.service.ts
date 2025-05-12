import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Transaction } from '../models/transaction'; // Make sure this path is correct

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000/transactions/transactions'; // Your API endpoint
  private deleteApiUrl = 'http://localhost:3000/transactions'; // Your API endpoint

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      // Handle cases where token is not available, e.g., redirect to login
      console.error('Token not found in local storage');
      // Potentially throw an error or navigate to login
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(
        tap(transactions => console.log('Fetched transactions:', transactions)),
        catchError(this.handleError)
      );
  }

  addTransaction(transaction: Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt' | '__v'>): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction, { headers: this.getAuthHeaders() })
      .pipe(
        tap(newTransaction => console.log('Added transaction:', newTransaction)),
        catchError(this.handleError)
      );
  }

   deleteTransaction(id: string): Observable<any> {
    // Construct the full URL using the corrected base URL and the transaction ID
    // Now it will be 'http://localhost:3000/transactions/transaction-id'
    const url = `${this.deleteApiUrl}/${id}`;
    console.log('Frontend: Sending DELETE request to', url); // Log the corrected URL

    return this.http.delete(url, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => console.log(`Frontend: Successfully sent delete request for transaction id: ${id}`)),
        catchError(this.handleError)
      );
  }


  
  // Optional: If your backend supports bulk upload via a specific endpoint
  uploadTransactions(transactions: Partial<Transaction>[]): Observable<any> {
    // This assumes your backend has an endpoint for bulk uploading.
    // Adjust the endpoint and payload structure as needed.
    const bulkUploadUrl = `${this.apiUrl}/bulk`; // Example, replace with your actual bulk endpoint
    return this.http.post(bulkUploadUrl, transactions, { headers: this.getAuthHeaders() })
      .pipe(
        tap(response => console.log('Bulk upload response:', response)),
        catchError(this.handleError)
      );
  }


  private handleError(error: any) {
    console.error('API Error:', error);
    // You could implement more sophisticated error handling here,
    // like transforming the error message for user consumption.
    return throwError(() => new Error('An error occurred. Please try again later.'));
  }
}