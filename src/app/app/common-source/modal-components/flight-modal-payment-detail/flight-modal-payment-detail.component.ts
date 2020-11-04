import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { TravelerTypeKr } from '../../enums/common/traveler-type.enum';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-flight-modal-payment-detail',
    templateUrl: './flight-modal-payment-detail.component.html',
    styleUrls: ['./flight-modal-payment-detail.component.scss']
})
export class FlightModalPaymentDetailComponent extends BaseChildComponent implements OnInit, OnDestroy {
    rs: any;
    public viewModel: any;
    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
    }

    ngOnInit() {
        super.ngOnInit();
        console.info('[ngOnInit | 결제 상세]');

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        this.initialize();
    }

    ngOnDestroy() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }

    private initialize() {
        this.viewModel = {
            flightPirceUserList: [
                { text: '', count: 0, amount: 0, fareAmount: 0, taxAmount: 0 },
                { text: '', count: 0, amount: 0, fareAmount: 0, taxAmount: 0 },
                { text: '', count: 0, amount: 0, fareAmount: 0, taxAmount: 0 }
            ],
            totalAmountSum: 0
        };
        this.viewModel.paymentList = this.rs.selected.detail.price.fare.passengerFares.map(
            (item: any) => {
                this.viewModel.totalAmountSum += ((item.fareAmount + item.tasfAmount + item.taxAmount) * item.paxCount);

                switch (item.ageTypeCode) {
                    case 'ADT':
                        this.viewModel.flightPirceUserList[0].text = `${TravelerTypeKr[item.ageTypeCode]} 항공권`;
                        this.viewModel.flightPirceUserList[0].count = item.paxCount;
                        this.viewModel.flightPirceUserList[0].fareAmount += item.fareAmount;
                        this.viewModel.flightPirceUserList[0].taxAmount += (item.tasfAmount + item.taxAmount);
                        this.viewModel.flightPirceUserList[0].amount += (item.fareAmount + item.tasfAmount + item.taxAmount);
                        break;

                    case 'CHD':
                        this.viewModel.flightPirceUserList[1].text = `${TravelerTypeKr[item.ageTypeCode]} 항공권`;
                        this.viewModel.flightPirceUserList[1].count = item.paxCount;
                        this.viewModel.flightPirceUserList[1].fareAmount += item.fareAmount;
                        this.viewModel.flightPirceUserList[1].taxAmount += (item.tasfAmount + item.taxAmount);
                        this.viewModel.flightPirceUserList[1].amount += (item.fareAmount + item.tasfAmount + item.taxAmount);
                        break;

                    case 'INF':
                        this.viewModel.flightPirceUserList[2].text = `${TravelerTypeKr[item.ageTypeCode]} 항공권`;
                        this.viewModel.flightPirceUserList[2].count = item.paxCount;
                        this.viewModel.flightPirceUserList[1].fareAmount += item.fareAmount;
                        this.viewModel.flightPirceUserList[1].taxAmount += (item.tasfAmount + item.taxAmount);
                        this.viewModel.flightPirceUserList[1].amount += (item.fareAmount + item.tasfAmount + item.taxAmount);
                        break;
                }
            }
        );

        this.viewModel.flightPirceUserList = this.viewModel.flightPirceUserList.filter(
            (item: any) => item.count > 0
        );
    }

    modalClose() {
        this.bsModalRef.hide();
    }
}
