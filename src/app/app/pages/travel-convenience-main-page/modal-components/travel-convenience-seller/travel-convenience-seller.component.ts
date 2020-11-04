import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { BaseChildComponent } from '../../../../pages/base-page/components/base-child/base-child.component';
/*
import {ActivityEnums} from "../../../activity-page/enums/activity-enums.enum";
import * as activitySearchResultPageSelectors from "../../../../store/activity-search-result-page/activity-result-search/activity-result-search.selectors";
*/
import * as _ from 'lodash';

@Component({
    selector: 'app-travel-convenience-seller',
    templateUrl: './travel-convenience-seller.component.html',
    styleUrls: ['./travel-convenience-seller.component.scss']
})
export class TravelConvenienceSellerComponent extends BaseChildComponent implements OnInit, OnDestroy {
    vm: any = {
        sellerList: null // seller list
    };

    rxAlive: boolean = true;

    loadingBool: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        this.rxAlive = true;

        this.vmInit();
    }

    ngOnDestroy() {
        this.rxAlive = false;
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        // console.info('[ngOnDestroy > rxAlive]', this.rxAlive);
    }

    /**
     * vm 초기화
     */
    vmInit() {
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick(e) {
        this.modalClose();
    }

    onGoSellerPage(sellerType) {
        console.log('[onGoSellerPage] sellerType : ', sellerType);

        if (sellerType == 'YBTOUR') {

        } else if (sellerType == 'DOSIRAK') {

        } else if (sellerType == 'PLAYER') {
        }
    }

}
