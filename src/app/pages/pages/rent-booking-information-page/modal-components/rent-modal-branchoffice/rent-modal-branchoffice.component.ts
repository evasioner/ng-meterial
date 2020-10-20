import { Component, ElementRef, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as rentBookingInformationPageSelectors from '@app/store/rent-booking-information-page/rent-booking-information-page/rent-booking-information-page.selectors';

import { TranslateService } from '@ngx-translate/core';

import { RentUtilService } from '@app/common-source/services/rent-com-service/rent-util.service';

import { RentBookingInformationPageStoreIds } from '../../enums/rent-booking-information-page-store-ids.enum';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-rent-modal-branchoffice',
    templateUrl: './rent-modal-branchoffice.component.html',
    styleUrls: ['./rent-modal-branchoffice.component.scss']
})
export class RentModalBranchofficeComponent extends BaseChildComponent implements OnInit, OnDestroy {
    rxAlive: boolean = true;
    loadingBool: boolean = false;
    apiLoadingBool: boolean = false;

    vm: any;

    element: any;

    latitude: any;
    longitude: any;
    openningHours: any;
    address: any;
    locationName: any;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private el: ElementRef,
        private store: Store<any>,
        public rentUtilSvc: RentUtilService,
        public bsModalRef: BsModalRef,
        public translateService: TranslateService
    ) {
        super(platformId);
        this.element = this.el.nativeElement;
        this.subscriptionList = [];
    }

    ngOnInit() {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        this.rentBookingInformationInit();

        console.info('[latitude]', this.latitude);
        console.info('[longitude]', this.longitude);
        console.info('[openningHours]', this.openningHours);
        console.info('[address]', this.address);
    }

    ngOnDestroy() {
        this.rxAlive = false;
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');

        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    rentBookingInformationInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(rentBookingInformationPageSelectors.getSelectId(RentBookingInformationPageStoreIds.RENT_BOOKING_INFORMATION)),
                    takeWhile(() => this.rxAlive)
                )
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            console.info('[rentBookingInformationInit]', ev);
                            this.vm = { ...ev.result };
                            this.apiLoadingBool = true;

                        }
                    }
                )
        );
    }
    modalClose() {
        this.bsModalRef.hide();
    }

    onCloseClick(event: MouseEvent) {
        event && event.preventDefault();

        this.modalClose();
    }

}
