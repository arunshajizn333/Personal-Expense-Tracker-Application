// src/app/components/monthly-catagory-chart/monthly-catagory-chart.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import { StatsService, AnalyticsData, MonthlyStat } from '../../../services/stats.service'; // Adjust path if needed
import { Subscription } from 'rxjs';
import 'chartjs-adapter-date-fns'; // Import if you use time scale or date formatting

// Helper for dynamic colors (optional, you can define a fixed palette too)
function getRandomColor(): string {
  const r = Math.floor(Math.random() * 100); // Avoid too light colors
  const g = Math.floor(Math.random() * 100);
  const b = Math.floor(Math.random() * 100);
  return `rgba(${r}, ${g}, ${b}, 0.7)`;
}

function getMonthName(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}


@Component({
  selector: 'app-monthly-catagory-chart',
  standalone:false,
  templateUrl: './monthly-catagory-chart.component.html',
  styleUrls: ['./monthly-catagory-chart.component.css']
  // standalone: false, // Keep as is from your original
})
export class MonthlyCatagoryChartComponent implements OnInit, OnDestroy {

  private dataSubscription: Subscription | undefined;
  public isLoading = true;
  public errorMessage: string | null = null;

  // === Pie Chart - Category Stats ===
  public categoryChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: [],
      borderColor: '#fff',
      hoverBorderColor: '#fff'
    }]
  };

  public categoryChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom', // Better for pie charts with many items
        labels: {
          padding: 15,
          font: {
            size: 13
          }
        }
      },
      title: {
        display: true,
        text: 'Spending Categories',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
            top: 10,
            bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'pie'>) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              // Assuming your values are currency
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
            }
            return label;
          }
        }
      }
    }
  };
  public categoryChartType: 'pie' = 'pie';


  // === Bar Chart - Monthly Income/Expense ===
  public monthlyChartData: ChartData<'bar'> = {
    labels: [], // e.g., ['Jan 2025', 'Feb 2025']
    datasets: [
      {
        label: 'Income',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Teal/Green
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: 'Expense',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red/Pink
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        borderRadius: 5,
      }
    ]
  };

  public monthlyChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            // Format as currency
            if (typeof value === 'number') {
                return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
            }
            return value;
          }
        }
      },
      x: {
        grid: {
          display: false // Cleaner look
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
         labels: {
          padding: 15,
          font: {
            size: 13
          }
        }
      },
      title: {
        display: true,
        text: 'Monthly Income vs. Expense',
        font: {
          size: 16,
          weight: 'bold'
        },
         padding: {
            top: 10,
            bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'bar'>) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
               label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    }
  };
  public monthlyChartType: 'bar' = 'bar';


  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.dataSubscription = this.statsService.getAnalyticsData().subscribe({
      next: (data: AnalyticsData) => {
        this.processCategoryData(data.categoryStats);
        this.processMonthlyData(data.monthlyStats);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading chart data:', err);
        this.errorMessage = err.message || 'Failed to load chart data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  processCategoryData(categoryStats: { [key: string]: number }): void {
    const labels: string[] = [];
    const dataPoints: number[] = [];
    const backgroundColors: string[] = [];
    // Define a color palette for consistency, add more if needed
    const colorPalette = [
        'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)', 'rgba(83, 102, 255, 0.7)', 'rgba(100, 255, 64, 0.7)'
    ];
    let colorIndex = 0;

    // Filter out categories like 'Salary' or 'Freelance' if they are income and not expenses
    // For this example, I'm assuming all items in categoryStats are relevant for the pie chart.
    // If "Salary", "Freelance" are income, you might want to exclude them or sum them separately.
    // For this example, let's assume they are categories of spending or allocation.
    for (const key in categoryStats) {
      if (categoryStats.hasOwnProperty(key) && categoryStats[key] > 0) { // Only positive values
        labels.push(key);
        dataPoints.push(categoryStats[key]);
        backgroundColors.push(colorPalette[colorIndex % colorPalette.length]);
        colorIndex++;
      }
    }

    this.categoryChartData = {
      labels: labels,
      datasets: [{
        data: dataPoints,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: backgroundColors.map(color => color.replace('0.7', '0.9')), // Darken on hover
        borderColor: '#fff',
        hoverBorderColor: '#fff',
        borderWidth: 2
      }]
    };
  }

  processMonthlyData(monthlyStats: { [key: string]: MonthlyStat }): void {
    const labels: string[] = [];
    const incomeData: number[] = [];
    const expenseData: number[] = [];

    // Sort month keys to ensure chronological order if not already
    const sortedMonthKeys = Object.keys(monthlyStats).sort();

    for (const monthKey of sortedMonthKeys) {
      if (monthlyStats.hasOwnProperty(monthKey)) {
        labels.push(getMonthName(monthKey)); // Format "2025-5" to "May 2025"
        incomeData.push(monthlyStats[monthKey].income);
        expenseData.push(monthlyStats[monthKey].expense);
      }
    }

    this.monthlyChartData = {
      labels: labels,
      datasets: [
        { ...this.monthlyChartData.datasets[0], data: incomeData }, // Preserve other dataset props
        { ...this.monthlyChartData.datasets[1], data: expenseData }
      ]
    };
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}