import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recent-orders',
  standalone: false,
  templateUrl: './recent-orders.component.html',
  styleUrl: './recent-orders.component.css'
})
export class RecentOrdersComponent implements OnInit {
  transactions = [
    {
      _id: "68161ea70508fbeee83f14dc",
      type: "expense",
      amount: 60,
      mode: "card",
      category: "Entertainment",
      date: new Date("2025-05-06T21:00:00.000Z"),
      note: "Movie ticket"
    },
    {
      _id: "68161eb90508fbeee83f14df",
      type: "expense",
      amount: 75,
      mode: "cash",
      category: "Transport",
      date: new Date("2025-05-06T09:30:00.000Z"),
      note: "Daily commute"
    },
    {
      _id: "68161ec50508fbeee83f14e1",
      type: "income",
      amount: 200,
      mode: "upi",
      category: "Cashback",
      date: new Date("2025-05-05T16:00:00.000Z"),
      note: "UPI offer"
    },
    {
      _id: "681b0115faa741aaebe0ef1f",
      type: "expense",
      amount: 300,
      mode: "cash",
      category: "Groceries",
      date: new Date("2025-05-02T17:30:00.000Z"),
      note: "Vegetables and snacks"
    },
    {
      _id: "681b01729ba658bc63c9c870",
      type: "savings",
      amount: 800,
      mode: "upi",
      category: "Investments",
      date: new Date("2025-05-05T18:00:00.000Z"),
      note: "Mutual fund SIP"
    }
  ];

  // Store only the recent 2-3 transactions
  recentTransactions :any[] = [];

  ngOnInit() {
    // Sort the transactions by date, descending, and pick the most recent 3 transactions
    this.recentTransactions = this.transactions
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 3);
  }

  // Helper method to get the correct class for status (expense, income, savings)
  getStatusClass(type: string) {
    switch (type) {
      case 'expense':
        return 'warning';
      case 'income':
        return 'success';
      case 'savings':
        return 'primary';
      default:
        return '';
    }
  }
}