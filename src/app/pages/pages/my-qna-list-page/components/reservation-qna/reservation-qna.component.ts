import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import * as qs from 'qs';

import { RentUtilService } from 'src/app/common-source/services/rent-com-service/rent-util.service';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-reservation-qna',
    templateUrl: './reservation-qna.component.html',
    styleUrls: ['./reservation-qna.component.scss']
})
export class ReservationQnaComponent extends BaseChildComponent implements OnInit {

    bsModalRef: BsModalRef;
    selCate: any = 0;
    selCateStr: any;
    foldingKey: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private route: ActivatedRoute,
        private router: Router,
        public rentUtilSvc: RentUtilService,
        public bsModalService: BsModalService,
        public translateService: TranslateService
    ) {
        super(platformId);
    }


    ngOnInit(): void {
        super.ngOnInit();
    }

    selectFolding() {
        this.foldingKey = !this.foldingKey;
    }

    selectCate(selCate) {
        this.selCate = selCate;
        this.selCateStr = (<HTMLInputElement>event.target).textContent;
        this.selectFolding();
    }

    openHamburger() {
        // const rqInfo = null;
        // const base64Str = this.base64Svc.base64EncodingFun(rqInfo);
        const path = '/mypage-main/mypage-main-modal'; //+ '/' + base64Str;
        const extras = {
            relativeTo: this.route
        };
        console.log('path >>>>>', path);

        this.router.navigate([path], extras);
    }

    detailView2(qnaId) {
        const qsStr = qs.stringify(qnaId);
        const path = '/mypage-qna-list/modal-qna-view/' + qsStr;
        const extras = {
            relativeTo: this.route
        };
        console.info('path >>>>>>', path);
        this.router.navigate([path], extras);
    }



}
