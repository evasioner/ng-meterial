import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';
import { DOCUMENT, Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RentModalBranchofficeDetailComponent } from '../rent-modal-branchoffice-detail/rent-modal-branchoffice-detail.component';

@Component({
    selector: 'app-rent-modal-branchoffice',
    templateUrl: './rent-modal-branchoffice.component.html',
    styleUrls: ['./rent-modal-branchoffice.component.scss']
})
export class RentModalBranchofficeComponent extends BaseChildComponent implements OnInit, OnDestroy {
    storeId: any;

    element: any;

    rxAlive: boolean = true;

    // lat: number = 37.564124; // 위도
    // lng: number = 126.989822; // 경도

    latitude: any;
    longitude: any;
    openningHours: any;
    address: any;
    vehicleName: any;
    vehicleVendorCode: any;
    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        @Inject(DOCUMENT) private document: Document,
        private store: Store<any>,
        public translateService: TranslateService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private el: ElementRef,
        private bsModalService: BsModalService,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
        this.element = this.el.nativeElement;
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        console.info('[ngOnInit]', this.latitude, this.longitude, this.openningHours, this.address, this.vehicleName);
    }

    ngOnDestroy() {
        this.rxAlive = false;
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }


    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick(e) {
        console.info('모달 닫기');
        this.modalClose();
    }

    /**
     * 렌터카 지정 정보 상세보기
     */
    onLocationClick(e) {

        // 모달 전달 데이터
        const initialState = {
            latitude: this.latitude,
            longitude: this.longitude,
            openningHours: this.openningHours,
            vehicleName: this.vehicleName,
            vehicleVendorCode: this.vehicleVendorCode,
            address: this.address
        };
        console.info('[렌터카 지정 정보 상세보기]', initialState);
        // ngx-bootstrap configlongitude
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(RentModalBranchofficeDetailComponent, { initialState, ...configInfo });
    }

}
