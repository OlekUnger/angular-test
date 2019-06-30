import {Component, OnChanges, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Transaction, TransactionService} from '../shared/transaction.service';

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

    constructor(private transactionService: TransactionService) {
    }

    ngOnInit() {
        this.months = Array(12).fill(0).map((e, i) => i + 1);
        this.years = Array(10).fill(0).map((e, i) => 18 + i + 1);
        this.form = new FormGroup({
            amount: new FormControl(null, [Validators.required, this.validateByPattern(this.amountPattern)]),
            fio: new FormControl(null, [Validators.required, this.validateByPattern(this.namePattern)]),
            activeMonth: new FormControl(null, Validators.required),
            activeYear: new FormControl(null, Validators.required),
            customerCardNumber: new FormArray(Array(4).fill(0)
                .map(item => item = new FormControl(null, [Validators.required, this.validateByPattern(this.cardNumberPattern)]))),
            consumerCardNumber: new FormArray(Array(4).fill(0)
                .map(item => item = new FormControl(null, [Validators.required, this.validateByPattern(this.cardNumberPattern)]))),
        });
    }

    onSubmit() {
        const formData = this.form.value;
        const {amount, fio, activeMonth, activeYear} = formData;
        this.transaction = {
            consumerCard: formData.customerCardNumber.join(' '),
            customerCard: formData.consumerCardNumber.join(' '),
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
