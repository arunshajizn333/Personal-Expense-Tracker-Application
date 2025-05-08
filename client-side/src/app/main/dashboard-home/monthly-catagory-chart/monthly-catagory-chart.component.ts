import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-monthly-catagory-chart',
  standalone:false,
  templateUrl: './monthly-catagory-chart.component.html',
  styleUrls: ['./monthly-catagory-chart.component.css']  
})
export class MonthlyCatagoryChartComponent implements OnInit {
  // Pie Chart - Category
  public categoryChartData: ChartData<'pie', number[], string> = {
    labels: ['Entertainment', 'Transport', 'Cashback'],
    datasets: [{
      data: [60, 75, 200],
      backgroundColor: ['#ffcc00', '#ff4444', '#00cc66']
    }]
  };
  

  public categoryChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    }
  };

  // Bar Chart - Monthly
  public monthlyChartData: ChartData<'bar'> = {
    labels: ['May 2025'],
    datasets: [
      {
        label: 'Income',
        data: [200],
        backgroundColor: '#4caf50'
      },
      {
        label: 'Expense',
        data: [135],
        backgroundColor: '#f44336'
      }
    ]
  };

  public monthlyChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
    }
  };

  constructor() {}

  ngOnInit(): void {}
}