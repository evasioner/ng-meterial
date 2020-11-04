import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-hotel-hot-list',
    templateUrl: './hotel-hot-list.component.html',
    styleUrls: ['./hotel-hot-list.component.scss']
})
export class HotelHotListComponent implements OnInit, OnDestroy {
    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public translateService: TranslateService,
    ) { }

    ngOnInit(): void { }

    ngOnDestroy() { }
}
