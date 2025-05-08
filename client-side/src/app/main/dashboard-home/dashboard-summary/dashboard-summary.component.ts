import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-summary',
  standalone: false,
  templateUrl: './dashboard-summary.component.html',
  styleUrl: './dashboard-summary.component.css'
})
export class DashboardSummaryComponent {
  totalIncome = 25024;
  totalExpenses = 14200;
  totalSavings = 32000;
  totalBalance = 32000;

}
