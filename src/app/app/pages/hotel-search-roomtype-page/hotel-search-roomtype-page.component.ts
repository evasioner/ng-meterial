import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { upsertHotelSearchRoomtype } from '../../store/hotel-search-roomtype-page/hotel-search-roomtype/hotel-search-roomtype.actions';
import { clearHotelModalCalendars } from 'src/app/store/hotel-common/hotel-modal-calendar/hotel-modal-calendar.actions';
import { clearHotelModalDestinations } from 'src/app/store/hotel-common/hotel-modal-destination/hotel-modal-destination.actions';
import { clearHotelModalTravelerOptions } from 'src/app/store/hotel-common/hotel-modal-traveler-option/hotel-modal-traveler-option.actions';
import { clearHotelModalDetailOptions } from 'src/app/store/hotel-common/hotel-modal-detail-option/hotel-modal-detail-option.actions';
import { upsertHotelSessionStorage } from 'src/app/store/hotel-common/hotel-session-storage/hotel-session-storage.actions';

//store
import * as commonUserInfoSelectors from 'src/app/store/common/common-user-info/common-user-info.selectors';
import * as hotelModalTravelerOptionSelectors from '../../store/hotel-common/hotel-modal-traveler-option/hotel-modal-traveler-option.selectors';
import * as hotelModalCalendarSelectors from '../../store/hotel-common/hotel-modal-calendar/hotel-modal-calendar.selectors';

import * as moment from 'moment';
import { extendMoment } from 'moment-range';
import * as _ from 'lodash';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CountdownTimerService } from 'ngx-timer';

import { HotelComService } from 'src/app/common-source/services/hotel-com-service/hotel-com-service.service';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { ApiHotelService } from 'src/app/api/hotel/api-hotel.service';
import { HotelSearchRoomtypeService } from './services/hotel-search-roomtype/hotel-search-roomtype.service';
import { WebShareService } from '@/app/common-source/services/web-share/web-share.service';
import { StorageService } from '@/app/common-source/services/storage/storage.service';
import { JwtService } from '@/app/common-source/services/jwt/jwt.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';
import { StoreCategoryTypes } from 'src/app/common-source/enums/store-category-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { HotelModalReviewComponent } from './modal-components/hotel-modal-review/hotel-modal-review.component';
import { HotelModalLocationMapComponent } from './modal-components/hotel-modal-location-map/hotel-modal-location-map.component';
import { HotelModalRoomtypeDetailComponent } from './modal-components/hotel-modal-roomtype-detail/hotel-modal-roomtype-detail.component';
import { CommonModalCalendarComponent } from 'src/app/common-source/modal-components/common-modal-calendar/common-modal-calendar.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';

@Component({
    selector: 'app-hotel-search-roomtype-page',
    templateUrl: './hotel-search-roomtype-page.component.html',
    styleUrls: ['./hotel-search-roomtype-page.component.scss']
})
export class HotelSearchRoomtypePageComponent extends BasePageComponent implements OnInit, OnDestroy {
    ctx: any = this;
    headerType: any;
    headerConfig: any;
    mySearchInfo: any = {
        traveler: {
            id: '',
            roomList: [
                {
                    adult: 2,
                    children: []
                }
            ]
        },
        checkDate: {
            id: '',
            name: '',
            in: '',
            out: ''
        },
        checkDateInOut: '',
        travelerInfo: ''
    };

    hotelInfo: any;
    hotelCode: any;
    roomList: any;
    photoList: any = []; // 호텔 사진 list
    recommendHotels: any; // 주변 호텔 추천 list
    hotelRoomListRs: any; // room/list rs
    roomListCon: any;
    information: any; //호텔 정보
    generalInfo: any; // 일반 사항
    userInfo: any;


    hotelSearchTrd: string;
    hotelInfoRq: any;
    hotelInfoTrd: string;
    hotelRoomtypeRq: any;
    attractions: any;
    hotelCalendar: any;
    hotelTravelerOpt: any;

    hotelRoomListTrd: string;
    roomTypes: any;
    selRoom: any;

    lowestRoomAmount: number = 0; // 객실 최저가
    selRoomAmount: number = 0; //선택된 객실 가격
    plusRoomAmount: number = 0; //선택된 객실 가격 - 최저가
    showRoomDetail: boolean = false;

    /**
     * 더보기 index
     */
    moreRoomList: number = 3;  // 객실 정보 더보기 index
    moreInfo: number = 2; //호텔 정보 더보기 index
    moreGeneral: number = 2; // 일반 사항 더보기 index
    moreFacility: number = 6; // 편의시설 더보기 index
    moreRecommend: number = 3; // 주변 추천 호텔 더보기 index

    loadingBool: boolean = false;
    roomLoadingBool: boolean = false;
    rxAlive: boolean = true;

    hotelListRq$: Observable<any>;
    modalHotelCalendar$: Observable<any>;
    modalHotelTravelerOption$: Observable<any>; //인원 선택

    bsModalRef: BsModalRef;
    bsModalPhotoListRef: any;
    bsModalReviewRef: any;
    bsModalLocationMapRef: any;
    bsModalRoomtypeDetailRef: any;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        public jwtService: JwtService,
        private store: Store<any>,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private apiHotelService: ApiHotelService,
        private _service: HotelSearchRoomtypeService,
        private comHotelS: HotelComService,
        private bsModalService: BsModalService,
        private countdownTimerService: CountdownTimerService,
        private webShareS: WebShareService,
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
        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.timerInit();
        this.storeHotelCommonInit(); // store > hotel-common 초기화

        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.info('[1. route 통해 데이터 전달 받기]', data);
                        this.hotelRoomtypeRq = _.cloneDeep(data.resolveData);
                        this.hotelSearchTrd = _.cloneDeep(data.resolveData.trd);
                        console.info('[1-1. hotelRoomtypeRq]', this.hotelRoomtypeRq);
                        console.info('[1-2. hotelSearchTr]', this.hotelSearchTrd);

                        if (this.isBrowser) {
                            this.pageInit(this.hotelRoomtypeRq);
                        }
                    }
                )
        );

        this.observableInit();
        this.subscribeInit();
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
        this.rxAlive = false;
        this.closeAllModals();
        console.info('[HotelSearchRoomtypePageComponent ngOnDestroy > rxAlive]', this.rxAlive);
    }

    /**
     * 모든 bsModal 창 닫기
     */
    private closeAllModals() {
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
                            this.comHotelS.timerAlert(alertTxt);
                        }
                    }
                )
        );
    }
    /**
     * 옵저버블 초기화
     */
    observableInit() {
        this.modalHotelTravelerOption$ = this.store
            .pipe(select(hotelModalTravelerOptionSelectors.getSelectId(['hotelTravelerOption'])));

        this.modalHotelCalendar$ = this.store
            .pipe(select(hotelModalCalendarSelectors.getSelectId(['hotelCalendar'])));
    }

    /**
     * 서브스크라이브 초기화
     */
    subscribeInit() {
        console.info('[modal_detial_filter >> subscribeInit]');

        /**
         * 여행 날짜
         */
        this.subscriptionList.push(
            this.modalHotelCalendar$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalHotelCalendar$ > subscribe]', ev);
                        if (ev) {
                            this.hotelCalendar = _.cloneDeep(ev.selData);
                            this.mySearchInfo.checkDate.in = moment(ev.result.selectList[0].toString()).format('YYYY-MM-DD');
                            this.mySearchInfo.checkDate.out = moment(ev.result.selectList[1].toString()).format('YYYY-MM-DD');
                            this.onResearchRoomtype();
                        }
                    }
                )
        );

        /**
         * 객실 수, 인원 수
         */
        this.subscriptionList.push(
            this.modalHotelTravelerOption$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            console.info('[modalHotelTravelerOption$ > subscribe]', ev);
                            this.hotelTravelerOpt = _.cloneDeep(ev);
                            this.roomList = this.comHotelS.makeRoomCondition(this.hotelTravelerOpt.roomList);
                            this.mySearchInfo.traveler = _.cloneDeep(ev);
                            this.mySearchInfo.travelerInfo = this.comHotelS.getTravelerInfo(this.hotelTravelerOpt.roomList, true);
                            this.onResearchRoomtype();
                        }
                    }
                )
        );
    }
    /**
     * 페이지 초기화
     * 1. 호텔 정보 RQ 초기화
     * 2. 헤더 초기화
     * 3. api 호출 (호텔 정보 / 객실 리스트)
     * - rq / rs store 저장
     * @param $resolveData
     */
    pageInit($resolveData) {
        this.hotelCode = _.cloneDeep($resolveData.hCode);

        // ---------[호텔 정보 RQ 초기화]
        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                hotelCode: $resolveData.hCode
            }
        };

        if (_.has($resolveData, 'trd')) {
            rq['transactionSetId'] = $resolveData.trd;
        }

        this.hotelInfoRq = _.cloneDeep(rq);

        // ---------[헤더 초기화]
        const Moment = extendMoment(moment);
        const checkInDate = moment($resolveData.chkIn).format('MM.DD');
        const checkOutDate = moment($resolveData.chkOut).format('MM.DD');
        const range = Moment.range($resolveData.chkIn, $resolveData.chkOut);
        const dayDiff = range.diff('days'); //여행일수


        this.roomList = this.comHotelS.makeRoomCondition($resolveData.roomList);
        const travelerInfo = this.comHotelS.getTravelerInfo($resolveData.roomList, true); //객실 수, 인원

        const headerTitle = `02. 호텔 룸타입 선택`;
        const headerDetail = `${checkInDate}-${checkOutDate}(${dayDiff}박), ${travelerInfo}`;

        this.headerInit('room', headerTitle, headerDetail);
        // ---------[ end 헤더 초기화]

        // ---------[내 검색 정보]
        this.mySearchInfo.traveler.roomList = _.cloneDeep($resolveData.roomList);
        this.mySearchInfo.travelerInfo = `${travelerInfo}`;
        this.mySearchInfo.checkDate.in = $resolveData.chkIn;
        this.mySearchInfo.checkDate.out = $resolveData.chkOut;
        this.mySearchInfo.checkDateInOut = `${checkInDate}-${checkOutDate}, ${dayDiff}박`;
        // ---------[ end 내 검색 정보]

        // ---------[api 호출 | 호텔 정보]
        console.info('호텔 정보 Rq', rq);
        this.subscriptionList.push(
            this.apiHotelService.POST_HOTEL_INFORMATION(this.hotelInfoRq)
                .subscribe(
                    (res: any) => {
                        console.info('[호텔 정보 > result]', res);
                        if (res.succeedYn) {
                            this.hotelInfoTrd = _.cloneDeep(res['transactionSetId']);
                            this.hotelInfo = _.cloneDeep(res['result'].hotel);

                            this.storageS.makeRecentData(
                                'local',
                                {
                                    rq: this.hotelRoomtypeRq,
                                    dateRange: `${dayDiff}박, ${moment($resolveData.chkIn).format('MM.DD(ddd)')}-${moment($resolveData.chkOut).format('MM.DD(ddd)')}`,
                                    roomData: this.roomList,
                                    hotelName: this.hotelInfo.hotelNameLn
                                },
                                'hotel'
                            );

                            //호텔 정보 데이터 초기화
                            this.hotelInfoInit(this.hotelInfo);

                            //store 저장
                            this.upsertOne({
                                id: 'hotel-information-rs',
                                res: this.hotelInfo
                            });

                            //room list api 호출
                            this.getRoomlList($resolveData);

                            this.loadingBool = true;
                        } else {
                            this.loadingBool = false;
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err) => {
                        this.alertService.showApiAlert(err);
                    }
                )
        );
        // ---------[End api 호출 | 호텔 정보]

        // ---------[hotel-list-rq-info 스토어에 저장]
        $resolveData.hotelInfoRq = rq;
        $resolveData.roomtypRq = this.roomListCon;

        this.upsertOne({
            id: 'hotel-roomtype-rq-info',
            res: $resolveData
        });

    }
    /**
     * 호텔 정보 데이터 초기화
     * 사진/인근명소/ 호텔정보 / 일반사항
     * @param $hotelInfo
     */
    hotelInfoInit($hotelInfo) {
        //사진 (URL _z -> _y 변경하여 존재하는 img photoList 에 담기)
        if ($hotelInfo.photos.length > 0)
            this.changeUrlPhotoList($hotelInfo.photos);

        // 인근명소 거리순으로 정렬
        this.attractions = _.sortBy($hotelInfo.poi.attractions, 'distance');
        //호텔정보_각 항목에 내용 없으면 필터링 됨
        const info = [];
        info.push({
            title: 'address',
            txt: ($hotelInfo.addressLn) ? $hotelInfo.addressLn : $hotelInfo.addressEn
        });
        info.push({
            title: 'cityName',
            txt: $hotelInfo.cityName
        });
        info.push({
            title: 'contact',
            txt: $hotelInfo.phoneNo + $hotelInfo.faxNo
        });
        info.push({
            title: 'homepageUrl',
            txt: $hotelInfo.homepageUrl
        });

        this.information = _.filter(info, (obj) => {
            return !_.isEmpty(obj.txt);
        });

        //일반사항_각 항목에 내용 없으면 필터링 됨
        const general = [];
        if ($hotelInfo.hotelIntro) {
            general.push({
                title: 'hotelIntro',
                txt: $hotelInfo.hotelIntro
            });
        }

        if ($hotelInfo.roomFacility) {
            general.push({
                title: 'roomFacility',
                txt: $hotelInfo.roomFacility
            });
        }
        if ($hotelInfo.hotelFacility) {
            general.push({
                title: 'hotelFacility',
                txt: $hotelInfo.hotelFacility
            });
        }
        if ($hotelInfo.hotelCaution) {
            general.push({
                title: 'hotelCaution',
                txt: $hotelInfo.hotelCaution
            });
        }

        this.generalInfo = _.filter(general, (obj) => {
            return !_.isEmpty(obj.txt);
        });

        //주변 추천 호텔 리스트
        if (_.has($hotelInfo, 'recommends')) {
            if ($hotelInfo.recommends.length > 0)
                this.recommendHotels = this.comHotelS.changeDefaultPhotoUrl(this.hotelInfo.recommends);
        }
    }

    /**
     * 호텔 룸 리스트 api 호출
     * @param $resolveData
     */
    getRoomlList($resolveData) {
        this.roomLoadingBool = false;
        const resolveData = JSON.parse(JSON.stringify($resolveData));
        console.info('hotelSearchTrd', this.hotelSearchTrd);
        console.info('hotelInfoTrd', this.hotelInfoTrd);
        console.info('resolveData', $resolveData);
        // ---------[호텔 룸 리스트 Rq]
        const hotelInfoTrd = this.hotelInfoTrd;
        const roomList = this.roomList;
        this.roomListCon = this._service.makeHotelRoomListRq({
            resolveData, hotelInfoTrd, roomList
        });
        // ---------[호텔 룸 리스트  Rq]
        console.info('[호텔 룸 리스트  Rq]', this.roomListCon);
        // ---------[api 호출 | 호텔 룸 리스트]
        this.subscriptionList.push(
            this.apiHotelService.POST_HOTEL_ROOM_LIST(this.roomListCon)
                .subscribe(
                    (res: any) => {
                        console.info('[호텔 룸 리스트 > result]', res);
                        if (res) {
                            if (res.succeedYn) {
                                this.hotelRoomListRs = _.cloneDeep(res);
                                this.hotelRoomListTrd = _.cloneDeep(res['transactionSetId']);
                                this.roomTypes = this.hotelRoomListRs['result'].roomTypes;
                                if (this.roomTypes.length > 0)
                                    this.lowestRoomAmount = this.roomTypes[0].amountSum;

                                //store 저장
                                this.upsertOne({
                                    id: 'hotel-room-list-rs',
                                    res: this.hotelRoomListRs
                                });

                                this.roomLoadingBool = true;
                            } else {
                                this.roomLoadingBool = false;
                            }
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err) => {
                        // 하림대리에게 물어보기
                        // this.alertService.showApiAlert(err);
                        console.info('[err]', err.error);
                        if (this.rxAlive) {
                            const error = err.error;
                            if (error.errorCode === 'error.hotel.roomList')
                                this.errorMsgAlert(error.errorMessage);
                        }
                    }
                )
        );
        // ---------[End api 호출 | 호텔 룸 리스트]
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
                changeBtnFun: null
            },
            detail: $headerTime,
            backList: ['hotel-main', 'hotel-search-result'],
            ctx: this.ctx
        };
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertHotelSearchRoomtype({
            hotelSearchRoomtype: _.cloneDeep($obj)
        }));
    }


    upsertOneSession($obj) {
        this.store.dispatch(upsertHotelSessionStorage({
            hotelSessionStorage: _.cloneDeep($obj)
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

    /**
     * 여행 후기 modal open
     *  @param e 돔 이벤트
     */
    onHotelReview(e: any) {
        e.preventDefault();

        console.log('여행 후기 modal open ...');
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalReviewRef = this.bsModalService.show(HotelModalReviewComponent, { ...configInfo });
    }

    /**
     * 객실정보 더보기
     * @param e 돔 이벤트
     */
    showRoomList(e: any) {
        e.preventDefault();
        this.moreRoomList = this.moreRoomList + 2;
    }

    /**
     * 호텔정보 더보기
     * @param e 돔 이벤트
     */
    showHotelInfoList(e: any) {
        e.preventDefault();
        this.moreInfo = this.moreInfo + 1;
    }

    /**
     * 일반사항 더보기
     * @param e 돔 이벤트
     */
    showGeneralInfoList(e: any) {
        e.preventDefault();
        this.moreGeneral = this.generalInfo.length;
    }

    /**
     * 편의시설 더보기
     * @param e 돔 이벤트
     */
    showFacilityList(e: any) {
        e.preventDefault();
        this.moreFacility = this.moreFacility + 2;
    }

    /**
     * 주변 추천 호텔 더보기
     * @param e 돔 이벤트
     */
    showHotelList(e: any) {
        e.preventDefault();
        this.moreRecommend = this.moreRecommend + 1;
    }
    /**
     * 지도 보기 modal open
     * @param e 돔 이벤트
     */
    onMapView(e: any) {
        e.preventDefault();
        console.log('지도 보기 modal open ...');
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalLocationMapRef = this.bsModalService.show(HotelModalLocationMapComponent, { ...configInfo });
    }

    // 객실 수, 인원 수 선택
    onHotelTravelerOption() {
        console.info('[호텔 룸타입 선택 >> 객실 수, 인원 수 선택]');
        this.comHotelS.openHotelTravelerOption({ isRoomtype: true });
    }

    /**
     * 여행날짜 클릭
     */
    onDateClick() {
        console.info('[여행날짜]');
        this.openCalendar();
    }

    /**
      * 달력 팝업
      */
    openCalendar() {
        console.info('[달력 팝업]');

        const itemCategoryCode = 'IC02';
        const storeId = 'hotelCalendar';

        // 모달 전달 데이터
        const initialState = {
            storeCategoryType: StoreCategoryTypes.HOTEL,
            storeId: storeId,

            step: 0,
            totStep: 2,
            tabTxtList: ['체크인', '체크아웃'],
            selectList: [],

            // step: 1,
            // totStep: 2,
            // tabTxtList: ['대여일', '반납일', '마지막'],
            // selectList: ['2020-04-08'],

            // step: 2,
            // totStep: 2,
            // tabTxtList: ['대여일', '반납일', '마지막'],
            // selectList: ['2020-04-06', '2020-04-09'],

            // step: 3,
            // totStep: 3,
            // tabTxtList: ['대여일', '반납일', '마지막'],
            // selectList: ['2020-04-08', '2020-04-12', '2020-04-15'],

            // step: 4,
            // totStep: 4,
            // tabTxtList: ['대여일', '반납일', '마지막'],
            // selectList: ['2020-04-10', '2020-04-12', '2020-04-14', '2020-04-16'],

            rq: {
                currency: 'KRW',
                language: 'KO',
                stationTypeCode: environment.STATION_CODE,
                condition: {
                    itemCategoryCode: itemCategoryCode
                }
            }
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        console.info('[initialState]', initialState);


        // this.subscriptionList.push(
        //     this.modalHotelCalendar$
        //         .pipe(take(1))
        //         .subscribe(
        //             (ev: any) => {
        //                 console.info('[modalCalendar$ > subscribe]', ev);
        //                 if (ev) {
        //                     initialState.step = ev.result.step;
        //                     initialState.totStep = ev.result.totStep;
        //                     initialState.tabTxtList = ev.result.tabTxtList;
        //                     initialState.selectList = ev.result.selectList;
        //                 } else {
        //                     if (this.mySearchInfo.checkDate.in && this.mySearchInfo.checkDate.out) {
        //                         initialState.step = 2;
        //                         initialState.totStep = 2;
        //                         initialState.selectList[0] = this.mySearchInfo.checkDate.in;
        //                         initialState.selectList[1] = this.mySearchInfo.checkDate.out;
        //                     }
        //                 }
        //             }
        //         )
        // );

        this.bsModalRef = this.bsModalService.show(CommonModalCalendarComponent, { initialState, ...configInfo });

    }

    /**
     * 사진 URL _z -> _y 변경
     * 변경된 URL 로 존재하는 이미지만 화면상에 노출
     * @param $photos
     */
    changeUrlPhotoList($photos): void {
        const photoList = [];
        const photos = JSON.parse(JSON.stringify($photos));
        photos.forEach((item) => {
            if (item.photoUrl) { // photoUrl 값이 있을 경우
                const resultUrl = this.comHotelS.replacePhotoUrl(item.photoUrl);
                item.photoUrl = resultUrl;
                photoList.push(item);
            }
        });

        if (photoList.length > 0)
            this.photoList = photoList;
    }

    /**
     * 내 검색 정보 변경 시, 재검색
     */
    onResearchRoomtype() {
        // const rqInfo = {
        //   hotelCity: this.hotelRoomtypeRq.hotelCity,
        //   checkDate: this.mySearchInfo.checkDate,
        //   hotelTravelerOption: this.mySearchInfo.traveler,
        //   hCode: this.hotelCode,
        //   trd: this.hotelInfoTrd
        // };

        const rqInfo = {
            city: this.hotelRoomtypeRq.city,
            cityGubun: this.hotelRoomtypeRq.cityGubun,
            cityName: this.hotelRoomtypeRq.cityName,
            hCode: this.hotelCode,
            chkIn: this.mySearchInfo.checkDate.in,
            chkOut: this.mySearchInfo.checkDate.out,
            roomList: this.mySearchInfo.traveler.roomList,
            trd: this.hotelInfoTrd
        };


        console.info('[데이터 rqInfo]', rqInfo);
        this.comHotelS.goToHotelSearchRoomtype(rqInfo);
    }

    /**
     * 객실 정보 모달 오픈
     * @param roomType$
     */
    openRoomInfo(roomType$) {
        console.log('객실 정보 modal open ...');

        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            transactionSetId: this.hotelRoomListTrd,
            condition: {
                hotelCode: this.hotelCode,
                roomTypeCode: roomType$.roomTypeCode,
                roomTypeName: roomType$.roomTypeName,
            }
        };

        const initialState = {
            roomInfoRq: rq
        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalRoomtypeDetailRef = this.bsModalService.show(HotelModalRoomtypeDetailComponent, { initialState, ...configInfo });
    }

    /**
     * 객실선택 > 선택 버튼 이벤트
     *
     */
    onSelRoom($roomItem) {
        console.info('[onSelRoom]', $roomItem);
        this.selRoom = $roomItem;
        this.selRoomAmount = $roomItem.amountSum;
        this.onSelRoomDetail();
    }

    /**
     * 하단에 객실 선택 버튼 이벤트
     */
    onSelRoomDetail() {
        if (this.selRoomAmount > 0) {
            this.onDetail();
            this.plusRoomAmount = this.selRoomAmount - this.lowestRoomAmount;
        } else {
            alert('객실을 선택해주세요.');
            const doc = document.documentElement;
            const targetOffset = document.getElementById('roomSelect').getBoundingClientRect();
            const windowScrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            const top = targetOffset.top + windowScrollTop - 54;
            window.scrollTo(0, top);
        }
    }

    onRoomTestBtn($vendorCompCode) {
        let vendor: string = '';
        if ($vendorCompCode === 910003)
            vendor = '호텔패스';
        else if ($vendorCompCode === 910004)
            vendor = 'RTS';

        alert(vendor + ' 예약 테스트x');
    }

    onDetail() {
        this.showRoomDetail = !this.showRoomDetail;
    }

    onHotelDtl($hotelItem) {
        console.log('move hotel detail...', $hotelItem);

        const rqInfo = {
            city: this.hotelRoomtypeRq.city,
            cityGubun: this.hotelRoomtypeRq.cityGubun,
            cityName: this.hotelRoomtypeRq.cityName,
            chkIn: this.hotelRoomtypeRq.chkIn,
            chkOut: this.hotelRoomtypeRq.chkOut,
            roomList: this.hotelRoomtypeRq.roomList,
            hCode: $hotelItem.hotelCode,
            trd: this.hotelInfoTrd
        };

        this.comHotelS.goToHotelSearchRoomtype(rqInfo);
    }

    goBookingInformation() {
        const rq = {
            hotelCode: this.hotelCode,
            roomInfo: {
                roomType: this.selRoom,
                lowestRoomAmount: this.lowestRoomAmount
            },
            checkInDate: this.roomListCon.condition.checkInDate,
            checkOutDate: this.roomListCon.condition.checkOutDate
        };

        const cityGubun = this.comHotelS.getDestinationCodeName(this.hotelRoomtypeRq.cityGubun);
        if (cityGubun === 'regionCode') {
            rq['regionCode'] = this.hotelRoomtypeRq.city;
        }

        const roomConRq = {
            rooms: this.roomListCon.condition.rooms,
        };

        if (this.hotelInfoTrd) {
            roomConRq['transactionSetId'] = this.hotelInfoTrd;
        }

        const rqInfo = {
            roomConRq: roomConRq,
            rq: rq
        };

        this.upsertOneSession({
            id: 'hotel-booking-information-rq',
            result: rqInfo
        });


        console.info('go to hotel-booking-information', rqInfo);
        const path = '/hotel-booking-information/';
        // 페이지 이동후 생명주기 재실행
        this.router.navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate([path]));
    }

    /**
     * 호텔 api 에러 코드 alert
     * @param $str 에러 메세지
     */
    errorMsgAlert($str: string) {
        const initialState = {
            titleTxt: $str,
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
                    this.location.back();
                }
            }
        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false,
            keyboard: false
        };
        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
    }

    /**
    * onShareClick
    * 공유하기
    *
    * @param event dom 이벤트
    */
    public onShareClick(event: any): void {
        event && event.preventDefault();

        this.webShareS.webShare(
            {
                title: this.hotelInfo.hotelNameLn,
                text: '',
                url: this.router.url
            }
        );
    }


    //------------------------------[장바구니]
    /**
     * 장바구니 추가
     *  1. 로그인 여부 확인
     *  2. 로그인 시, user 정보 init
     * @param event 돔 이벤트
     */
    addCart(event: any) {
        event && event.preventDefault();

        const curUrl = this.route.snapshot['_routerState'].url;
        this.jwtService.loginGuardInit(curUrl).then(
            (e) => {
                console.info('[jwtService.loginGuardInit > ok]', e);
                if (e) this.commonUserInfoInit();
            },
            (err) => {
                console.info('[jwtService.loginGuardInit > err]', err);
            });
    }

    /**
     * user 정보 가져오기
     *  1. user 정보 세팅
     *  2. basket rq 세팅
     *  3. api 실행
     */
    commonUserInfoInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(commonUserInfoSelectors.getSelectId('commonUserInfo')), // 스토어 ID
                    takeWhile(() => this.rxAlive)
                )
                .subscribe(
                    (ev: any) => {
                        console.info('commonUserInfo > ', ev);
                        if (ev) { // 변경 되이터

                            // userInfo 세팅
                            this.userInfo = _.cloneDeep(ev['userInfo'].user);

                            // basket rq 세팅
                            const rq = {
                                stationTypeCode: environment.STATION_CODE,
                                currency: 'KRW',
                                language: 'KO',
                                transactionSetId: '',
                                condition: {
                                    userNo: this.userInfo.userNo, //필수
                                    alertYn: false, //필수 1.장바구니에 담을때 alertYn은 ‘false’ 2.알림등록할때도 장바구니를 쓰는데 그때는 ‘true’
                                    // regionCode: this.hotelRoomListRq.condition.hotelCode,//필수
                                    hotelCode: this.roomListCon.condition.hotelCode,
                                    checkInDate: this.roomListCon.condition.checkInDate,//필수
                                    checkOutDate: this.roomListCon.condition.checkOutDate,//필수
                                    rooms: this.roomListCon.condition.rooms,//필수
                                    roomTypeName: this.selRoom.roomTypeName, //필수
                                    searchAmount: this.selRoom.amountSum //필수
                                }
                            };

                            if (_.has(this.hotelRoomListRs, 'transactionSetId')) // room/list rs > transactionSetId 필수값 아님
                                rq['transactionSetId'] = this.hotelRoomListRs.transactionSetId;

                            // if (_.has(this.selRoomType, 'roomTypeCodedData')) // room/list rs > roomTypes > roomTypeCodedData 필수값 아님
                            //     rq.condition['receiveDeviceToken'] = this.selRoomType.roomTypeCodedData;

                            if (_.has(this.userInfo, 'emailAddress')) //로그인 개인정보 > 이메일 필수값 아님
                                rq.condition['receiveEmailAddress'] = this.userInfo.emailAddress;


                            console.info('addCart > rq', rq);

                            //api 실행
                            this.putHotelBasketApi(rq);
                        }
                    }
                )
        );
    }

    /**
    * put hotel/basket api
    * @param $rq
    */
    putHotelBasketApi($rq) {
        this.subscriptionList.push(
            this.apiHotelService.PUT_HOTEL_BASKET($rq)
                .subscribe(
                    (res: any) => {
                        console.info('[API 호출 | 호텔 장바구니 추가 > ]', res);

                        if (res.succeedYn) {
                            this.cartMsgAlert('장바구니에 저장되었습니다.', '장바구니로 이동하시겠습니까?', false);
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err) => {
                        // 하림대리에게 물어보기
                        // this.alertService.showApiAlert(err);
                        console.info('[API 호출 | 호텔 장바구니 추가 > err]', err);
                        this.cartMsgAlert('장바구니 저장 에러', '장바구니로 이동하시겠습니까?', true);
                    }
                )
        );
    }

    /**
     * 장바구니 alert 이벤트
     * @param $titleTxt   modal alert contents > title
     * @param $alertHtml modal alert contents > alert-text
     * @param $errorBool  api error > true / success > false
     */

    cartMsgAlert($titleTxt: any, $alertHtml: any, $errorBool: boolean) {
        const initialState = {
            titleTxt: $titleTxt,
            alertHtml: $alertHtml,
            closeObj: {
                fun: () => { }
            }
        };

        if ($errorBool) { // 장바구니 추가 에러일 경우
            initialState['okObj'] = {
                fun: () => { }
            };
        } else {
            initialState['okObj'] = {
                fun: () => {
                    // this.goToCartList();
                }
            };

            initialState['cancelObj'] = {
                fun: () => { }
            };
        }
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
    }

    // 장바구니 리스트
    goToCartList() {
        console.info('goToCartList');
        const path = '/my-basket-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
        // this.onCloseClick();
    }

    //------------------------------[end 장바구니]


    public getPhotoBackgroundStyle() {
        return {
            'background': 'url(/assets/images/icons/ico-nodata-image.png) 50% 50% #f5f5f5 no-repeat'
        };
    }

}
