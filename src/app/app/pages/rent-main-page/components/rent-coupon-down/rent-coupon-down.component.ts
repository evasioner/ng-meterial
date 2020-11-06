import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-rent-coupon-down',
    templateUrl: './rent-coupon-down.component.html',
    styleUrls: ['./rent-coupon-down.component.scss']
})
export class RentCouponDownComponent extends BaseChildComponent implements OnInit {

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
    ) {
        super(platformId);
    }

    ngOnInit(): void {
    }

}
