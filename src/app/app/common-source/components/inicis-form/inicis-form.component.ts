import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { InicisPayment } from '@/app/common-source/models/payment/inicis-payment.model';

@Component({
    selector: 'app-inicis-form',
    templateUrl: './inicis-form.component.html',
    styleUrls: ['./inicis-form.component.scss']
})
export class InicisFormComponent implements OnChanges {
    @Input() private inicis: InicisPayment;

    public viewModel: InicisPayment;

    constructor() { }

    ngOnChanges() {
        this.viewModel = this.inicis;
    }
}
