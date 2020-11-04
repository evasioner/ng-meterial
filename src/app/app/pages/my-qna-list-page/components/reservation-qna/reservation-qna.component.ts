import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RentUtilService } from 'src/app/common-source/services/rent-com-service/rent-util.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as qs from 'qs';
import { MyReservationQnaListPageComponent } from '@/app/pages/my-reservation-qna-list-page/my-reservation-qna-list-page.component';
import { MyModalQnaWriteComponent } from '../../modal-components/my-modal-qna-write/my-modal-qna-write.component';

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
    mainForm: any; // 생성된 폼 저장
    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public translateService: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        public rentUtilSvc: RentUtilService,
        public bsModalService: BsModalService,
    ) {
        super(platformId);
    }


    ngOnInit(): void {
        super.ngOnInit();
        console.log(this.mainForm, 'this.mainForm');

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
    writeQna() {
        const initialState = {

        };
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalRef = this.bsModalService.show(MyModalQnaWriteComponent, { initialState, ...configInfo });
    }

}
