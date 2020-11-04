import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-rent-hot-list',
    templateUrl: './rent-hot-list.component.html',
    styleUrls: ['./rent-hot-list.component.scss']
})
export class RentHotListComponent extends BaseChildComponent implements OnInit {

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
    ) {
        super(platformId);
    }

    ngOnInit(): void {
    }

}
