import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionModalComponent } from '../../shared/add-transaction-modal/add-transaction-modal.component';
import { Transaction } from '../../models/transaction';
import { TransactionService } from '../../services/transaction.service'; // Adjust path
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

// Define a type for summary calculations
interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  netFlow: number;
}
@Component({
  selector: 'app-view-transactions',
   standalone: false,
  templateUrl: './view-transactions.component.html',
  styleUrls: ['./view-transactions.component.css']
  // standalone: false, // Keep this if you are not using standalone components yet
})
export class ViewTransactionsComponent implements OnInit, OnDestroy {
  allTransactions: Transaction[] = []; // Stores all transactions from the backend
  filteredTransactions: Transaction[] = []; // Stores transactions after filtering
  paginatedTransactions: Transaction[] = [];

  isLoading: boolean = true;
  errorMessage: string | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 8; // Adjusted for potentially more data

  // Filtering properties
  filterDateStart: string = '';
  filterDateEnd: string = '';
  filterType: 'all' | 'income' | 'expense' | 'savings' = 'all';

  transactionSummary: TransactionSummary = {
    totalIncome: 0,
    totalExpense: 0,
    totalSavings: 0,
    netFlow: 0
  };


  private transactionSubscription: Subscription | undefined;
  readonly dialog = inject(MatDialog);
  private transactionService = inject(TransactionService);

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.transactionSubscription = this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        // Convert date strings to Date objects
        this.allTransactions = transactions.map(txn => ({
          ...txn,
          date: new Date(txn.date) // Ensure date is a Date object
        }));
        this.applyFiltersAndPagination();
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Failed to load transactions:', error);
        this.errorMessage = `Failed to load transactions. ${error.message || 'Server error'}`;
        this.isLoading = false;
        // Potentially handle specific error codes, e.g., 401 Unauthorized for token issues
        if (error.status === 401) {
          this.errorMessage += " Please check your login session.";
          // Optionally, redirect to login page: this.router.navigate(['/login']);
        }
      }
    });
  }

  applyFiltersAndPagination(): void {
    let tempTransactions = [...this.allTransactions];

    // Apply type filter
    if (this.filterType !== 'all') {
      tempTransactions = tempTransactions.filter(txn => txn.type === this.filterType);
    }

    // Apply date filter
    if (this.filterDateStart) {
      const startDate = new Date(this.filterDateStart);
      startDate.setHours(0, 0, 0, 0); // Start of the day
      tempTransactions = tempTransactions.filter(txn => new Date(txn.date) >= startDate);
    }
    if (this.filterDateEnd) {
      const endDate = new Date(this.filterDateEnd);
      endDate.setHours(23, 59, 59, 999); // End of the day
      tempTransactions = tempTransactions.filter(txn => new Date(txn.date) <= endDate);
    }

    // Sort by date (most recent first) by default
    tempTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    this.filteredTransactions = tempTransactions;
    this.calculateSummary();
    this.updatePagination();
  }


  calculateSummary(): void {
    this.transactionSummary = this.filteredTransactions.reduce((acc, txn) => {
      if (txn.type === 'income') {
        acc.totalIncome += txn.amount;
      } else if (txn.type === 'expense') {
        acc.totalExpense += txn.amount;
      } else if (txn.type === 'savings') {
        acc.totalSavings += txn.amount;
      }
      return acc;
    }, { totalIncome: 0, totalExpense: 0, totalSavings: 0, netFlow: 0 });

    this.transactionSummary.netFlow = this.transactionSummary.totalIncome - this.transactionSummary.totalExpense - this.transactionSummary.totalSavings;
  }


  resetFilters(): void {
    this.filterDateStart = '';
    this.filterDateEnd = '';
    this.filterType = 'all';
    this.applyFiltersAndPagination();
  }


  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTransactions = this.filteredTransactions.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  addTransactionDialog(): void {
    const dialogRef = this.dialog.open(AddTransactionModalComponent, {
      width: '550px',
      disableClose: true,
      panelClass: 'custom-dialog-container' // For custom styling of the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        // Assuming result is Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt' | '__v'>
        this.transactionService.addTransaction(result).subscribe({
          next: (newTransaction) => {
            // this.allTransactions.push({...newTransaction, date: new Date(newTransaction.date)}); // Or reload all
            // this.applyFiltersAndPagination();
            this.loadTransactions(); // Easiest way to ensure data consistency and sorting
            console.log('Transaction added successfully from modal:', newTransaction);
          },
          error: (err) => {
            this.errorMessage = `Failed to add transaction. ${err.message || 'Server error'}`;
            this.isLoading = false;
          }
        });
      }
    });
  }

  deleteTransaction(id: string): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.isLoading = true;
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          // this.allTransactions = this.allTransactions.filter(t => t._id !== id);
          // this.applyFiltersAndPagination();
          this.loadTransactions(); // Reload to ensure consistency
          console.log(`Transaction ${id} deleted`);
        },
        error: (err) => {
          this.errorMessage = `Failed to delete transaction. ${err.message || 'Server error'}`;
          this.isLoading = false;
        }
      });
    }
  }

  onFileUpload(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.isLoading = true;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const header = lines.shift()?.toLowerCase(); // Remove and get header

      if (!header || !this.isValidCSVHeader(header.split(','))) {
          this.errorMessage = "Invalid CSV header. Expected: type,amount,mode,category,date,note";
          this.isLoading = false;
          event.target.value = null; // Reset file input
          return;
      }

      const newTransactions: Partial<Transaction>[] = [];
      for (let line of lines) {
        const [type, amount, mode, category, date, note] = line.split(',');
        if (!type || !amount || !mode || !category || !date || !note ) {
            console.warn('Skipping invalid CSV line:', line);
            continue; // Skip malformed lines
        }
        newTransactions.push({
          type: type.trim() as 'income' | 'expense' | 'savings',
          amount: +amount.trim(),
          mode: mode.trim(),
          category: category.trim(),
          date: new Date(date.trim()), // Ensure date is parsed correctly
          note: note.trim()
        });
      }

      if (newTransactions.length > 0) {
        // Option 1: Send one by one (safer, but more requests)
        // This is a simplified example; you might want to use Promise.all or forkJoin for better handling
        let successfulUploads = 0;
        newTransactions.forEach(txn => {
          this.transactionService.addTransaction(txn as Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt' | '__v'>)
            .subscribe({
              next: () => {
                successfulUploads++;
                if (successfulUploads === newTransactions.length) {
                  this.loadTransactions(); // Reload all after all uploads are done
                }
              },
              error: (err) => console.error('Error uploading transaction from CSV:', err)
            });
        });
        if (successfulUploads === 0 && newTransactions.length > 0) { // if all failed to start
            this.isLoading = false;
            event.target.value = null;
        }


        // Option 2: Use a bulk upload endpoint if available (more efficient)
        /*
        this.transactionService.uploadTransactions(newTransactions).subscribe({
          next: () => {
            this.loadTransactions();
            console.log('CSV transactions uploaded successfully');
          },
          error: (err) => {
            this.errorMessage = `Failed to upload CSV. ${err.message || 'Server error'}`;
            this.isLoading = false;
          }
        });
        */
      } else {
          this.errorMessage = "No valid transactions found in the CSV file.";
          this.isLoading = false;
      }
      event.target.value = null; // Reset file input
    };
    reader.onerror = () => {
        this.errorMessage = "Failed to read the file.";
        this.isLoading = false;
        event.target.value = null;
    };
    reader.readAsText(file);
  }

  isValidCSVHeader(headerArray: string[]): boolean {
    const expectedHeaders = ['type', 'amount', 'mode', 'category', 'date', 'note'];
    if (headerArray.length !== expectedHeaders.length) return false;
    return expectedHeaders.every((value, index) => value === headerArray[index].trim().toLowerCase());
  }

  downloadCSV(): void {
    if (this.filteredTransactions.length === 0) {
        alert("No transactions available to download for the current filter.");
        return;
    }
    const headers = ['Date', 'Category', 'Note', 'Amount', 'Mode', 'Type'];
    const rows = this.filteredTransactions.map(t =>
      [
        (t.date instanceof Date ? t.date.toLocaleDateString('en-CA') : new Date(t.date).toLocaleDateString('en-CA')), // YYYY-MM-DD for consistency
        t.category,
        t.note,
        t.amount,
        t.mode,
        t.type
      ].join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    if (link.download !== undefined) { // Feature detection
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'transactions_report.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } else {
        alert("CSV download is not supported by your browser.");
    }
  }

  ngOnDestroy(): void {
    if (this.transactionSubscription) {
      this.transactionSubscription.unsubscribe();
    }
  }
  // Add this new method to your ViewTransactionsComponent class

  handleCsvFileFromDropzone(file: File): void {
    if (!file) {
      this.errorMessage = "No file received from dropzone.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null; // Clear previous errors

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const lines = text.split('\n').map(line => line.trim()).filter(line => line); // Trim and remove empty lines
        
        if (lines.length <= 1) {
          this.errorMessage = "CSV file is empty or contains only a header.";
          this.isLoading = false;
          return;
        }

        const headerLine = lines.shift()?.toLowerCase(); // Remove and get header, convert to lowercase for case-insensitive comparison

        if (!headerLine || !this.isValidCSVHeader(headerLine.split(','))) {
            this.errorMessage = "Invalid CSV header. Expected: type,amount,mode,category,date,note (order matters, case insensitive)";
            this.isLoading = false;
            return;
        }

        const newTransactions: Partial<Transaction>[] = [];
        let lineNumber = 1; // For error reporting
        for (let line of lines) {
          lineNumber++;
          const values = line.split(',');
          if (values.length !== 6) { // Assuming 6 columns based on your isValidCSVHeader
            console.warn(`Skipping malformed CSV line ${lineNumber}: ${line}. Expected 6 values, got ${values.length}.`);
            // Optionally, collect these errors to show to the user
            continue; 
          }
          const [type, amount, mode, category, date, note] = values.map(v => v.trim());

          if (!type || !amount || !mode || !category || !date || !note ) {
              console.warn(`Skipping CSV line ${lineNumber} due to missing values: ${line}`);
              continue;
          }
          if (isNaN(parseFloat(amount))) {
              console.warn(`Skipping CSV line ${lineNumber} due to invalid amount: ${amount}`);
              continue;
          }
          const parsedDate = new Date(date);
          if (isNaN(parsedDate.getTime())) {
              console.warn(`Skipping CSV line ${lineNumber} due to invalid date: ${date}`);
              continue;
          }

          newTransactions.push({
            type: type.toLowerCase() as 'income' | 'expense' | 'savings', // Ensure type is lowercase
            amount: +amount,
            mode: mode,
            category: category,
            date: parsedDate,
            note: note
          });
        }

        if (newTransactions.length > 0) {
          // Upload transactions one by one
          // For a more robust solution with many transactions, consider batching
          // or a dedicated bulk endpoint in your backend.
          let successfulUploads = 0;
          let failedUploads = 0;
          const totalToUpload = newTransactions.length;

          newTransactions.forEach((txn, index) => {
            this.transactionService.addTransaction(txn as Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt' | '__v'>)
              .subscribe({
                next: () => {
                  successfulUploads++;
                },
                error: (err) => {
                  failedUploads++;
                  console.error('Error uploading a transaction from CSV:', err);
                  // You might want to collect these errors to display to the user
                },
                complete: () => {
                  // Check if all uploads have finished (succeeded or failed)
                  if (successfulUploads + failedUploads === totalToUpload) {
                    if (failedUploads > 0) {
                        this.errorMessage = `${failedUploads} transaction(s) failed to upload from CSV. ${successfulUploads} uploaded. Check console for details.`;
                    } else {
                        // Success message can be handled by a toast notification or similar
                        console.log(`${successfulUploads} transactions uploaded successfully.`);
                    }
                    this.loadTransactions(); // Reload all transactions
                  }
                }
              });
          });
          if (totalToUpload === 0) { // Should not happen if newTransactions.length > 0, but as a safeguard
              this.isLoading = false;
          }
        } else {
            this.errorMessage = "No valid transactions found in the CSV file to upload.";
            this.isLoading = false;
        }
      } catch (e) {
        console.error("Error processing CSV file:", e);
        this.errorMessage = "An error occurred while processing the CSV file.";
        this.isLoading = false;
      }
    };

    reader.onerror = () => {
        this.errorMessage = "Failed to read the uploaded file.";
        this.isLoading = false;
    };

    reader.readAsText(file);
  }

  // You already have this method, ensure it's robust:
  // isValidCSVHeader(headerArray: string[]): boolean {
  //   const expectedHeaders = ['type', 'amount', 'mode', 'category', 'date', 'note'];
  //   if (headerArray.length !== expectedHeaders.length) return false;
  //   return expectedHeaders.every((value, index) => value === headerArray[index].trim().toLowerCase());
  // }

}