import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { pluck, take, tap } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { upsertAirtelSearchRoomtype } from 'src/app/store/airtel-search-result-page/search-roomtype/airtel-search-roomtype.actions';

import * as searchRoomtypeSelectors from 'src/app/store/airtel-search-result-page/search-roomtype/airtel-search-roomtype.selectors';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { AirtelSearchRoomtypePageService } from './services/search/airtel-search-roomtype-page.service';

import { AirtelSearchRoomtype } from 'src/app/store/airtel-search-result-page/search-roomtype/airtel-search-roomtype.model';

import { PageCodes } from '../../common-source/enums/page-codes.enum';
import { HeaderTypes } from '../../common-source/enums/header-types.enum';


import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-airtel-search-roomtype-page',
    templateUrl: './airtel-search-roomtype-page.component.html',
    styleUrls: ['./airtel-search-roomtype-page.component.scss']
})
export class AirtelSearchRoomtypePageComponent extends BasePageComponent implements OnInit, OnDestroy {
    queryParams$: Observable<any>;

    vm$: Observable<any>;
    serviceCode$: Observable<any>;
    serviceName$: Observable<any>;
    succeedYn$: Observable<any>;
    transactionSetId$: Observable<any>;
    searchResult$: Observable<any>;
    hotelInfo$: Observable<any>;
    photos$: Observable<any>;
    tripAdvisor$: Observable<any>;
    poi$: Observable<any>;
    attractions$: Observable<any>;

    searchBool: boolean = false;
    vmModel: AirtelSearchRoomtype;

    /**
     * 초기화 데이터
     * - 데이터 업데이트 전 데이터를 셋팅하고 수정하는 용도로 사용한다.
     */
    initData: any;
    /**
     * 데이터가 준비 된후에 템플릿이 실행한다.
     */
    initBool: boolean = false;

    con: any = {
        'stationTypeCode': 'STN03',
        'requestUno': 21910712,
        'currency': 'KRW',
        'language': 'KO',
        'condition': {
            'hotelCode': '233411'
        },
        'transactionSetId': 'L342607132378123684'
    };

    headerType: any;
    headerConfig: any;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        titleService: Title,
        metaTagService: Meta,
        seoCanonicalService: SeoCanonicalService,
        translate: TranslateService,
        private store: Store<any>,
        private route: ActivatedRoute,
        private _api: AirtelSearchRoomtypePageService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translate
        );

        this.subscriptionList = [];
    }

    async ngOnInit() {
        console.info('[PAGE > ngOnInit]');
        this.basePageInit({
            headerInit: {
                pageCode: PageCodes['PAGE_AIRTEL'],
                headerType: HeaderTypes['SUB_PAGE'],
                headerConfig: {
                    icon: {
                        'room': true
                    },
                    step: '04 LAX 호텔 룸타입 선택',
                    detail: '09.30-10.02(5일), 객실2(3박), 5명'
                }
            }
        });

        this.observableInit();
        await this.dataInit();
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    /**
     * 옵저버블 초기화
     */
    observableInit() {
        /**
         * route 옵져버블 셋팅
         */
        this.queryParams$ = this.route.queryParams.pipe(
            take(1),
            tap(ev => console.log('[queryParams$]', ev)),
            pluck('search'),
            tap(ev => console.log('[queryParams$]', ev))
        );

        /**
         * vm 옵져버블 셋팅
         * tap(ev => console.log('[main-search > vm$]', ev))
         */
        this.vm$ = this.store
            .pipe(select(searchRoomtypeSelectors.selectComponentStateVm));
        // search result
        this.searchResult$ = this.vm$
            .pipe(pluck('result'),);
        // hotelInfo
        this.hotelInfo$ = this.searchResult$
            .pipe(pluck('hotel'),);
        // hotelInfo
        this.photos$ = this.hotelInfo$
            .pipe(pluck('photos'),);
        // tripAdvisor
        this.tripAdvisor$ = this.hotelInfo$
            .pipe(pluck('tripAdvisor'),);
        // pois
        this.poi$ = this.hotelInfo$
            .pipe(pluck('poi'),);
    }

    /**
     * 데이터 초기화
     */
    async dataInit() {
        /**
         * 파라메터 상태에 따라 api 호출 여부 결정
         */
        this.subscriptionList.push(
            this.queryParams$
                .subscribe(
                    (ev: any) => (ev) ? this.searchBool = true : this.searchBool = false
                )
        );

        switch (this.searchBool) {
            case false:
                console.info('[switch > false ]');
                this.vmModel = await this._api.getHotelInformation(this.con);
                this.vmModel.id = 'airtel-search-roomtype-page';
                this.upsertOne(this.vmModel);
                break;
            case true:
                console.info('[switch > true]');
                break;
            default:
        }

        this.initBool = true;
    }

    /**
     * 초기화 데이터 로드
     * - 최근 스토어 데이터를 가져온다.
     * - 가져온 데이터를 수정하기 위해 _.cloneDeep 적용.
     * - take(1) : 한번만 실행.
     * @param cloneDeep default true
     */
    initDataLoad($bool: boolean = true): void {
        this.subscriptionList.push(
            this.vm$
                .pipe(take(1))
                .subscribe(
                    (ev) => {
                        this.initData = ($bool) ? _.cloneDeep(ev) : ev;
                    }
                )
        );
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertAirtelSearchRoomtype({
            airtelSearchRoomtype: $obj
        }));
    }

    getHotelRating(hotelGradeCode) {
        if (!hotelGradeCode) {
            return '0';
        }

        const hotelGradeCodeSplit = hotelGradeCode.split('.');
        let result = hotelGradeCodeSplit[0];
        if (hotelGradeCodeSplit.length > 1) {
            result += 'h';
        }
        return result;
    }
}
