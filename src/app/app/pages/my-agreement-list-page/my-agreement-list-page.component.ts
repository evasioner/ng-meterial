import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

import { ApiCommonService } from '../../api/common/api-common.service';
import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { AgreementEnums } from './enums/agreement-enums.enums';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-my-agreement-list-page',
    templateUrl: './my-agreement-list-page.component.html',
    styleUrls: ['./my-agreement-list-page.component.scss']
})
export class MyAgreementListPageComponent extends BasePageComponent implements OnInit, OnDestroy {

    private subscriptionList: Subscription[];
    private dataModel: any;
    public viewModel: any;

    resolveData: any;
    tabNo: any = 0;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private ApiCommonService: ApiCommonService,
        private route: ActivatedRoute,
        private location: Location,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
        this.initialize();
    }

    ngOnInit(): void {
        super.ngOnInit();

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
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    initialize() {
        this.dataModel = {};
        this.viewModel = {};
        this.subscriptionList = [];
    }

    getApiList(rq) {
        this.subscriptionList.push(
            this.ApiCommonService.POST_TERMS(rq)
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            this.dataModel.response = _.cloneDeep(res.result);
                            this.dataModel.transactionSetId = res.transactionSetId;
                            this.viewModel = this.dataModel.response;
                            this.setViewModel();
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err);
                    }
                )
        );

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
                chorusTermsCode: [AgreementEnums.PERSONAL]
            }
        };
        this.getApiList(rqInfo);
    }

    selectTab(no) {
        this.tabNo = no;
    }

    /**
     * onBackClick
     * 뒤로가기
     *
     * @param event 돔 이벤트
     */
    public onBackClick(event: any): void {
        event && event.preventDefault();

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.location.back();
    }
    setViewModel() {
        console.log('제대로 내려오고 있나요? ', this.dataModel);
        this.viewModel = {
            common: this.dataModel.response.terms[0].termsDetail,
            cancel: this.dataModel.response.terms[1].termsDetail,
            personal: this.dataModel.response.terms[2].termsDetail
        };
    }
}
