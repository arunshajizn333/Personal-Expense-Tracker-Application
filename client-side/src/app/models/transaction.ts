export interface Transaction {
    _id: string;
    type: 'income' | 'expense' | 'savings';
    amount: number;
    mode: string;
    category: string;
    date: Date;
    note: string;
}
