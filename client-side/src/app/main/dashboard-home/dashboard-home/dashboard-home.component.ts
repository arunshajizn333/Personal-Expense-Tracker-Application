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

  openAddTransactionModal(): void {
    const dialogRef = this.dialog.open(AddTransactionModalComponent, {
      width: '500px', // optional
      disableClose: true, // optional
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Transaction data:', result);
        // Call service to save transaction or update local data
      }
    });
  }
}
