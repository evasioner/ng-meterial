import { Component, Inject, OnInit, PLATFORM_ID, ElementRef, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, switchMap, tap, filter, finalize } from 'rxjs/operators';
import { fromEvent, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

// 항공
import { upsertFlightModalDestination } from '@app/store/flight-common/flight-modal-destination/flight-modal-destination.actions';
// 호텔
import { upsertHotelModalDestination } from '@app/store/hotel-common/hotel-modal-destination/hotel-modal-destination.actions';
// 렌트
import { upsertRentModalDestination } from '@app/store/rent-common/rent-modal-destination/rent-modal-destination.actions';
// 액티비티
import { upsertActivityModalDestination } from '@app/store/activity-common/activity-modal-destination/activity-modal-destination.actions';
// 묶음할인
import { upsertAirtelModalDestination } from '@app/store/airtel-common/airtel-modal-destination/airtel-modal-destination.actions';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { ApiCommonService } from '../../../api/common/api-common.service';
import { StorageService } from '../../services/storage/storage.service';

import { DestinationInfo } from './models/destination-info';
import { MajorDestination } from './models/major-destination';

import { DestinationType } from '../../enums/destinationType.enum';

import { BaseChildComponent } from '../../../pages/base-page/components/base-child/base-child.component';
import { ApiAlertService } from '../../services/api-alert/api-alert.service';

@Component({
    selector: 'app-modal-destination',
    templateUrl: './modal-destination.component.html',
    styleUrls: ['./modal-destination.component.scss']
})
export class ModalDestinationComponent extends BaseChildComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('destinationSearchInput') destinationSearchInput: ElementRef;

    storeId: string;
    majorDestinationRq: any;
    destinationRq: any;

    // 모델 id 설정
    updateModel: any;

    searchBool: boolean = false;
    realTimeLoadingBool: boolean = false;

    destinationType: any = DestinationType;

    majorDestinationInfo: MajorDestination; // 주요 도시 목록
    destinationInfo: DestinationInfo[]; // 도시 목록
    destinationInfoValLeng: number; // 도시 목록 갯수 :  destinationInfo > val 갯수 총합

    realSearchWord: any; // 실시간 검색어 저장

    realTimeSearchCount: number = 0;

    private subscriptionList: Subscription[];
    recentList: Array<any>;
    engRegex: RegExp;
    korRegex: RegExp;
    headerTitle: string;
    placeholderText: string;
    viewPageName: string;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        public translateService: TranslateService,
        private apiCommonService: ApiCommonService,
        public bsModalRef: BsModalRef,
        private storageS: StorageService,
        private alertService: ApiAlertService
    ) {
        super(platformId);

        this.initialize();
    }

    ngOnInit(): void {
        super.ngOnInit();
        console.info('[ModalDestinationComponent > ngOnInit]', this);
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        this.baseSetTitle();
        this.modalInit();
    }

    ngAfterViewInit() {
        this.searchInit();
    }

    ngOnDestroy() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');

        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    /**
    * initialize
    * 초기화
    */
    private initialize(): void {
        this.subscriptionList = [];
        this.recentList = [];
        this.majorDestinationInfo = {
            list: []
        };
        this.engRegex = /[A-Za-z1-9]/;
        this.korRegex = /[가-힣]/;
        this.headerTitle = '목적지 검색';
        this.placeholderText = '';
        this.viewPageName = '';
    }

    private baseSetTitle() {
        // 번역 주석
        // this.subscriptionList.push(
        //     this.translateService.getTranslation(
        //         this.translateService.getDefaultLang()
        //     )
        //         .pipe(take(1))
        //         .subscribe(
        //             (ev: any) => { }
        //         )
        // );


        // store 아이디로 어디서 검색하는지 체크
        switch (this.storeId) {
            case 'origin':
                this.viewPageName = 'flight';
                this.headerTitle = '출발지 검색';
                this.placeholderText = '도시명 또는 공항명 입력';
                break;

            case 'destination':
                this.viewPageName = 'flight';
                this.headerTitle = '목적지 검색';
                this.placeholderText = '도시명 또는 공항명 입력';
                break;

            case 'hotelCity':
                this.viewPageName = 'hotel';
                this.headerTitle = '목적지 검색';
                this.placeholderText = '도시명 또는 공항명 입력';
                break;

            case 'pickup':
            case 'return':
                this.viewPageName = 'rent';
                this.headerTitle = '목적지 검색';
                this.placeholderText = '도시명 입력';
                break;

            case 'search':
                this.viewPageName = 'activity';
                this.headerTitle = '액티비티 검색';
                this.placeholderText = '여행지 또는 상품을 검색';
                break;

            case 'airtel-origin':
                this.viewPageName = 'airtel-flight';
                this.headerTitle = '출발지 검색';
                this.placeholderText = '도시명 또는 공항명 입력';
                break;

            case 'airtel-destination':
                this.viewPageName = 'airtel-flight';
                this.headerTitle = '목적지 검색';
                this.placeholderText = '도시명 또는 공항명 입력';
                break;

            case 'airtel-hotelCity':
                this.viewPageName = 'airtel-hotel';
                this.headerTitle = '목적지 검색';
                this.placeholderText = '도시명 또는 공항명 입력';
                break;
        }
    }

    /**
     * 초기화
     * @param $data id 값으로 전달된 json 데이터
     */
    modalInit() {
        // 주요 도시 목록 데이터 가져오기
        this.subscriptionList.push(
            this.apiCommonService.POST_MAJOR_DESTINATION(this.majorDestinationRq.rq)
                .subscribe(
                    (resp: any) => {
                        console.info('[주요 도시 목록 데이터 가져오기 > res]', resp.result);
                        if (resp.succeedYn) {
                            this.majorDestinationInfo = resp.result;

                            const recentData = this.storageS.getItem('local', 'recent');
                            if (_.has(recentData, ['cities', this.viewPageName])) {
                                recentData.cities[this.viewPageName].map(
                                    (item: any, key: any) => {
                                        if (_.has(item, 'cityCode')) {
                                            item.index = key;
                                            this.recentList.push(item);
                                        }
                                    }
                                );

                                if (this.recentList.length > 1)
                                    this.recentList = _.orderBy(this.recentList, ['index'], ['desc']);

                                console.info('recentList', this.recentList);
                            }
                        } else {
                            this.alertService.showApiAlert(resp.errorMessage);
                        }
                    },
                    (error: any) => {
                        this.alertService.showApiAlert(error.error.errorMessage);
                    }
                )
        );
    }

    /**
     * 실시간 검색 request Model Init
     */
    searchInitModelInit($keyword) {
        const temp = JSON.parse(JSON.stringify(this.destinationRq));
        temp.rq.condition.keyword = $keyword;
        return temp.rq;
    }

    /**
     * 실시간 검색 기능
     */
    searchInit() {
        this.subscriptionList.push(
            fromEvent<any>(this.destinationSearchInput.nativeElement, 'keyup')
                .pipe(
                    map(event => (event.target as HTMLInputElement).value),
                    debounceTime(400),
                    distinctUntilChanged(
                        (before: any, now: any) => {
                            return _.isEqual(before, now);
                        }
                    ),
                    filter(
                        (value: any): boolean => {
                            if (value === '') {
                                this.searchStateOff();
                                return false;
                            }

                            if (this.engRegex.test(value) && value.length < 3) {
                                this.searchStateOff();
                                return false;
                            } else if (this.korRegex.test(value) && value.length < 2) {
                                this.searchStateOff();
                                return false;
                            } else {
                                return true;
                            }
                        }
                    ),
                    tap(() => this.showLoading()),
                    switchMap(
                        (value: string): any => {
                            this.realSearchWord = value;
                            const rq = this.searchInitModelInit(value);
                            return this.apiCommonService.POST_DESTINATION(rq);
                        }
                    ),
                    finalize(() => this.hideLoading())
                )
                .subscribe(
                    (resp: any) => {
                        if (resp.succeedYn) {
                            this.searchCompleteInit(resp);
                            this.searchStateOn();
                            console.info('[검색된 결과 데이터]', this.destinationInfo);
                        } else {
                            this.alertService.showApiAlert(resp.errorMessage);
                        }
                        this.hideLoading();
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err);
                    }
                )
        );
    }

    /**
     * 실시간 검색 완료후 데이터 초기화
     * 타입별 데이터 가공
     * getFindKeyList :
     */
    searchCompleteInit($searchData) {
        const tempResult = $searchData.result;
        let resList;
        let findKeyList;

        findKeyList = [
            DestinationType.CITIES,
            DestinationType.REGIONS,
            DestinationType.POIS,
            DestinationType.HOTELS,
            DestinationType.AIRPORTS,
            DestinationType.VEHICLES,
            DestinationType.SERVICE_CITIES,
            DestinationType.SERVICEA_CTIVITIES
        ];
        resList = this.getFindKeyList(tempResult, findKeyList);
        this.destinationInfo = resList;
        this.destinationInfoValLeng = 0;  // 검색할 때마다 0 으로 초기화
        resList.map((item: any) => {
            this.destinationInfoValLeng = this.destinationInfoValLeng + item.val.length;
        });


    }

    /**
     * 1. 검색할 key 리스트 반복
     * 2. key 존재유무 확인
     * 3. key 와 매칭 되는 값 출력
     * 4. temp Object 생성
     * - type : 검색된 key 저장
     * - val : 검색된 value 저장
     * - searchWord : 검색어
     * 5. resList 저장
     * @param tempResult 검색할 데이터
     * @param keyList 검색할 key 리스트
     * @return 출력데이터
     */
    private getFindKeyList(tempResult: Object, keyList: Array<any>): Array<any> {
        // 검색할 리스트
        const findKeyList = keyList;
        // 출력 리스트
        const resList = [];
        this.realTimeSearchCount = 0;

        _.forEach(findKeyList, (val) => {
            const tgKey = val;
            const tgKeyBool = _.has(tempResult, tgKey);

            if (tgKeyBool) {
                this.realTimeSearchCount += val.length;

                resList.push(
                    {
                        type: tgKey,
                        searchWord: this.realSearchWord,
                        val: _.get(tempResult, tgKey).map(
                            (item: any): any => {
                                let newItem = {};
                                let nameLn = '';
                                let nameEn = '';

                                switch (tgKey) {
                                    case DestinationType.CITIES:
                                        nameLn += _.get(item, 'cityNameLn');
                                        nameEn += `${_.get(item, 'cityNameEn')}(${_.get(item, 'cityCodeIata')}) ${_.get(item, 'countryNameEn')}`;
                                        newItem = { ...item, ...{ nameLn: nameLn, nameEn: nameEn } };
                                        break;

                                    case DestinationType.VEHICLES:
                                    case DestinationType.SERVICE_CITIES:
                                        nameLn += _.get(item, 'cityNameLn');
                                        nameLn += _.isEmpty(_.get(item, 'countryNameLn')) ? '' : `, ${_.get(item, 'countryNameLn')}`;
                                        nameEn += _.get(item, 'cityNameEn');
                                        nameEn += _.isEmpty(_.get(item, 'countryNameEn')) ? '' : `, ${_.get(item, 'countryNameEn')}`;
                                        newItem = { ...item, ...{ nameLn: nameLn, nameEn: nameEn } };
                                        break;

                                    case DestinationType.REGIONS:
                                        nameLn += _.get(item, 'regionNameLn');
                                        nameLn += _.isEmpty(_.get(item, 'countryNameLn')) ? '' : `, ${_.get(item, 'countryNameLn')}`;
                                        nameEn += _.get(item, 'regionNameEn');
                                        nameEn += _.isEmpty(_.get(item, 'countryNameEn')) ? '' : `, ${_.get(item, 'countryNameEn')}`;
                                        newItem = { ...item, ...{ nameLn: nameLn, nameEn: nameEn } };
                                        break;

                                    case DestinationType.AIRPORTS:
                                        nameLn += _.get(item, 'airportNameLn');
                                        nameLn += _.isEmpty(_.get(item, 'countryNameLn')) ? '' : `, ${_.get(item, 'countryNameLn')}`;
                                        nameEn += _.get(item, 'airportNameEn');
                                        nameEn += _.isEmpty(_.get(item, 'countryNameEn')) ? '' : `, ${_.get(item, 'countryNameEn')}`;
                                        newItem = { ...item, ...{ nameLn: nameLn, nameEn: nameEn } };
                                        break;

                                    case DestinationType.POIS:
                                        nameLn += _.get(item, 'poiNameEn');
                                        nameLn += _.isEmpty(_.get(item, 'countryNameLn')) ? '' : `, ${_.get(item, 'countryNameLn')}`;
                                        nameEn += _.isEmpty(_.get(item, 'countryNameEn')) ? '' : `${_.get(item, 'countryNameEn')}`;
                                        newItem = { ...item, ...{ nameLn: nameLn, nameEn: nameEn } };
                                        break;

                                    case DestinationType.HOTELS:
                                        nameLn += _.get(item, 'hotelNameLn');
                                        nameEn += _.get(item, 'hotelNameEn');
                                        newItem = { ...item, ...{ nameLn: nameLn, nameEn: nameEn } };
                                        break;

                                    case DestinationType.SERVICEA_CTIVITIES:
                                        nameLn += _.get(item, 'activityNameLn');
                                        newItem = { ...item, ...{ nameLn: nameLn } };
                                        break;
                                }
                                return newItem;
                            }
                        )
                    }
                );
            }
        });

        return resList;
    }

    /**
     * getSearchWordHtml
     * 검색내용 html 출력
     *
     * @params destinationItemVal 선택된 아이템
     * @params searchWord 검색어
     *
     * @returns string;
     */
    public getSearchWordHtml(destinationItemVal: any, searchWord: string): string {
        /**
         * 1. "검색된 데이터" 에서 "검색어" 를 검색한다.
         * - 검색된 글자가 있는경우 : 글자 색표시.
         * - 검색된 글자가 없는경우 : 그대로 출력.
         */
        const searchResultVal = destinationItemVal.nameLn.indexOf(searchWord);
        return (searchResultVal > -1) ? this.getHtml(destinationItemVal.nameLn, searchWord) : destinationItemVal.nameLn;
    }

    /**
     * getHtml
     * 매칭되는 문자 있는지 확인
     *
     * @param searchResultBool 검색결과 boolean
     * @param nameVal 검색된데이터 string
     * @param searchWord 검색어 string
     *
     * @returns string
     */
    private getHtml(nameVal: string, searchWord: string): string {
        const splitList = _.split(nameVal, searchWord);
        let legionsHtml = '';
        _.forEach(splitList, (item, idx: number) => {
            // first
            if (idx === 0) {
                if (!_.isEmpty(item)) {
                    legionsHtml += item;
                }

                legionsHtml += `<span class="focus">${searchWord}</span>`;
            } else if (idx === splitList.length - 1) {
                if (!_.isEmpty(item)) {
                    legionsHtml += item;
                }
            } else {
                legionsHtml += item;
                legionsHtml += `<span class="focus">${searchWord}</span>`;
            }
        });

        return legionsHtml;
    }

    /**
    * setClass
    * 클래스 설정
    *
    * @param type type명
    */
    public setClass(type: string): string {
        return {
            regions: 'station',
            airports: 'airport',
            pois: 'landmark',
            hotels: 'hotel',
            vehicles: 'station',
            serviceCities: 'location',
            serviceActivities: 'activity'
        }[type];
    }

    showLoading() {
        this.realTimeLoadingBool = true;
        console.info('[showLoading]', this.realTimeLoadingBool, this);
    }

    hideLoading() {
        this.realTimeLoadingBool = false;
        console.info('[hideLoading]', this.realTimeLoadingBool, this);
    }

    /**
     * 검색어가 있을때
     */
    searchStateOn() {
        this.searchBool = true;
    }

    /**
     * 검색어가 모두 삭제될때
     *
     */
    searchStateOff() {
        this.searchBool = false;
    }

    /**
     * upsertOne
     * 스토어에 데이터 전송
     *
     * @param data 사용자 선택 데이터
     */
    private upsertOne(data): void {
        console.info('최종적으로 넘길 위치 분류 : ', this.storeId);

        switch (this.storeId) {
            case 'origin':
            case 'destination':
                this.store.dispatch(
                    upsertFlightModalDestination({ flightModalDestination: data })
                );
                break;

            case 'hotelCity':
                this.store.dispatch(
                    upsertHotelModalDestination({ hotelModalDestination: data })
                );
                break;

            case 'pickup':
            case 'return':
                this.store.dispatch(
                    upsertRentModalDestination({ rentModalDestination: data })
                );
                break;

            case 'search':
                this.store.dispatch(
                    upsertActivityModalDestination({ activityModalDestination: data })
                );
                break;

            case 'airtel-origin':
            case 'airtel-destination':
            case 'airtel-hotelCity':
                this.store.dispatch(
                    upsertAirtelModalDestination({ airtelModalDestination: data })
                );
                break;
        }
    }

    /**
     * makeUpdateModel
     * 각 메뉴에 맞는 검색 결과 데이터 생성
     *
     * @param data 선택한 데이터
     *
     * @returns any
     */
    private makeUpdateModel(data: any): any {
        const newModel: any = {
            id: this.storeId,
            codeName: {
                quick: 'major',
                cities: 'cities',
                cityAirport: 'citiesAirport',
                regions: 'regions',
                airports: 'airports',
                pois: 'pois',
                hotels: 'hotels',
                vehicles: 'vehicles',
                serviceCities: 'CITY',
                serviceActivities: 'DETAIL'
            }[data.type]
        };

        switch (this.storeId) {
            case 'search':
                newModel.type = {
                    serviceCities: 'CITY',
                    serviceActivities: 'DETAIL',
                    quick: 'CITY'
                }[data.type];

                newModel.name = data.name;
                newModel.val = data.val;
                break;

            default:
                newModel.name = data.name;
                newModel.val = data.val;
                break;
        }

        return { ...data, ...newModel };
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick(e) {
        console.info('모달 닫기');
        this.modalClose();
    }

    onSearchDelClick(e?) {
        console.info('[검색영역 x 버튼 클릭]', e);
        this.destinationSearchInput.nativeElement.value = '';

        this.searchStateOff();
    }

    /**
     * onResultClick
     * 사용자의 검색 결과 선택
     *
     * @param event dom event
     * @param type 선택한 결과 타입
     * @param item 선택한 데이터
     * @param subItem 선택한 데이터의 서브데이터
     */
    public onResultClick(event: any, type: string, item: any, subItem?: any): void {
        event && event.preventDefault();

        const recent = {
            type: type === 'recent' ? item.type : type,
            countryCode: item.countryCode,
            countryNameLn: item.countryNameLn,
            countryNameEn: item.countryNameEn,
            cityNameLn: {
                quick: item.destinationNameLn,
                cities: item.cityNameLn,
                cityAirport: item.cityNameLn,
                regions: item.regionNameLn,
                airports: item.airportNameLn,
                pois: item.cityNameLn,
                hotels: item.cityNameLn,
                vehicles: item.cityNameLn,
                recent: item.cityNameLn,
                serviceCities: item.cityNameLn,
                serviceActivities: item.cityNameLn
            }[type],
            cityNameEn: {
                quick: item.destinationNameEn,
                cities: item.cityNamEn,
                regions: item.regionNameEn,
                airports: item.airportNameEn,
                pois: item.cityNameEn,
                hotels: item.cityNameEn,
                vehicles: item.cityNameEn,
                recent: item.cityNameEn,
                serviceCities: item.cityNameEn,
                serviceActivities: item.cityNameEn
            }[type],
            cityCode: {
                quick: item.destinationCode,
                cities: item.cityCodeIata,
                regions: item.cityCodeIata,
                airports: item.regionCode,
                pois: item.cityCodeIata,
                hotels: item.cityCodeIata,
                vehicles: item.cityCodeIata,
                recent: item.cityCode,
                serviceCities: item.cityCodeIata,
                serviceActivities: item.cityCodeIata
            }[type],
            name: {
                quick: item.destinationNameLn,
                cities: item.cityNameLn,
                cityAirport: item.cityNameLn,
                regions: item.regionNameLn,
                airports: item.airportNameLn,
                pois: item.poiNameEn,
                hotels: item.hotelNameLn,
                vehicles: item.cityNameLn,
                recent: item.name,
                serviceCities: item.cityNameLn,
                serviceActivities: item.activityNameLn
            }[type],
            val: {
                quick: item.destinationCode,
                cities: item.cityCodeIata,
                cityAirport: item.cityCodeIata,
                regions: item.regionCode,
                airports: item.regionCode,
                pois: item.poiSeq,
                hotels: item.hotelCode,
                vehicles: item.cityCodeIata,
                recent: item.val,
                serviceCities: item.cityCode,
                serviceActivities: item.activityMasterSeq
            }[type]
        };

        // 업데이트 모델 만들기
        this.updateModel = this.makeUpdateModel(recent);

        if (subItem) {
            this.updateModel.airports = [subItem];
        }

        this.storageS.makeRecentData('local', recent, 'cities', this.viewPageName);

        this.upsertOne(this.updateModel);
        this.modalClose();
    }
}
