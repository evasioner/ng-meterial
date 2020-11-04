import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { ApiMypageService } from '@/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-my-modal-activity-booker-modify',
    templateUrl: './my-modal-activity-booker-modify.component.html',
    styleUrls: ['./my-modal-activity-booker-modify.component.scss']
})
export class MyModalActivityBookerModifyComponent extends BaseChildComponent implements OnInit {
    booker: any;
    loadingBool: Boolean = false;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
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
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }


    async callActivityReservationtDetailApi($rq) {
        console.info('>>>> call api start', $rq);
        this.loadingBool = false;
        this.loadingBar.start();
        return this.apiMypageService.POST_BOOKING_RENT_DETAIL($rq)
            .toPromise()
            .then((res: any) => {
                console.info('[호텔예약상세 > res]', res);

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

    async pageInit(resolveData) {
        // resolveData.currency = 'JGT';
        // resolveData.language = 'EN';
        const res = await this.callActivityReservationtDetailApi(resolveData);

        this.booker = res['result']['booker'];           // 예약정보

        console.info('this.booker>>>', this.booker);

    }

    onCloseClick() {
        this.modalClose();
    }

}