import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Transaction, TransactionService} from '../shared/transaction.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
    transactions: Transaction[] = [];
    @Output() repeat = new EventEmitter<Transaction>();

    constructor(private transactionService: TransactionService,
                private router: Router) {

    }

    ngOnInit() {
        this.transactionService.getAll()
            .then(data => this.transactions = data);
    }

    onRepeat(id: number) {
        this.transactionService.repeat(id)
            .then(data => {
                this.transactions = data;
                this.router.navigate(['/create'],
                    {
                        queryParams: {
                            id: data.id

                        }
                    });
            });



    }

    onRemove(id: number) {
        this.transactionService.remove(id)
            .then(data => this.transactions = data);
    }
}
