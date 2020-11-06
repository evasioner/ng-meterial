import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-hotel-customer-event',
    templateUrl: './hotel-customer-event.component.html',
    styleUrls: ['./hotel-customer-event.component.scss']
})
export class HotelCustomerEventComponent implements OnInit, OnDestroy {
    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public translateService: TranslateService,
    ) { }

    ngOnInit(): void { }

    ngOnDestroy() { }
}
