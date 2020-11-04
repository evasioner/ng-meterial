import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-rent-modal-branchoffice-detail',
    templateUrl: './rent-modal-branchoffice-detail.component.html',
    styleUrls: ['./rent-modal-branchoffice-detail.component.scss']
})
export class RentModalBranchofficeDetailComponent extends BaseChildComponent implements OnInit, OnDestroy {

    storeId: any;

    element: any;

    rxAlive: boolean = true;

    // lat: number = 37.564124; // 위도
    // lng: number = 126.989822; // 경도

    latitude: any;
    longitude: any;
    openningHours: any;
    vehicleName: any;

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
        console.info('[ngOnInit]', this.latitude, this.longitude, this.openningHours, this.vehicleName);
    }

    ngOnDestroy() {
        this.rxAlive = false;
        // const bodyEl = document.getElementsByTagName('body')[0];
        // bodyEl.classList.remove('overflow-none');
    }


    modalClose() {
        // const bodyEl = document.getElementsByTagName('body')[0];
        // bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick(e) {
        console.info('모달 닫기');
        this.modalClose();
    }

}
