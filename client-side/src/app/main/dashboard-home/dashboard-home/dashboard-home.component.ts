import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionModalComponent } from '../../../shared/add-transaction-modal/add-transaction-modal.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: false,
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
})
export class DashboardHomeComponent {
  isLightTheme: boolean = true; // Default theme is light
  sideMenuVisible: boolean = false;

  toggleSideMenu() {
    this.sideMenuVisible = !this.sideMenuVisible;
  }

  toggleTheme() {
    this.isLightTheme = !this.isLightTheme;
    document.body.classList.toggle('dark-theme-variables', !this.isLightTheme);
  }
  readonly dialog = inject(MatDialog);

  addTransaction(): void {
    const dialogRef = this.dialog.open(AddTransactionModalComponent, {
      width: '500px', // Optional size
      disableClose: true, // Prevent closing by clicking outside
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Transaction data:', result);
        // Optionally call a service to save the transaction
      }
    });
  }
}
