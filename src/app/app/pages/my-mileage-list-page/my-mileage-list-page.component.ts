import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { BasePageComponent } from '../base-page/base-page.component';
import { Store } from '@ngrx/store';
import { Title, Meta } from '@angular/platform-browser';
import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MyModalMileageNoticeComponent } from './modal-components/my-modal-mileage-notice/my-modal-mileage-notice.component';
import { HeaderTypes } from '../../common-source/enums/header-types.enum';
import { take } from 'rxjs/operators';
import { upsertMyMileage } from 'src/app/store/my-mileage/my-mileage/my-mileage.actions';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-my-mileage-list-page',
    templateUrl: './my-mileage-list-page.component.html',
    styleUrls: ['./my-mileage-list-page.component.scss']
})
export class MyMileageListPageComponent extends BasePageComponent implements OnInit, OnDestroy {

    ctx: any = this;
    bsModalRef: BsModalRef;
    headerType: any;
    headerConfig: any;

    rxAlive: boolean = true;
    loadingBool: boolean = false;
    resolveData: any;
    tabNo: any = 0;
    turmNo: any = 0;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        public bsModalService: BsModalService,
        private store: Store<any>,
        private route: ActivatedRoute,
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );

        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveData = _.cloneDeep(data.resolveData);

                        const userNo = Number(_
                            .chain(this.resolveData)
                            .get('condition.userNo')
                            .value());
                        // .map((o) => {
                        //     return Number(o);
                        // });
                        console.info('Number(userNo)>>', userNo);
                        this.resolveData.condition.userNo = userNo;
                        console.info('[1. route 통해 데이터 전달 받기]', data);
                        this.pageInit(data.resolveData);
                    }
                )
        );
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.closeAllModals();
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    async pageInit($resolveData) {
        this.resolveData = $resolveData;

        // ---------[rent-list-rq-info 스토어에 저장]
        this.upsertOne({
            id: 'rent-booking-infomation-rq-info',
            result: $resolveData
        });

        // ---------[헤더 초기화]
        this.headerInit();
        // ---------[ end 헤더 초기화]


        // this.subscriptionList.push(
        //     forkJoin([
        //         this.apiRentService.POST_RENT_RENTRULE($resolveData.rq),
        //         this.apiRentService.POST_RENT_LIST($resolveData.listFilterRq)
        //     ])
        //         .pipe(
        //             takeWhile(val => this.rxAlive),
        //             catchError(([err1, err2]) => of([err1, err2])
        //             )
        //                 .subscribe(([res1, res2]) => {
        //                     console.info('[res1, res2]', res1, res2);
        //                     const res = {
        //                         rentRuleRs: res1['result'],
        //                         listFilterRs: res2['result']
        //                     };
        //                     this.upsertOne({
        //                         id: 'rent-booking-infomation-rs',
        //                         result: res
        //                     });
        //                     this.loadingBool = true;
        //                 }
        //                 )
        //         )
        // );

    }
    /**
     * 헤더 초기화
     */
    headerInit() {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: '마일리지',
            key: null
        };
    }

    /**
   * 데이터 추가 | 업데이트
   * action > key 값을 확인.
   */
    upsertOne($obj) {
        this.store.dispatch(upsertMyMileage({
            myMileage: $obj
        }));
    }

    selectTab(no) {
        this.tabNo = no;
    }

    selectTurm(no) {
        this.turmNo = no;
    }

    openModalNotice() {
        const initialState = {
            list: [
                'Open a modal with component',
                'Pass your data',
                'Do something else',
                '...'
            ],
            title: 'Modal with component'
        };
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalRef = this.bsModalService.show(MyModalMileageNoticeComponent, { initialState, ...configInfo });
    }
}
