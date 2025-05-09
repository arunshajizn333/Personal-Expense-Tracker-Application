// src/app/models/transaction.ts
export interface Transaction {
  _id: string;
  userId?: string; // Optional if not always needed on the frontend for display
  type: 'income' | 'expense' | 'savings';
  amount: number;
  mode: string;
  category: string;
  date: Date | string; // Keep as string initially if backend sends string, then convert
  note: string;
  createdAt?: string; // Optional
  updatedAt?: string; // Optional
  __v?: number;       // Optional
}