import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-rent-customer-event',
    templateUrl: './rent-customer-event.component.html',
    styleUrls: ['./rent-customer-event.component.scss']
})
export class RentCustomerEventComponent extends BaseChildComponent implements OnInit {

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
    ) {
        super(platformId);
    }

    ngOnInit(): void {
    }

}
