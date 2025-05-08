import { Component, inject, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction'; // adjust path if needed
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionModalComponent } from '../../shared/add-transaction-modal/add-transaction-modal.component';

@Component({
  selector: 'app-view-transactions',
  standalone :false,
  templateUrl: './view-transactions.component.html',
  styleUrls: ['./view-transactions.component.css']
})
export class ViewTransactionsComponent implements OnInit {
  transactions: Transaction[] = [
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
    },
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
    // Add more as needed
  ];
  paginatedTransactions: Transaction[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 6;

  ngOnInit(): void {
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTransactions = this.transactions.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.transactions.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  onAddTransaction() {
    console.log('Add Transaction Clicked');
  }

  deleteTransaction(id: string) {
    this.transactions = this.transactions.filter(t => t._id !== id);
    this.updatePagination();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      lines.shift(); // Remove header

      for (let line of lines) {
        const [type, amount, mode, category, date, note] = line.split(',');
        this.transactions.push({
          _id: crypto.randomUUID(),
          type: type.trim() as 'income' | 'expense' | 'savings',
          amount: +amount,
          mode: mode.trim(),
          category: category.trim(),
          date: new Date(date.trim()),
          note: note.trim()
        });
      }

      this.updatePagination();
    };

    reader.readAsText(file);
  }

  downloadCSV() {
    const headers = ['type', 'amount', 'mode', 'category', 'date', 'note'];
    const rows = this.transactions.map(t =>
      [t.type, t.amount, t.mode, t.category, t.date.toISOString(), t.note].join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    link.click();
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
