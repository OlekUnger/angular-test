import {Injectable} from '@angular/core';

export interface Transaction {
    id?: number;
    consumerCard: string;
    customerCard: string;
    amount: number;
    date: Date;
    fio: string;
    activeMonth: number;
    activeYear: number;
}

@Injectable({
    providedIn: 'root'
})
export class TransactionService {

    constructor() {
    }

    create(transaction: Transaction): any {

        return this.getAll().then(data => {
            return this.add(transaction, data);
        }).catch(err => {
            console.log(err);
        });
    }

    add(transaction: Transaction, transactions: Transaction[]): any {
        return new Promise((resolve, reject) => {
            const newTransaction = Object.assign({}, transaction);
            const len = transactions.length;
            newTransaction.id = len > 0 ? transactions[len - 1].id + 1 : 1;
            transactions.push(newTransaction);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            resolve(transactions);
        }).catch (err => console.log(err));
    }

    getAll(): Promise<Transaction[]> {
        return new Promise((resolve, reject) => {
            const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions'));
            if (transactions) {
                resolve(transactions);
            } else {
                resolve([]);
            }
        });
    }

    remove(id: number): any {
        return this.getAll()
            .then(data => {
                if (data.length) {
                    data = data.filter(item => item.id !== id);
                    localStorage.setItem('transactions', JSON.stringify(data));
                    return data;
                }
            });
    }

    repeat(id: number): any {
        return this.getAll()
            .then(data => {
                if (data.length) {
                    return data.find(item => item.id === id);
                }
            });
    }

}
