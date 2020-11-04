import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { clearRentModalCalendars } from '../../store/rent-common/rent-modal-calendar/rent-modal-calendar.actions';
import { clearRentModalDestinations } from '../../store/rent-common/rent-modal-destination/rent-modal-destination.actions';
import { upsertRentSearchResultPage } from '../../store/rent-search-result-page/rent-search-result-page/rent-search-result-page.actions';
import { upsertRentMainSearch } from 'src/app/store/rent-main-page/rent-main-search/rent-main-search.actions';

import { TranslateService } from '@ngx-translate/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CountdownTimerService } from 'ngx-timer';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as qs from 'qs';

import { ApiRentService } from 'src/app/api/rent/api-rent.service';
import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { RentUtilService } from '../../common-source/services/rent-com-service/rent-util.service';
import { StorageService } from '@app/common-source/services/storage/storage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from '../../common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { RentModalDetailFilterComponent } from './modal-components/rent-modal-detail-filter/rent-modal-detail-filter.component';
import { RentModalAlignFilterComponent } from './modal-components/rent-modal-align-filter/rent-modal-align-filter.component';
import { RentModalResearchComponent } from './modal-components/rent-modal-research/rent-modal-research.component';
import { RentModalBranchofficeComponent } from '../rent-booking-information-page/modal-components/rent-modal-branchoffice/rent-modal-branchoffice.component';

@Component({
    selector: 'app-rent-search-result-page',
    templateUrl: './rent-search-result-page.component.html',
    styleUrls: ['./rent-search-result-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RentSearchResultPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    ctx: any = this;
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;

    vehiclesLocationsList: Array<any>; // api rs 위치정보
    vehiclesList: Array<any>; // api rs 렌터카 정보
    venhiclesFilter: object; // api rs 필터 정보
    venhiclesSelectFilter: object; // api rs 선택한 필터 정보
    transactionSetId: string; // 트랜잭션 ID

    loadingBool: boolean = false;
    isSearchDone: boolean = false;

    bsModalFilterRef: any;
    bsModalAlignRef: any;
    bsModalChangeRef: any;

    resolveData: any;
    resData: any;
    locationType: any;
    infiniteScrollConfig: any = {
        distance: 2,
        throttle: 50
    };

    isListType: boolean = true;

    public detailUpdate: boolean;
    public alignUpdate: boolean;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        public rentUtilSvc: RentUtilService,
        private store: Store<any>,
        private router: Router,
        private route: ActivatedRoute,
        private apiRentService: ApiRentService,
        private bsModalService: BsModalService,
        private loadingBar: LoadingBarService,
        private countdownTimerService: CountdownTimerService,
        private storageS: StorageService,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;

        this.detailUpdate = false;
        this.alignUpdate = false;
        this.subscriptionList = [];
    }

    /**
     * 0. store > rent-common 초기화
     * 1. route 통해 데이터 전달 받기
     * 2. 헤더 초기화
     * 3. api 호출
     */
    ngOnInit(): void {
        console.info('[ngOnInit > 렌터카 결과 1]');
        super.ngOnInit();
        this.timerInit();
        this.storeRentCommonInit(); // store > rent-common 초기화

        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveData = _.cloneDeep(data.resolveData);
                        console.log(data, 'data');
                        const limits = _
                            .chain(this.resolveData)
                            .get('rq.condition.limits')
                            .value()
                            .map((o) => {
                                return Number(o);
                            });
                        this.resolveData.rq.condition.limits = limits;

                        this.storageS.makeRecentData(
                            'local',
                            {
                                resolveData: this.resolveData,
                                rq: this.resolveData.rq,
                                dateRange: `${moment(this.resolveData.rq.condition.pickupDatetime).format('MM.DD(ddd) HH:mm')}-${moment(this.resolveData.rq.condition.returnDatetime).format('MM.DD(ddd) HH:mm')}`,
                                detailUpdate: undefined,
                                alignUpdate: undefined
                            },
                            'rent'
                        );
                        console.log(this.resolveData, 'this.resolveData,');

                        if (_.has(this.resolveData, 'rq.condition.filter.passengerCounts')) {
                            const passengerCounts = _.chain(this.resolveData)
                                .get('rq.condition.filter.passengerCounts')
                                .value()
                                .map((o) => {
                                    const temp = {
                                        passengerCount: Number(o.passengerCount)
                                    };
                                    return temp;
                                });

                            console.info('[passengerCounts]', passengerCounts);
                            _.set(this.resolveData, 'rq.condition.filter.passengerCounts', passengerCounts);
                        }

                        console.info('[1. route 통해 데이터 전달 받기 isBrowser]', this.resolveData);

                        this.detailUpdate = (data.resolveData.detailUpdate === 'true');
                        this.alignUpdate = (data.resolveData.alignUpdate === 'true');
                        console.log(this.alignUpdate, 'this.alignUpdate');
                        this.isListType = (data.resolveData.isListType === 'true');
                        // this.resolveData = _.omit(this.resolveData, 'detailUpdate', 'alignUpdate');

                        if (this.isBrowser) {
                            this.pageInit();
                        }
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

                            this.timerAlert();
                        }
                    }
                )
        );
    }

    /**
     * 페이지 초기화
     * 1. 헤더 초기화
     * 2. api 호출
     * - rs store 저장
     * @param $resolveData
     */
    async pageInit() {

        // ---------[rent-list-rq-info 스토어에 저장]
        this.upsertOne({
            id: 'rent-list-rq-info',
            result: this.resolveData
        });


        // ---------[헤더 초기화]
        const headerTitle = `${this.resolveData.rq.condition.pickupCityCodeIata} 차량선택`;
        const pickupDatetime = moment(this.resolveData.rq.condition.pickupDatetime).format('MM.DD(HH:mm)');
        const returnDatetime = moment(this.resolveData.rq.condition.returnDatetime).format('MM.DD(HH:mm)');
        const headerTime = `${pickupDatetime}-${returnDatetime}`;

        this.headerInit('rentalcar', headerTitle, headerTime);
        // ---------[ end 헤더 초기화]
        this.isSearchDone = false;
        this.loadingBool = false;
        this.loadingBar.start();
        this.resData = await this.getRentList(this.resolveData.rq);
        this.loadingBool = true;
        this.loadingBar.complete();

        console.log('[this.resData]', this.resData);
        if (this.resData) {
            this.vehiclesList = this.resData.result['vehicles'];
            this.vehiclesLocationsList = this.resData.result['locations'];
            this.venhiclesFilter = this.resData.result['forFilter'];
            this.venhiclesSelectFilter = this.resData.result['filter'];
            this.transactionSetId = this.resData.transactionSetId;
        }

        this.upsertOne({
            id: 'rent-list-rs',
            res: this.resData
        });
        this.isSearchDone = true;

        const locations: Array<any> = [];
        this.resData.result.locations.forEach(location => {
            locations[location.locationCode] = location;
        });

        const locationType: any = _.cloneDeep(locations[this.resData.result.vehicles[0].pickup.locationCode]);
        this.locationType = locationType;
    }

    /**
     * 더보기
     */
    async restListIncrease() {
        this.curLimitsIncrease();
        this.loadingBar.start();
        const res = await this.getRentList(this.resolveData.rq);
        this.loadingBar.complete();

        console.info('[restListIncrease > res]', res);

        this.vehiclesList = [...this.vehiclesList, ...res['result']['vehicles']];
        this.vehiclesLocationsList = [...this.vehiclesLocationsList, ...res['result']['locations']];

    }

    /**
     * 렌터카 리스트
     * $curLimits
     */
    async getRentList($rq) {
        return this.apiRentService.POST_RENT_LIST($rq)
            .toPromise()
            .then((res: any) => {

                if (res.succeedYn) {
                    console.info('[렌터카 리스트 > res]', res['result']);
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
        const resolveData = _.cloneDeep(this.resolveData);
        resolveData.rq.condition.limits[0] += 10;
        resolveData.rq.condition.limits[1] += 10;
        this.resolveData = resolveData;
        console.log(resolveData);
    }


    /**
     * 헤더 초기화
     */
    headerInit($iconType, $headerTitle, $headerTime) {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            icon: $iconType,
            step: {
                title: $headerTitle,
                changeBtnFun: this.onChangeBtnClick
            },
            detail: $headerTime,
            ctx: this.ctx
        };
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertRentSearchResultPage({
            rentSearchResultPage: $obj
        }));
    }

    /**
     * store > rent-common 초기화
     */
    storeRentCommonInit() {
        console.info('[0. store > rent-common 초기화]');
        this.store.dispatch(clearRentModalDestinations());
        this.store.dispatch(clearRentModalCalendars());
    }

    timerAlert() {
        const initialState = {
            titleTxt: '검색 후 10분이 경과하여 재검색 합니다.',
            closeObj: {
                fun: () => {
                    this.router.navigateByUrl(`/`, { skipLocationChange: true }).then(
                        () => {
                            this.router.navigateByUrl(this.route.snapshot['_routerState'].url);
                        });
                }
            },
            okObj: {
                fun: () => {
                    this.router.navigateByUrl(`/`, { skipLocationChange: true }).then(
                        () => {
                            this.router.navigateByUrl(this.route.snapshot['_routerState'].url);
                        });
                }
            }
        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
    }

    /**
     * 모든 bsModal 창 닫기
     */
    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    /**
     * 변경
     * @param $ctx
     */
    onChangeBtnClick($ctx) {
        console.info('onChangeBtnClick', $ctx);

        if ($ctx.isSearchDone) {
            const itemCategoryCode = 'IC03';
            const storeId = '';

            // 모달 전달 데이터
            const initialState = {
                storeId: storeId,
                itemCategoryCode: itemCategoryCode,
                stationTypeCode: environment.STATION_CODE
            };

            // ngx-bootstrap config
            const configInfo = {
                class: 'm-ngx-bootstrap-modal',
                animated: false
            };

            console.info('[initialState]', initialState);
            $ctx.bsModalChangeRef = $ctx.bsModalService.show(RentModalResearchComponent, { initialState, ...configInfo });
        }

    }

    /**
     * 필터
     */
    onFilterClick() {
        const itemCategoryCode = 'IC03';
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
        this.resData = _.cloneDeep(this.resData);
        this.resData.isListType = this.isListType;
        this.upsertOne({
            id: 'rent-list-rs',
            res: this.resData
        });

        this.bsModalFilterRef = this.bsModalService.show(RentModalDetailFilterComponent, { initialState, ...configInfo });
    }

    /**
     * 정렬
     */
    onAlignClick() {
        const itemCategoryCode = 'IC03';
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
        this.resData = _.cloneDeep(this.resData);
        this.resData.isListType = this.isListType;
        this.upsertOne({
            id: 'rent-list-rs',
            res: this.resData
        });

        this.bsModalAlignRef = this.bsModalService.show(RentModalAlignFilterComponent, { initialState, ...configInfo });
    }

    /**
     * 리스트 항목 클릭
     */
    onItemClick($vehicleItem) {
        console.info('[리스트 항목 클릭]', $vehicleItem);

        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                pickup: {
                    cityCodeIata: $vehicleItem.pickup.cityCodeIata,
                    locationCode: $vehicleItem.pickup.locationCode,
                    datetime: $vehicleItem.pickup.datetime
                },
                return: {
                    cityCodeIata: $vehicleItem.return.cityCodeIata,
                    locationCode: $vehicleItem.return.locationCode,
                    datetime: $vehicleItem.return.datetime
                },
                vehicleIndex: $vehicleItem.vehicleIndex,
                accessLevel: $vehicleItem.accessLevel,
                vehicleVendorCode: $vehicleItem.vehicleVendorCode,
                sippCode: $vehicleItem.sippCode,
                vendorCurrencyCode: $vehicleItem.vendorCurrencyCode,
                baseRateTypeCode: $vehicleItem.baseRateTypeCode,
                vendorAmountSum: $vehicleItem.vendorAmountSum,
                rateIdentifier: $vehicleItem.rateIdentifier,
                rateCategoryCode: $vehicleItem.rateCategoryCode,
                fareTypeCode: $vehicleItem.fareTypeCode,
                vehicleTypeOwner: $vehicleItem.vehicleTypeOwner
            }

        };

        const resolveDataRqCondition = this.resolveData.rq.condition;
        console.info('[resolveDataRqCondition]', resolveDataRqCondition);

        const listFilterRq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                pickupCityCodeIata: resolveDataRqCondition.pickupCityCodeIata,
                pickupDatetime: resolveDataRqCondition.pickupDatetime,
                returnCityCodeIata: resolveDataRqCondition.returnCityCodeIata,
                returnDatetime: resolveDataRqCondition.returnDatetime,
                driverBirthday: resolveDataRqCondition.driverBirthday,
                limits: [0, 10],
                sortOrder: resolveDataRqCondition.sortOrder,
                filter: {
                    vehicleIndex: $vehicleItem.vehicleIndex
                }
            },
            transactionSetId: this.transactionSetId,
        };

        const rqInfo = {
            listFilterRq: listFilterRq,
            rq: rq
        };

        console.info('[resolveData]', this.resolveData);
        console.info('[데이터 rqInfo]', rqInfo);

        const qsStr = qs.stringify(rqInfo);
        const path = '/rent-booking-information/' + qsStr;
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }

    trackByFun(item) {
        if (!item) return null;
        return item.vehicleName;
    }

    onScroll() {
        console.info('[무한스크롤 이벤트]', this.loadingBool);

        if (!this.loadingBool) {
            return;
        }

        const totalCount = this.resData.result.totalVehicleCount;
        const curCount = this.vehiclesList.length;

        // console.info('[무한스크롤 이벤트 > totalCount]', totalCount);
        // console.info('[무한스크롤 이벤트 > curCount]', curCount);
        // console.info('[무한스크롤 이벤트 > (totalCount - curCount)]', (totalCount - curCount));

        if ((totalCount - curCount) > 0) {
            this.restListIncrease();
        } else {
            console.info('[마지막 페이지 입니다.]');
        }



        // this.restListIncrease();
    }

    onTypeChange() {
        this.isListType = !this.isListType;
    }

    /**
     * ErrorResultComponent output 이벤트
     * 에러 발생 > 다시 검색 버튼 클릭 >  메인 이동
     * 1. 검색 폼 디폴트 데이터 세팅
     * 2. 각 카테고리 메인으로 이동
     * @param e
     */
    errorSearchAgain(e) {
        console.info(e);
        const path = e;
        const obj: any = {
            id: 'rent-search-again',
            search: _.omit(this.resolveData, 'rq')
        };

        this.store.dispatch(upsertRentMainSearch({
            rentMainSearch: obj
        }));

        this.router.navigate([path]);

    }
    /**
     * imgLoadError
     * 이미지 로드 에러 시 이미지 변경
     *
     * @param event
     */
    public imgLoadError(event: any, typeCode: string) {
        event && event.preventDefault();
        event.target.src = `/assets/images/car/${typeCode}.JPG`;
    }

    onLocationClick(event: MouseEvent, $idx: number) {
        event && event.preventDefault();
        console.log(this.resData.result, 'result');
        console.log(this.locationType, 'this.locationType');

        const initialState = {
            locationCode: this.resData.result.locations[$idx].locationCode,
            latitude: this.locationType.latitude,
            longitude: this.locationType.longitude,
            openningHours: this.locationType.openningHours,
            address: this.locationType.address,
            locationName: this.resData.result.pickup,
            vehicleName: this.resData.result.vehicles[$idx].vehicleName,
            vehicleVendorCode: this.resData.result.vehicles[$idx].vehicleVendorCode,
        };
        console.log(initialState, 'initialState');

        // ngx-bootstrap configlongitude
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(RentModalBranchofficeComponent, { initialState, ...configInfo });
    }

}
