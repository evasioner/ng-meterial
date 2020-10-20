import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { ApiCommonService } from '@/app/api/common/api-common.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { AgreementEnums } from '../../../../common-source/enums/agreement.enum';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-activity-modal-agreement',
    templateUrl: './activity-modal-agreement.component.html',
    styleUrls: ['./activity-modal-agreement.component.scss']
})
export class ActivityModalAgreementComponent extends BaseChildComponent implements OnInit, OnDestroy {
    storeId: any;
    rxAlive: boolean = true;
    okFun: any;

    private subscriptionList: Subscription[];

    private dataModel: any;
    public viewModel: any;
    resolveData: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public bsModalRef: BsModalRef,
        public translateService: TranslateService,
        private ApiCommonService: ApiCommonService,
        private route: ActivatedRoute,
        private alertService: ApiAlertService
    ) {
        super(platformId);
        this.initialize();
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.info('[1. route 통해 데이터 전달 받기]', data);
                        this.resolveData = _.cloneDeep(data.resolveData);
                        this.pageInit();
                    }
                )
        );
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

    onCloseClick() {
        console.info('모달 닫기');
        this.modalClose();
    }

    onOkClick(event: MouseEvent) {
        event && event.preventDefault();

        this.okFun(this.storeId);
        this.modalClose();
    }

    onTabClick(event: MouseEvent, $storeId: string) {
        event && event.preventDefault();

        console.info('[Tab 클릭]', this.storeId);
        this.storeId = $storeId;
    }
    initialize() {
        this.dataModel = {};
        this.viewModel = {
            common: '',
            cancel: '',
            personal: ''
        };
        this.subscriptionList = [];

    }
    getApiList(rq) {
        this.subscriptionList.push(
            this.ApiCommonService.POST_TERMS(rq)
                .subscribe(
                    (resp: any) => {
                        if (resp.succeedYn) {
                            this.dataModel.response = _.cloneDeep(resp.result);
                            this.dataModel.transactionSetId = resp.transactionSetId;
                            this.viewModel = this.dataModel.response;
                            this.setViewModel();
                        } else {
                            this.alertService.showApiAlert(resp.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                )
        );
    }

    setViewModel() {
        console.log('제대로 내려오고 있나요? ', this.dataModel);
        this.viewModel = {
            common: this.dataModel.response.terms[0].termsDetail,
            cancel: this.dataModel.response.terms[1].termsDetail,
            personal: this.dataModel.response.terms[2].termsDetail
        };
    }


    /**
     * 페이지 초기화
     *  api 호출 (
     * @param resolveData
     */
    pageInit() {

        const rqInfo =
        {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                chorusTermsCode: [
                    AgreementEnums.PERSONAL,
                    AgreementEnums.INHERENT,
                    AgreementEnums.PERSONALAGREE,
                    AgreementEnums.ACTIVITY_COMFIRM,
                    AgreementEnums.ACTIVITY_SPEC
                ]
            }
        };
        console.log(rqInfo, 'rqInfo');

        this.getApiList(rqInfo);
    }
}
