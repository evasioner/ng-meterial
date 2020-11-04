import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { BasePageComponent } from '../base-page/base-page.component';
import { Title, Meta } from '@angular/platform-browser';
import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/operators';
import { HeaderTypes } from 'src/app/common-source/enums/header-types.enum';
import { upsertMyFlightExtraSvcPage } from 'src/app/store/my-flight-extra-svc-page/my-flight-extra-svc-page/my-flight-extra-svc-page.actions';
import { MyModalFlightBagDropComponent } from './modal-components/my-modal-flight-bag-drop/my-modal-flight-bag-drop.component';
import { MyModalFlightMealComponent } from './modal-components/my-modal-flight-meal/my-modal-flight-meal.component';
import { MyModalSeatmapComponent } from './modal-components/my-modal-seatmap/my-modal-seatmap.component';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-my-flight-extra-svc-page',
    templateUrl: './my-flight-extra-svc-page.component.html',
    styleUrls: ['./my-flight-extra-svc-page.component.scss']
})
export class MyFlightExtraSvcPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    ctx: any = this;
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;
    vm: any = {};
    loadingBool: boolean = false;
    resolveData: any;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private store: Store<any>,
        private route: ActivatedRoute,
        private bsModalService: BsModalService
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

    /**
     * 페이지 초기화
     * 1. 헤더 초기화
     * 2. api 호출
     * - rs store 저장
     * @param $resolveData
     */
    async pageInit($resolveData) {
        this.resolveData = $resolveData;

        // ---------[rent-list-rq-info 스토어에 저장]
        this.upsertOne({
            id: 'my-flight-extra-svc-rq-info',
            result: $resolveData
        });

        // ---------[헤더 초기화]
        // const headerTitle = `예약 정보 입력`;
        // const pickupDatetime = moment($resolveData.rq.condition.pickupDatetime).format('MM.DD(HH:mm)');
        // const returnDateTime = moment($resolveData.rq.condition.returnDateTime).format('MM.DD(HH:mm)');
        // const headerTime = `${pickupDatetime}-${returnDateTime}`;
        // this.headerInit('user-information', headerTitle, headerTime);
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
        //                 .subscribe(
        //                     ([res1, res2]: any) => {
        //                         console.info('[res1, res2]', res1, res2);
        //                         const res = {
        //                             rentRuleRs: res1['result'],
        //                             listFilterRs: res2['result']
        //                         };
        //                         this.upsertOne({
        //                             id: 'rent-booking-infomation-rs',
        //                             result: res
        //                         });
        //                         this.loadingBool = true;
        //                     }
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
            title: '항공부가서비스',
            key: null
        };
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertMyFlightExtraSvcPage({
            myFlightExtraSvcPage: $obj
        }));
    }

    onFlightBagDropClick() {
        console.info('[위탁수하물]');

        const storeId = 'flightBagDrop';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(MyModalFlightBagDropComponent, { initialState, ...configInfo });


    }

    onFlightMealClick() {
        console.info('[기내식]');

        const storeId = 'flightMeal';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(MyModalFlightMealComponent, { initialState, ...configInfo });
    }

    onSeatmapClick() {
        console.info('[좌석선택]');

        const storeId = 'seatmap';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(MyModalSeatmapComponent, { initialState, ...configInfo });

    }



    onLocationClick(e) {
        console.info('[Modal 장소]');
    }

}
