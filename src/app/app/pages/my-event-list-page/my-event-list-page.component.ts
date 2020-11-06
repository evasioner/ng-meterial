import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { upsertMyMileage } from 'src/app/store/my-mileage/my-mileage/my-mileage.actions';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-my-event-list-page',
    templateUrl: './my-event-list-page.component.html',
    styleUrls: ['./my-event-list-page.component.scss']
})
export class MyEventListPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    ctx: any = this;
    headerType: any;
    headerConfig: any;

    rxAlive: boolean = true;
    loadingBool: boolean = false;
    resolveData: any;
    tabNo: any = 0;
    turmNo: any = 0;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
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
            id: 'my-event-list',
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
        //             catchError(([err1, err2]) => of([err1, err2]))
        //         )
        //         .subscribe(
        //             ([res1, res2]:any) => {
        //             console.info('[res1, res2]', res1, res2);
        //             const res = {
        //                 rentRuleRs: res1['result'],
        //                 listFilterRs: res2['result']
        //             };
        //             this.upsertOne({
        //                 id: 'rent-booking-information-rs',
        //                 result: res
        //             });
        //             this.loadingBool = true;
        //         })
        //         );

    }
    /**
     * 헤더 초기화
     */
    headerInit() {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: '이벤트',
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

}
