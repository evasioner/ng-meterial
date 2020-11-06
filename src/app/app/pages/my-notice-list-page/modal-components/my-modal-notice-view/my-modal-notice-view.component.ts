import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-my-modal-notice-view',
    templateUrl: './my-modal-notice-view.component.html',
    styleUrls: ['./my-modal-notice-view.component.scss']
})
export class MyModalNoticeViewComponent extends BaseChildComponent implements OnInit {
    postSeq: any;
    isPostSeq: any;
    resolveData: any;
    loadingBool: Boolean = false;

    attachedFiles: any[] = [];
    b2bDisplayYn: boolean;
    b2cDisplayYn: boolean;
    btmsDisplayYn: boolean;
    lastUpdateDatetime: any;
    pageViewCount: any;
    postCategoryCode: any;
    postCategoryName: any;
    postDetail: any;
    postTitle: any;
    writerName: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public translateService: TranslateService,
        public bsModalRef: BsModalRef,
        private apiMypageService: ApiMypageService,
        private loadingBar: LoadingBarService,
        private alertService: ApiAlertService
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        this.propertyInit();
        this.pageInit();
    }

    propertyInit() {
        this.isPostSeq = this.postSeq[0];
    }

    // API 호출 전체 예약상세
    async callFlightReservationtDetailApi(resolveData) {
        console.info('resolveData >>>>>>>>>>>>>>>', resolveData);
        this.loadingBool = false;
        this.loadingBar.start();
        return this.apiMypageService.POST_MYPAGE_NOTICE_DETAIL(resolveData)
            .toPromise()
            .then((res: any) => {
                console.info('[공지사항상세 > res]', res);

                if (res.succeedYn) {
                    this.loadingBool = true;
                    this.loadingBar.complete();
                    return res;
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err);
            });
    }

    async pageInit() {
        const $rq = {
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                'postSeq': this.isPostSeq
            }
        };
        const res = await this.callFlightReservationtDetailApi($rq);
        this.attachedFiles = res['result']['attachedFiles'];
        this.b2bDisplayYn = res['result']['b2bDisplayYn'];
        this.b2cDisplayYn = res['result']['b2cDisplayYn'];
        this.btmsDisplayYn = res['result']['btmsDisplayYn'];
        this.lastUpdateDatetime = res['result']['lastUpdateDatetime'];
        this.pageViewCount = res['result']['pageViewCount'];
        this.postCategoryCode = res['result']['postCategoryCode'];
        this.postCategoryName = res['result']['postCategoryName'];
        this.postDetail = res['result']['postDetail'];
        this.postTitle = res['result']['postTitle'];
        this.writerName = res['result']['writerName'];

        console.info('b2bDisplayYn	>>>', this.b2bDisplayYn);
        console.info('b2cDisplayYn	>>>', this.b2cDisplayYn);
        console.info('btmsDisplayYn	>>>', this.btmsDisplayYn);
        console.info('lastUpdateDatetime	>>>', this.lastUpdateDatetime);
        console.info('pageViewCount	>>>', this.pageViewCount);
        console.info('postCategoryCode	>>>', this.postCategoryCode);
        console.info('postCategoryName	>>>', this.postCategoryName);
        console.info('postDetail	>>>', this.postDetail);
        console.info('postTitle	>>>', this.postTitle);
        console.info('writerName	>>>', this.writerName);

    }
    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick() {
        this.modalClose();
    }

}
