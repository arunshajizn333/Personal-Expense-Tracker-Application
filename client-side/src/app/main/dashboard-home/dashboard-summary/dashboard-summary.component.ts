// src/app/components/dashboard-summary/dashboard-summary.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { StatsService, AnalyticsData, MonthlyStat } from "../../../services/stats.service";
@Component({
  selector: 'app-dashboard-summary',
  standalone: false, // If your component is standalone
  templateUrl: './dashboard-summary.component.html',
  styleUrls: ['./dashboard-summary.component.css']
})
export class DashboardSummaryComponent implements OnInit, OnDestroy {
  totalIncome: number = 0;
  totalExpenses: number = 0;
  totalSavings: number = 0;
  totalBalance: number = 0; // Often income - expenses

  isLoading: boolean = true;
  errorMessage: string | null = null;

  private statsSubscription: Subscription | undefined;

  // Progress percentages (these are static for now based on your HTML)
  // You might want to calculate these dynamically if you have targets
  incomeProgress: number = 80;
  expensesProgress: number = 65;
  savingsProgress: number = 70; // Adjusted, assuming balance is the main one
  balanceProgress: number = 92;


  constructor(private statsService: StatsService) { }

  ngOnInit(): void {
    this.loadAnalyticsData();
  }

  loadAnalyticsData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.statsSubscription = this.statsService.getAnalyticsData().subscribe({
      next: (data: AnalyticsData) => {
        // Assuming you want to display data for the first month available in monthlyStats
        const monthKeys = Object.keys(data.monthlyStats);
        if (monthKeys.length > 0) {
          const firstMonthKey = monthKeys[0];
          const monthlyData: MonthlyStat = data.monthlyStats[firstMonthKey];

          this.totalIncome = monthlyData.income;
          this.totalExpenses = monthlyData.expense;

          // If API provides 'savings', use it. Otherwise, calculate it.
          // The service already calculates it if null, so we can directly use it.
          this.totalSavings = monthlyData.savings !== null ? monthlyData.savings : (monthlyData.income - monthlyData.expense);

          // Total Balance is typically Income - Expenses
          this.totalBalance = monthlyData.income - monthlyData.expense;

          // Potentially update progress percentages based on data if you have targets
          // For example: this.incomeProgress = (this.totalIncome / targetIncome) * 100;
        } else {
          this.errorMessage = "No monthly data available ,add transaction to view";
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load analytics data', err);
        this.errorMessage = err.message || 'Failed to load data. Please try again.';
        this.isLoading = false;
        // Handle specific errors, e.g., if token is invalid, redirect to login
        if (err.message.includes('Unauthorized')) {
          // this.router.navigate(['/login']); // Inject Router if you want to navigate
        }
      }
    });
  }

  // Calculate stroke-dashoffset for progress circles dynamically
  // Circumference = 2 * PI * R. R = 30. Circumference approx 188.
  // Let's assume stroke-dasharray is also 188 for a full circle.
  getCircleDashOffset(percentage: number, radius: number = 30): number {
    const circumference = 2 * Math.PI * radius;
    return circumference - (percentage / 100) * circumference;
  }


  ngOnDestroy(): void {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
  }
}