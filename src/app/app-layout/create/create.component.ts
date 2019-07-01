import { Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Transaction, TransactionService} from '../shared/transaction.service';
import {ActivatedRoute, } from '@angular/router';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

    form: FormGroup;
    months: number[] = [];
    years: number[] = [];
    namePattern: RegExp = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
    cardNumberPattern: RegExp = /^[0-9]{4}(?!.)/;
    amountPattern: RegExp = /^[0-9]+$/;
    transaction: Transaction;
    message = '';
    forRepeat;


    constructor(private transactionService: TransactionService, private route: ActivatedRoute) {
        this.route.queryParams.subscribe(data => {
            if (data) {
                this.transactionService.repeat(Number(data.id))
                    .then(dat => {
                        this.forRepeat = dat;
                    });
            } else {
                this.forRepeat = null;
            }
        });

    }

    ngOnInit() {

        this.months = Array(12).fill(0).map((e, i) => i + 1);
        this.years = Array(10).fill(0).map((e, i) => 18 + i + 1);

        this.form = new FormGroup({
            amount: new FormControl(this.getField('amount'), [Validators.required, this.validateByPattern(this.amountPattern)]),
            fio: new FormControl(this.getField('fio'), [Validators.required, this.validateByPattern(this.namePattern)]),
            activeMonth: new FormControl(this.getField('activeMonth'), Validators.required),
            activeYear: new FormControl(this.getField('activeYear'), Validators.required),
            customerCardNumber: new FormArray(Array(4).fill(0)
                .map((item, ind) => item = new FormControl(this.getField('customerCard', ind), [Validators.required, this.validateByPattern(this.cardNumberPattern)]))),
            consumerCardNumber: new FormArray(Array(4).fill(0)
                .map((item, ind) => item = new FormControl(this.getField('consumerCard', ind), [Validators.required, this.validateByPattern(this.cardNumberPattern)]))),
        });
    }

    getField(field, ind = null) {
        if (this.forRepeat) {
            console.log('transact', this.forRepeat);

            if (field === 'consumerCard' || field === 'customerCard') {
                return this.forRepeat[field].split(' ')[ind];
            }
            return this.forRepeat[field];
        }
        return null;
    }


    onSubmit() {
        const formData = this.form.value;
        const {amount, fio, activeMonth, activeYear} = formData;
        this.transaction = {
            customerCard: formData.customerCardNumber.join(' '),
            consumerCard: formData.consumerCardNumber.join(' '),
            amount: amount,
            date: new Date(),
            fio: fio.trim().toLocaleLowerCase(),
            activeMonth: Number(activeMonth),
            activeYear: Number(activeYear),
        };
        this.transactionService.create(this.transaction)
            .then(data => {
                this.form.reset();
                this.showMessage('Успешно');

            });
    }


    validateByPattern = (pattern: RegExp) => (control: FormControl): { [s: string]: boolean } => {
        const valid = !control.value || pattern.test(control.value);

        if (!valid) {
            return {error: true};
        }
        return null;
    };

    private showMessage(message: string) {
        this.message = message;
        window.setTimeout(() => {
            this.message = '';
        }, 2000);
    }
}
