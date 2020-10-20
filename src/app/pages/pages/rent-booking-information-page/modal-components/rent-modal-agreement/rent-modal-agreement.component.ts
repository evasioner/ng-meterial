import { Component, ElementRef, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { RentUtilService } from '@/app/common-source/services/rent-com-service/rent-util.service';
import { ApiCommonService } from '@/app/api/common/api-common.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { AgreementEnums } from '@/app/common-source/enums/agreement.enum';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-rent-modal-agreement',
    templateUrl: './rent-modal-agreement.component.html',
    styleUrls: ['./rent-modal-agreement.component.scss']
})
export class RentModalAgreementComponent extends BaseChildComponent implements OnInit, OnDestroy {
    storeId: any;
    rxAlive: boolean = true;
    loadingBool: boolean = false;
    apiLoadingBool: boolean = false;

    idx: number;
    okFun: any;

    vm: any;

    element: any;

    private subscriptionList: Subscription[];

    private dataModel: any;
    public viewModel: any;
    resolveData: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private el: ElementRef,
        public rentUtilSvc: RentUtilService,
        public bsModalRef: BsModalRef,
        public translateService: TranslateService,
        private ApiCommonService: ApiCommonService,
        private route: ActivatedRoute,
        private alertService: ApiAlertService
    ) {
        super(platformId);
        this.element = this.el.nativeElement;
        this.initialize();
    }

    ngOnInit() {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        // this.rentBookingInformationInit();
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

    // rentBookingInformationInit() {
    //     this.subscriptionList.push(
    //         this.store
    //             .pipe(
    //                 select(rentBookingInformationPageSelectors.getSelectId(RentBookingInformationPageStoreIds.RENT_BOOKING_INFORMATION)),
    //                 takeWhile(() => this.rxAlive)
    //             )
    //             .subscribe(
    //                 (ev: any) => {
    //                     if (ev) {
    //                         console.info('[rentBookingInformationInit]', ev);
    //                         this.vm = { ...ev.result };
    //                         this.apiLoadingBool = true;

    //                     }
    //                 }
    //             )
    //     );
    // }

    modalClose() {
        this.bsModalRef.hide();
    }

    onCloseClick(event: MouseEvent) {
        event && event.preventDefault();

        this.modalClose();
    }

    onOkClick(event: MouseEvent) {
        event && event.preventDefault();

        console.info('[onOkClick > idx]', this.idx);
        this.okFun(this.idx);
        this.modalClose();
    }

    onTab0Click(e) {
        console.info('[일반규정 클릭]', e);
        this.idx = 0;
    }

    onTab1Click(e) {
        console.info('[취소 클릭]', e);
        this.idx = 1;
    }

    onTab2Click(e) {
        console.info('[개인정보취급방침 클릭]', e);
        this.idx = 2;
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
                    AgreementEnums.RENT_COMFIRM_D,
                    AgreementEnums.RENT_COMFIRM_I,
                    AgreementEnums.RENT_SPEC_D,
                    AgreementEnums.RENT_SPEC_I,
                ]
            }
        };
        console.log(rqInfo, 'rqInfo');

        this.getApiList(rqInfo);
    }

}
