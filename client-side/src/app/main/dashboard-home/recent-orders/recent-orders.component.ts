// src/app/main/dashboard-home/recent-orders/recent-orders.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service'; // Adjust path if necessary
import { Transaction } from '../../../models/transaction';      // Adjust path if necessary
import { Subject, of } from 'rxjs'; // Added 'of' for catchError
import { takeUntil, map, tap, catchError, finalize } from 'rxjs/operators'; // Added necessary RxJS operators

@Component({
  selector: 'app-recent-orders',
  standalone :false,
  templateUrl: './recent-orders.component.html',
  styleUrls: ['./recent-orders.component.css']
})
export class RecentOrdersComponent implements OnInit, OnDestroy {
  recentTransactions: Transaction[] = [];
  isLoading: boolean = true;
  error: string | null = null; // This property is used in your template
  displayedColumns: string[] = ['date', 'category', 'type', 'amount', 'note']; // This property is used in your template

  private destroy$ = new Subject<void>();

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.fetchRecentTransactions();
  }

  fetchRecentTransactions(): void {
    this.isLoading = true;
    this.error = null; // Reset error state on new fetch

    this.transactionService.getTransactions()
      .pipe(
        takeUntil(this.destroy$), // Unsubscribe when component is destroyed
        map((transactions: Transaction[]): Transaction[] => { // Explicitly type 'transactions'
          // First, ensure date strings are converted to Date objects
          return transactions.map((tx: Transaction) => ({ // Explicitly type 'tx'
            ...tx,
            date: new Date(tx.date) // Convert string date to Date object
          }));
        }),
        map((processedTransactions: Transaction[]) => { // Explicitly type 'processedTransactions'
          // Sort transactions by date (now Date objects) and take the top 3
          return processedTransactions
            .sort((a: Transaction, b: Transaction) => { // Explicitly type 'a' and 'b'
                // Ensure 'date' is treated as a Date object for getTime()
                const dateA = (a.date instanceof Date) ? a.date.getTime() : new Date(a.date).getTime();
                const dateB = (b.date instanceof Date) ? b.date.getTime() : new Date(b.date).getTime();
                return dateB - dateA;
            })
            .slice(0, 3);
        }),
        tap((finalTransactions: Transaction[]) => { // Explicitly type 'finalTransactions'
          this.recentTransactions = finalTransactions;
        }),
        catchError((err: any) => { // Explicitly type 'err'
          console.error('Error fetching recent transactions:', err);
          this.error = 'Failed to load recent transactions. Please try again.';
          this.recentTransactions = []; // Clear transactions on error
          return of([]); // Return an empty array observable to allow the stream to complete
        }),
        finalize(() => {
          this.isLoading = false; // Ensure loading is set to false whether success or error
        })
      )
      .subscribe(); // Minimal subscribe as logic is in the pipe
      // If you need to do something specific on next/error beyond what's in pipe:
      // .subscribe({
      //   next: (data) => { /* console.log('Subscription next:', data); */ },
      //   error: (err) => { /* console.log('Subscription error handled by catchError'); */ }
      // });
  }

  getStatusClass(type: string): string {
    switch (type?.toLowerCase()) {
      case 'expense':
        return 'status-warning';
      case 'income':
        return 'status-success';
      case 'savings':
        return 'status-primary';
      default:
        return '';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}