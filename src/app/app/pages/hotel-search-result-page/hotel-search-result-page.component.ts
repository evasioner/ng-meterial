import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

//store
import { clearHotelModalCalendars } from 'src/app/store/hotel-common/hotel-modal-calendar/hotel-modal-calendar.actions';
import { clearHotelModalDestinations } from 'src/app/store/hotel-common/hotel-modal-destination/hotel-modal-destination.actions';
import { clearHotelModalTravelerOptions } from 'src/app/store/hotel-common/hotel-modal-traveler-option/hotel-modal-traveler-option.actions';
import { clearHotelModalDetailOptions } from '../../store/hotel-common/hotel-modal-detail-option/hotel-modal-detail-option.actions';
import { upsertHotelSearchResult } from 'src/app/store/hotel-search-result-page/hotel-search-result/hotel-search-result.actions';
import { upsertHotelMainSearch } from 'src/app/store/hotel-main-page/hotel-main-search/hotel-main-search.actions';

import { getSelectId } from 'src/app/store/hotel-search-result-page/hotel-search-result/hotel-search-result.selectors';

import { TranslateService } from '@ngx-translate/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CountdownTimerService } from 'ngx-timer';

import * as moment from 'moment';
import { extendMoment } from 'moment-range';
import * as _ from 'lodash';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { UtilBase64Service } from 'src/app/common-source/services/util-base64/util-base64.service';
import { ApiHotelService } from 'src/app/api/hotel/api-hotel.service';
import { HotelSearchResultService } from './services/hotel-search-result/hotel-search-result.service';
import { HotelComService } from 'src/app/common-source/services/hotel-com-service/hotel-com-service.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { HotelModalResearchComponent } from './modal-components/hotel-modal-research/hotel-modal-research.component';
import { HotelModalDetailFilterComponent } from './modal-components/hotel-modal-detail-filter/hotel-modal-detail-filter.component';
import { HotelModalAlignFilterComponent } from './modal-components/hotel-modal-align-filter/hotel-modal-align-filter.component';
import { HotelModalMapFilterComponent } from './modal-components/hotel-modal-map-filter/hotel-modal-map-filter.component';

@Component({
    selector: 'app-hotel-search-result-page',
    templateUrl: './hotel-search-result-page.component.html',
    styleUrls: ['./hotel-search-result-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HotelSearchResultPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    ctx: any = this;
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;

    vm: any;
    routeData: any;
    hotelListRq: any; // 가공된 hotel/list rq
    researchRq: any; // 재검색용 가공된 hotel/list rq

    hotelList: Array<any> = []; // hotel/list rs > hotelList
    hotelTransactionSetId: any; // hotel/list rs > 트랜잭션 Id

    nowItem: number; // hotel/list rs > nowItem : 전체 검색된 호텔 전체 수 (없을 시, 0 으로 내려옴)
    allVendors: number; // hotel/list rs > allVendors
    nowVendors: number; // hotel/list rs > nowVendors

    loadingBool: boolean = false;
    isSearchDone: boolean = false;

    hotelListRes$: Observable<any>;

    bsModalDetailRef: any;
    bsModalAlignRef: any;
    bsModalMapRef: any;
    bsModalChangeRef: any;

    infiniteScrollConfig: any = {
        distance: 2,
        throttle: 50
    };

    private subscriptionList: Subscription[];

    public detailUpdate: Boolean;        // 상세필터 변경 유무
    public alignUpdate: Boolean;         // 정렬필터 변경 유무

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private store: Store<any>,
        private router: Router,
        private route: ActivatedRoute,
        private base64Svc: UtilBase64Service,
        private apiHotelService: ApiHotelService,
        private bsModalService: BsModalService,
        private comService: HotelComService,
        private _service: HotelSearchResultService,
        private loadingBar: LoadingBarService,
        private countdownTimerService: CountdownTimerService,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );

        this.detailUpdate = false;
        this.alignUpdate = false;

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.subscriptionList = [];
    }

    /**
     * 1. route 통해 데이터 전달 받기
     * 2. 헤더 초기화
     * 3. api 호출
     */

    ngOnInit(): void {
        super.ngOnInit();
        this.timerInit();
        this.storeHotelCommonInit();

        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.info('[1. route 통해 데이터 전달 받기]', data);
                        this.routeData = _.cloneDeep(data.resolveData);
                        const rq = this._service.makeHotelListRq(data.resolveData);
                        this.routeData.rq = _.cloneDeep(rq);
                        this.hotelListRq = _.cloneDeep(rq);
                        this.researchRq = _.cloneDeep(rq);

                        this.detailUpdate = (this.routeData.detailUpdate === 'true');
                        this.alignUpdate = (this.routeData.alignUpdate === 'true');

                        if (this.isBrowser) {
                            console.info('[1-1. 가공된 rq 데이터]', rq);
                            this.pageInit(this.routeData);
                        }
                    }
                )
        );
    }

    ngOnDestroy() {
        this.rxAlive = false;
        console.info('[ngOnDestroy > rxAlive]', this.rxAlive);
        this.closeAllModals();
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    /**
     * 모든 bsModal 창 닫기
     */
    closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    timerInit() {
        const cdate = new Date();
        const timerVal = 10; // 타이머 분 설정
        cdate.setMinutes(cdate.getMinutes() + timerVal);
        this.countdownTimerService.startTimer(cdate);

        this.subscriptionList.push(
            this.countdownTimerService.onTimerStatusChange
                .pipe(take(1))
                .subscribe(
                    (status: any) => {
                        if (status === 'END') {
                            this.rxAlive = false;
                            console.info('[status]', status);
                            console.info('[rxAlive]', this.rxAlive);
                            console.info('[timerValue]', this.countdownTimerService.timerValue);

                            const alertTxt = '검색 후 10분이 경과하여 재검색 합니다.';
                            this.comService.timerAlert(alertTxt);
                        }
                    }
                )
        );
    }
    /**
    * 옵저버블 초기화
    */
    observableInit() {
        this.hotelListRes$ = this.store.pipe(
            select(getSelectId(['hotel-search-result']))
        );

    }

    /**
     * 서브스크라이브 초기화
     */
    // subscribeInit() {
    //     this.subscriptionList.push(
    //         this.hotelListRes$
    //             .pipe(takeWhile(val => this.rxAlive))
    //             .subscribe(
    //                 (ev: any) => {
    //                     console.info('[hotelListRes$ > subscribe]', ev);
    //                     if (ev) {
    //                         if (this.nowVendors < this.allVendors) {
    //                             const rq = _.cloneDeep(this.hotelListRq);
    //                             rq.transactionSetId = this.hotelTransactionSetId;
    //                             this.setHotelList(rq);
    //                         } else {
    //                             console.info(" isSearchDone ", this.isSearchDone);
    //                         }
    //                         this.isSearchDone = true;
    //                     }
    //                 }
    //             )
    //     );
    // }

    /**
     * 페이지 초기화
     * 1. 헤더 초기화
     * 2. api 호출
     * - rs store 저장
     * @param $resolveData
     */
    async pageInit($resolveData) {
        this.upsertOne({
            id: 'hotel-list-rq-info',
            res: $resolveData
        });
        // ---------[헤더 초기화]
        const Moment = extendMoment(moment);
        console.info('$resolveData.hotelCity.name' + $resolveData.cityName);
        const checkInDate = moment(this.hotelListRq.condition.checkInDate).format('MM.DD');
        const checkOutDate = moment(this.hotelListRq.condition.checkOutDate).format('MM.DD');
        const range = Moment.range(this.hotelListRq.condition.checkInDate, this.hotelListRq.condition.checkOutDate);
        const dayDiff = range.diff('days'); //여행일수
        const roomList = this.comService.getTravelerInfo($resolveData.roomList, true); //객실 수, 인원

        const headerTitle = `01. 호텔 선택`;
        const headerDetail = `${checkInDate}-${checkOutDate}(${dayDiff}박), ${roomList}`;

        this.headerInit('hotel', headerTitle, headerDetail);
        // ---------[ end 헤더 초기화]
        this.isSearchDone = false;
        this.loadingBool = false;
        this.loadingBar.start();
        console.info('setHotelList');
        this.vm = await this.getHotelList(this.hotelListRq);

        if (this.vm) {
            const res = this.vm['result'];
            this.hotelList = this.comService.changeDefaultPhotoUrl(res['hotels']);
            this.hotelList.forEach((item) => {
                let resultUrl = '';
                if (item.defaultPhotoUrl) {
                    resultUrl = this.comService.replacePhotoUrl(item.defaultPhotoUrl);
                    item.defaultPhotoUrl = resultUrl;
                }
            });
            this.nowVendors = res['count']['nowVendors'];
            this.allVendors = res['count']['allVendors'];
            this.nowItem = res['count']['nowItem'];
            this.vmStoreUpdate();
        }

        this.isSearchDone = true;
        this.loadingBool = true;
        this.loadingBar.complete();
        // ---------[api 호출 | 호텔 리스트]
    }

    /**
     * 더보기
     */
    async hotelListIncrease() {
        const searchConunt: number = this.hotelList.length;
        if (searchConunt < this.nowItem) {
            this.isSearchDone = false;
            this.loadingBar.start();

            this.curLimitsIncrease();

            this.vm = await this.gethotelListIncrease(this.hotelListRq);
            if (this.vm) {
                const hotels = this.comService.changeDefaultPhotoUrl(this.vm['result']['hotels']);
                this.hotelList = [...this.hotelList, ...hotels];
                console.info('[hotelListIncrease > hotelList]', this.hotelList);
            }

            this.isSearchDone = true;
            this.loadingBar.complete();
        }
    }


    /**
     * 호텔 리스트
     * @param $rq
     */
    async getHotelList($rq) {
        console.info('[2. api 호출]', $rq);

        return this.apiHotelService.POST_HOTEL_LIST($rq)
            .toPromise()
            .then((res: any) => {
                console.info('[호텔 > res]', res);
                if (res.succeedYn) {
                    this.hotelTransactionSetId = res['transactionSetId'];
                    console.info('[end api 호출]');
                    return res;
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err);
            });
    }

    /**
     * 스크롤 작동시
     * 호텔 리스트 가져오기
    */
    async gethotelListIncrease($rq) {
        console.info('[2. api 호출]', $rq);

        return this.apiHotelService.POST_HOTEL_LIST($rq)
            .toPromise()
            .then((res: any) => {
                console.info('[호텔 > res]', res);

                if (res.succeedYn) {
                    this.hotelTransactionSetId = res['transactionSetId'];
                    console.info('[end api 호출]');
                    return res;
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err);
            });

    }

    /**
     * 증가
     */
    curLimitsIncrease() {
        console.info('[curLimitsIncrease]');
        const rq = _.cloneDeep(this.hotelListRq);
        rq.condition.limits[0] += 10;
        rq.condition.limits[1] += 10;
        rq.transactionSetId = this.hotelTransactionSetId;
        this.hotelListRq = rq;
    }


    headerInit($iconType, $headerTitle, $headerTime) {
        console.info('[1.헤더 초기화]');
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            icon: $iconType,
            step: {
                title: $headerTitle,
                changeBtnFun: this.onChangeBtnClick,
            },
            detail: $headerTime,
            backList: ['hotel-main'],
            ctx: this.ctx
        };
    }
    /**
     * vm 스토어에 저장
     */
    vmStoreUpdate() {
        console.info('[vmStoreUpdate > vm 스토어에 저장]', this.vm);
        this.upsertOne({
            id: 'hotel-search-result',
            res: this.vm
        });
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertHotelSearchResult({
            hotelSearchResult: $obj
        }));
    }

    /**
    * store > hotel-common 초기화
    */
    storeHotelCommonInit() {
        console.info('[0. store > hotel-common 초기화]');
        this.store.dispatch(clearHotelModalDestinations());
        this.store.dispatch(clearHotelModalCalendars());
        this.store.dispatch(clearHotelModalTravelerOptions());
        this.store.dispatch(clearHotelModalDetailOptions());
    }
    onChangeBtnClick($ctx) {
        console.info('onChangeBtnClick', $ctx);

        if ($ctx.isSearchDone) {

            const itemCategoryCode = 'IC02';
            const storeId = '';

            // 모달 전달 데이터
            const initialState = {
                storeId: storeId,
                itemCategoryCode: itemCategoryCode
            };

            // ngx-bootstrap config
            const configInfo = {
                class: 'm-ngx-bootstrap-modal',
                animated: false
            };

            console.info('[initialState]', initialState);
            $ctx.bsModalChangeRef = $ctx.bsModalService.show(HotelModalResearchComponent, { ...configInfo });
        }
    }

    public onHotelDtl($hotelItem) {
        console.log('move hotel detail...', this.routeData);
        if (this.isSearchDone) {
            const rqInfo = {
                city: this.routeData.city,
                cityGubun: this.routeData.cityGubun,
                cityName: this.routeData.cityName,
                chkIn: this.routeData.chkIn,
                chkOut: this.routeData.chkOut,
                roomList: this.routeData.roomList,
                hCode: $hotelItem.hotelCode,
                trd: this.hotelTransactionSetId
            };

            //detail

            if (_.has(this.hotelListRq.condition, 'regionCode')) {
                rqInfo['regionCode'] = this.hotelListRq.condition.regionCode;
            }

            if (_.has(this.hotelListRq.condition, 'filter')) {
                rqInfo['filter'] = this.hotelListRq.condition.filter;
            }

            console.info('[데이터 rqInfo]', rqInfo);
            this.comService.goToHotelSearchRoomtype(rqInfo);
        }
    }

    /**
     *호텔 등급 클래스명 구하기
     * @param $star -> ex) 5.0 / 4.5 ...
     */
    getHotelStarRating($star) {
        if (!$star) {
            return '0';
        }

        const hotelGradeCodeSplit = $star.split('.');
        let result = hotelGradeCodeSplit[0];
        if (hotelGradeCodeSplit[1] > 0) {
            result += 'h';
        }
        return result;
    }

    onDetailFilter() {
        if (this.isSearchDone) {
            const configInfo = {
                class: 'm-ngx-bootstrap-modal',
                animated: false
            };

            this.bsModalDetailRef = this.bsModalService.show(HotelModalDetailFilterComponent, { ...configInfo });
        }
    }

    onAlignFilter() {
        if (this.isSearchDone) {
            const configInfo = {
                class: 'm-ngx-bootstrap-modal',
                animated: false
            };

            this.bsModalAlignRef = this.bsModalService.show(HotelModalAlignFilterComponent, { ...configInfo });
        }
    }

    onMapFilter() {
        if (this.isSearchDone && this.vm.result.geography) {
            const rq = this.hotelListRq;
            rq.condition.limits[0] = 0;
            rq.condition.limits[1] = this.nowItem;
            const initialState = {
                hotelTransactionSetId: this.hotelTransactionSetId,
                geography: this.vm.result.geography
            };

            const configInfo = {
                class: 'm-ngx-bootstrap-modal',
                animated: false
            };

            this.bsModalMapRef = this.bsModalService.show(HotelModalMapFilterComponent, { initialState, ...configInfo });
        }
    }

    onScroll() {
        if (this.isSearchDone)
            this.hotelListIncrease();
    }
    /**
     * 타이머 종료시, 재검색
     *
     * @param $rxAlive
     */
    timerResearch($rxAlive) {
        console.info('*********timerResearch*********');
        if ($rxAlive) { // 페이지 이동시 실행되는 현상 방지
            const base64Str = this.base64Svc.base64EncodingFun(this.researchRq);
            const path = '/hotel-search-result/' + base64Str;

            // 페이지 이동후 생명주기 재실행
            this.router.navigateByUrl('/', { skipLocationChange: true })
                .then(() => this.router.navigate([path]));
        }
    }

    /**
     * ErrorResultComponent output 이벤트
     * 에러 발생 > 다시 검색 버튼 클릭 >  메인 이동
     * 1. 검색 폼 디폴트 데이터 세팅
     * 2. 각 카테고리 메인으로 이동
     * @param e
     */
    errorSearchAgain(e: any) {
        const path = e;
        // 1. 검색 폼 디폴트 값 데이터 세팅

        /**
         * 호텔 결과 페이지 Request Data Model
         * environment.STATION_CODE
         */
        const rqInfo = {
            city: this.routeData.city,
            cityGubun: this.routeData.cityGubun,
            cityName: this.routeData.cityName,
            chkIn: this.routeData.chkIn,
            chkOut: this.routeData.chkOut,
            roomList: this.routeData.roomList
        };

        if (_.has(this.researchRq.condition, 'filter')) {
            const filter: any = this.researchRq.condition.filter;
            const detailObj: any = {};
            let price: any;
            let review: any;
            let star: any;
            if (_.has(filter, 'amount'))
                price = [filter.amount.lowestAmount, filter.amount.highestAmount];

            if (_.has(filter, 'reviewRatings'))
                review = [filter.reviewRatings.lowestRating, filter.reviewRatings.highestRating];

            if (_.has(filter, 'starRatings'))
                star = filter.starRatings;

            if (!_.isEmpty(price))
                detailObj['price'] = price;

            if (!_.isEmpty(review))
                detailObj['review'] = review;

            if (!_.isEmpty(star))
                detailObj['star'] = star;

            rqInfo['detail'] = detailObj;
        }

        console.info('againSearch > rqInfo', rqInfo);
        // 2. 각 카테고리 메인으로 이동
        const obj = {
            id: 'hotel-search-again',
            search: rqInfo
        };

        this.store.dispatch(upsertHotelMainSearch({
            hotelMainSearch: obj
        }));

        this.router.navigate([path]);

    }

    makeObjStr(obj) {
        const list = [];
        _.forEach(obj, (v1) => {
            list.push(v1);
        });

        const returnStr = _.join(list, '@');
        console.info('makeObjStr', returnStr);
        return returnStr;
    }
}
