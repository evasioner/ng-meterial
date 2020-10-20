import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import * as hotelSearchResultPageSelectors from '../../../../store/hotel-search-result-page/hotel-search-result-page/hotel-search-result-page.selectors';
import * as hotelCompareListSelectors from '../../../../store/hotel-search-result-page/hotel-search-result-page-compare-list/hotel-search-result-page-compare-list.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { HotelComService } from 'src/app/common-source/services/hotel-com-service/hotel-com-service.service';

import { HotelResultVm } from '../../insterfaces/hote-result-vm';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-hotel-modal-compare',
    templateUrl: './hotel-modal-compare.component.html',
    styleUrls: ['./hotel-modal-compare.component.scss']
})
export class HotelModalCompareComponent extends BaseChildComponent implements OnInit, OnDestroy {
    rxAlive: boolean = true;
    loadingBool: boolean = false;

    vm: HotelResultVm;

    compareList: any;
    element: any;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        private comService: HotelComService,
        public bsModalRef: BsModalRef,
        public translateService: TranslateService
    ) {
        super(platformId);
        this.subscriptionList = [];
    }

    ngOnInit() {
        super.ngOnInit();
        this.hotelResolveInit();
        this.compareListInit();
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    hotelResolveInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(hotelSearchResultPageSelectors.getSelectId('hotel-resolve-data')),
                    takeWhile(() => this.rxAlive)
                )
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            console.info('[hotelResolveInit]', ev);
                            this.vm = { ...ev.result };
                            this.loadingBool = true;
                        }
                    }
                )
        );
    }

    /**
     * 비교하기 리스트 초기화
     * compareList 데이터를 확인 후 compareTgIdList 만든다.
     */
    compareListInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(hotelCompareListSelectors.selectAll),
                    takeWhile(() => this.rxAlive)
                )
                .subscribe(
                    (ev: any) => {
                        console.info('[compareListInit]', ev);
                        if (ev) {
                            this.compareList = ev;
                        } else {
                            this.compareList = [];
                        }
                    }
                )
        );
    }

    modalClose() {
        this.bsModalRef.hide();
    }

    onCloseClick() {
        this.modalClose();
    }

    onSelectItemClick() {
        console.info('[onSelectItemClick]');
    }

    onHotelDtl($hotelCode) {
        const VM_DATA = this.vm;
        console.info('[VM_DATA]', VM_DATA);
        const rqInfo = {
            city: VM_DATA.city,
            hCode: $hotelCode,
            chkIn: VM_DATA.chkIn,
            chkOut: VM_DATA.chkOut,
            roomList: VM_DATA.roomList
        };

        console.info('[데이터 rqInfo]', rqInfo);

        this.comService.moveRoomtypePage(rqInfo);
    }




}
