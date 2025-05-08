import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-transaction-modal',
  standalone: false,
  templateUrl: './add-transaction-modal.component.html',
  styleUrls: ['./add-transaction-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTransactionModalComponent {
  transaction = {
    title: '',
    amount: null,
    category: '',
    type: 'income',
    mode: 'cash',
    date: new Date(),
    note: ''
  };

  // List of available categories (predefined and custom)
  availableCategories: string[] = ['Food', 'Travel', 'Entertainment', 'Investments'];
  showAddCategoryField: boolean = false;
  newCategory: string = '';
  selectedCategories: string[] = []; // Stores categories selected by the user

  constructor(private dialogRef: MatDialogRef<AddTransactionModalComponent>) {}

  // Handle adding a custom category
  addCustomCategory(): void {
    this.showAddCategoryField = true;
  }

  // Handle adding a new category to the list
  addCategory(): void {
    if (this.newCategory && !this.availableCategories.includes(this.newCategory)) {
      this.availableCategories.push(this.newCategory);  // Add to available categories
      this.selectedCategories.push(this.newCategory);  // Automatically select it
      this.transaction.category = this.newCategory;  // Set the category
      this.newCategory = ''; // Reset the input field
      this.showAddCategoryField = false; // Hide the add category field after adding
    }
  }

  // Cancel the adding of a new category
  cancelAddCategory(): void {
    this.showAddCategoryField = false;
    this.newCategory = ''; // Reset input
  }

  // Remove a selected category from the selected categories list
  removeCategory(category: string): void {
    this.selectedCategories = this.selectedCategories.filter(cat => cat !== category);
  }

  // Handle adding the transaction
  addTransaction(formValues: any): void {
    if (formValues) {
      console.log(formValues); // Here you can send the form values to your backend API
      this.dialogRef.close(formValues); // Close the dialog and pass data back
    }
  }

}
