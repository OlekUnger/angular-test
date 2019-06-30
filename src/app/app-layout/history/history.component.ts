import {Component, OnInit} from '@angular/core';
import {Transaction, TransactionService} from '../shared/transaction.service';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
    transactions: Transaction[] = [];

    constructor(private transactionService: TransactionService) {
    }

    ngOnInit() {
        this.transactionService.getAll()
            .then(data => this.transactions = data);
    }

    onRepeat(id: number) {
        this.transactionService.repeat(id)
            .then(data => this.transactions = data);
    }

    onRemove(id: number) {
        this.transactionService.remove(id)
            .then(data => this.transactions = data);
    }
}
