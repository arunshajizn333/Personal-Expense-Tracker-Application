// src/app/main/dashboard-home/dashboard-home.component.ts
import { Component, inject, OnInit } from '@angular/core'; // Import OnInit
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionModalComponent } from '../../../shared/add-transaction-modal/add-transaction-modal.component';
import { UserService, User } from '../../../services/user.service'; // Adjust path to your UserService

@Component({
  selector: 'app-dashboard-home',
  standalone: false,
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'], // Use styleUrls
})
export class DashboardHomeComponent implements OnInit { // Implement OnInit
  isLightTheme: boolean = true; // Default theme is light
  userName: string = 'Guest'; // Property to hold the formatted user name

  readonly dialog = inject(MatDialog);
  // Inject your UserService
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Load user name when the component initializes
    this.loadUserName();
  }

  loadUserName(): void {
    // Get the current user value directly from the UserService BehaviorSubject
    const user: User | null = this.userService.currentUserValue;

    // Assuming the user object has a 'userName' property
    if (user && user.userName) {
      // Format the username to Proper Case
      this.userName = this.toProperCase(user.userName);
    } else {
      // Fallback if user or username is not found
      this.userName = 'Guest';
    }
  }

  // Helper function to convert string to Proper Case
  private toProperCase(name: string): string {
    // Handle null/undefined input
    if (!name) return '';
    return name.toLowerCase().split(' ').map(word => {
      if (!word) return ''; // Handle multiple spaces
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  // toggleSideMenu() {
  //   // This state should be managed by the parent (main component)
  // }

  toggleTheme() {
    this.isLightTheme = !this.isLightTheme;
    document.body.classList.toggle('dark-theme-variables', !this.isLightTheme);
  }

  addTransaction(): void {
    const dialogRef = this.dialog.open(AddTransactionModalComponent, {
      width: '500px', // Optional size
      disableClose: true, // Prevent closing by clicking outside
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Transaction data:', result);
        // Optionally call a service to save the transaction
        // e.g., this.transactionService.addTransaction(result).subscribe(...);
      }
    });
  }
}
