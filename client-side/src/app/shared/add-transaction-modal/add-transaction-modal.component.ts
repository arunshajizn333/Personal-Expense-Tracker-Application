import { Component, ChangeDetectionStrategy, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddTransactionService, TransactionPayload } from '../../services/add-transaction.service'; // Adjust path if needed
import { MatSelectChange } from '@angular/material/select';

interface TransactionFormModel {
  title: string; // This will map to backend 'note'
  amount: number | null;
  category: string;
  type: 'income' | 'expense' | 'savings';
  mode: string;
  date: Date;
  note?: string; // Optional note from textarea, currently not sent to backend
}

@Component({
  selector: 'app-add-transaction-modal',
  standalone :false,
  templateUrl: './add-transaction-modal.component.html',
  styleUrls: ['./add-transaction-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
  // standalone: false, // Keep if not using standalone components
})
export class AddTransactionModalComponent implements OnInit {
  transaction: TransactionFormModel = {
    title: '',
    amount: null,
    category: '',
    type: 'expense', // Default to expense
    mode: 'cash',
    date: new Date(), // Default to today
    note: ''
  };

  availableCategories: string[] = ['Groceries', 'Salary', 'Freelance', 'Rent', 'Utilities', 'Transport', 'Entertainment', 'Healthcare', 'Education', 'Savings Contribution', 'Investment'];
  showAddCategoryField: boolean = false;
  newCategory: string = '';

  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddTransactionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // For potential data passed into the dialog
    private addTransactionService: AddTransactionService
  ) {}

  ngOnInit(): void {
    // You can load categories from a service or localStorage if they are dynamic
    const storedCategories = localStorage.getItem('userCategories');
    if (storedCategories) {
      try {
        const uniqueCategories = new Set([...this.availableCategories, ...JSON.parse(storedCategories)]);
        this.availableCategories = Array.from(uniqueCategories);
      } catch (e) {
        console.error("Error parsing categories from localStorage", e);
      }
    }
  }

  onCategoryChange(event: MatSelectChange): void {
    if (event.value === 'addCustom') {
      this.showAddCategoryField = true;
      // Important: Clear the actual category selection if 'addCustom' was chosen
      // so the form doesn't try to submit 'addCustom' as a category.
      this.transaction.category = '';
    } else {
      this.showAddCategoryField = false;
      this.transaction.category = event.value;
    }
  }

  addCustomCategory(): void {
    const trimmedCategory = this.newCategory.trim();
    if (trimmedCategory && !this.availableCategories.some(cat => cat.toLowerCase() === trimmedCategory.toLowerCase())) {
      this.availableCategories.push(trimmedCategory);
      this.availableCategories.sort(); // Keep it sorted
      this.transaction.category = trimmedCategory; // Automatically select the new category
      this.newCategory = '';
      this.showAddCategoryField = false;

      // Save updated categories to localStorage
      const userAddedCategories = this.availableCategories.filter(cat => !['Groceries', 'Salary', 'Freelance', 'Rent', 'Utilities', 'Transport', 'Entertainment', 'Healthcare', 'Education', 'Savings Contribution', 'Investment'].includes(cat));
      localStorage.setItem('userCategories', JSON.stringify(userAddedCategories));

    } else if (trimmedCategory) {
      // Category already exists, select it
      this.transaction.category = this.availableCategories.find(cat => cat.toLowerCase() === trimmedCategory.toLowerCase()) || '';
      this.newCategory = '';
      this.showAddCategoryField = false;
    }
  }

  cancelAddCategory(): void {
    this.showAddCategoryField = false;
    this.newCategory = '';
    // If 'addCustom' was selected and then cancelled, category might be empty.
    // Optionally, reset to a default or leave as is for user to re-select.
    if (this.transaction.category === 'addCustom' || this.transaction.category === '') {
        // this.transaction.category = ''; // Or set to a default if desired
    }
  }

  onSaveTransaction(): void {
    this.errorMessage = null; // Clear previous errors
    if (!this.transaction.title.trim()) {
      this.errorMessage = "Title is required.";
      return;
    }
    if (this.transaction.amount === null || this.transaction.amount <= 0) {
      this.errorMessage = "Amount must be a positive number.";
      return;
    }
    if (!this.transaction.category) {
      this.errorMessage = "Category is required.";
      return;
    }
    if (!this.transaction.date) {
      this.errorMessage = "Date is required.";
      return;
    }

    this.isLoading = true;

    const payload: Omit<TransactionPayload, 'userId'> = {
      note: this.transaction.title.trim(), // Mapping 'title' to 'note' for backend
      amount: this.transaction.amount,
      category: this.transaction.category,
      date: new Date(this.transaction.date).toISOString(), // Ensure ISO string format
      type: this.transaction.type,
      mode: this.transaction.mode,
      // The form's 'note' (textarea) is currently not sent as per backend example.
      // If needed, it would be: additionalNote: this.transaction.note
    };

    this.addTransactionService.addTransaction(payload)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Transaction added successfully:', response);
          this.dialogRef.close({ success: true, data: response }); // Pass success and response
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Failed to add transaction. Please try again.';
          console.error('Error adding transaction:', error);
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
