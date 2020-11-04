import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-hotel-coupon-down',
    templateUrl: './hotel-coupon-down.component.html',
    styleUrls: ['./hotel-coupon-down.component.scss']
})
export class HotelCouponDownComponent implements OnInit, OnDestroy {
    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public translateService: TranslateService,
    ) { }

    ngOnInit(): void { }

    ngOnDestroy() { }
}
