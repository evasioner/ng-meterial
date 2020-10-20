import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { takeWhile, take } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

//store
import { upsertHotelSearchRoomtype, clearHotelSearchRoomtypes } from 'src/app/store/hotel-search-roomtype-page/hotel-search-roomtype/hotel-search-roomtype.actions';
import { upsertHotelSessionStorage, clearHotelSessionStorages } from 'src/app/store/hotel-common/hotel-session-storage/hotel-session-storage.actions';
import { clearHotelModalDestinations } from 'src/app/store/hotel-common/hotel-modal-destination/hotel-modal-destination.actions';
import { clearHotelModalTravelerOptions } from 'src/app/store/hotel-common/hotel-modal-traveler-option/hotel-modal-traveler-option.actions';
import { clearHotelModalCalendars } from 'src/app/store/hotel-common/hotel-modal-calendar/hotel-modal-calendar.actions';

import * as commonUserInfoSelectors from 'src/app/store/common/common-user-info/common-user-info.selectors';
import * as hotelModalTravelerOptionSelectors from '../../store/hotel-common/hotel-modal-traveler-option/hotel-modal-traveler-option.selectors';
import * as hotelModalCalendarSelectors from '../../store/hotel-common/hotel-modal-calendar/hotel-modal-calendar.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LoadingBarService } from '@ngx-loading-bar/core';

import { ControlPosition } from '@agm/core';

import * as _ from 'lodash';
import * as moment from 'moment';

import { StorageService } from '@app/common-source/services/storage/storage.service';
import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { HotelComService } from 'src/app/common-source/services/hotel-com-service/hotel-com-service.service';
import { ApiHotelService } from 'src/app/api/hotel/api-hotel.service';
import { JwtService } from '@/app/common-source/services/jwt/jwt.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

//enum
import { CalendarState } from '../../common-source/enums/calendar-state.enum';
import { PageCodes } from '../../common-source/enums/page-codes.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { HotelModalDetailImageComponent } from './modal-components/hotel-modal-detail-image/hotel-modal-detail-image.component';
import { HotelModalRoomInformationComponent } from './modal-components/hotel-modal-room-information/hotel-modal-room-information.component';
import { CommonModalAlertComponent } from 'src/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';

declare var google: any;
@Component({
    selector: 'app-hotel-search-roomtype-page',
    templateUrl: './hotel-search-roomtype-page.component.html',
    styleUrls: ['./hotel-search-roomtype-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HotelSearchRoomtypePageComponent extends BasePageComponent implements OnInit, OnDestroy {
    ctx: any = this;
    headerType: any;
    headerConfig: any;
    map: any;
    hotelCode: any;

    vm: any;
    resolveData: any;
    travelerInfo: any;
    hotelInfoTrd: any;
    hotelInfoRs: any;
    hotelRoomListRq: any;
    hotelRoomListRs: any;
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
        travelerInfo: ''
    };

    hotelInfo: any;
    photoList: any = []; // 호텔 사진 list
    attractions; //주변정보
    information: any; //호텔 정보
    generalInfo: any; // 일반 사항
    facility: Array<any> = []; // 편의시설
    recommendHotels: any; // 주변 호텔 추천 list
    userInfo: any; // 로그인 개인정보
    selRoomType: any; // 선택 객실 roomtype

    /**
     * 더보기 index
     */
    moreIndex: any = {
        room: 3,// 객실 정보 더보기 index
        info: 2, //호텔 정보 더보기 index
        general: 2, // 일반 사항 더보기 index
        facility: 8, // 편의시설 더보기 index
        recommend: 3// 주변 추천 호텔 더보기 index
    };

    // 여행자 옵션
    travelerObj: any = {
        state: CalendarState.IS_DEFAULT,
        position: 'absolute',
        zIndex: 1000,
        left: 0,
        top: 0,
        childAgeList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        closeEvt: this.onTravelerClose
    };

    // 캘린더
    calendarObj: any = {
        storeCategoryType: 'HOTEL',
        typeId: null,
        state: CalendarState.IS_DEFAULT,
        right: 0,
        top: 0,
        initialState: null,
        closeEvt: this.onCalendarClose
    };

    rxAlive: boolean = true;
    loadingBool: boolean = false;
    hotelInfoLoadingBool: boolean = false;
    roomLoadingBool: boolean = false;
    researchBool: boolean = false;

    modalCalendar$: Observable<any>; // 캘린더
    modalTravelerOption$: Observable<any>; //인원 선택


    bsThumbnailRef: BsModalRef;
    bsModalRoomtypeDetailRef: BsModalRef;

    @ViewChild('slickModal') slickElement;
    slideConfig = {
        'dots': true,
        'focusOnSelect': false,
        'infinite': false,
        'speed': 500,
        'slidesToShow': 3,
        'slidesToScroll': 3,
        'touchThreshold': 5
    };

    slideConfig2 = {
        'dots': true,
        'dotsClass': 'slick-dots custom-dot-class',
        'edgeFriction': 0.35,
        'infinite': false,
        'speed': 500,
        'slidesToShow': 1,
        'slidesToScroll': 1
    };

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        public jwtService: JwtService,
        private store: Store<any>,
        private router: Router,
        private location: Location,
        private route: ActivatedRoute,
        private comService: HotelComService,
        private apiHotelService: ApiHotelService,
        private bsModalService: BsModalService,
        private loadingBar: LoadingBarService,
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
        console.info('[ngOnInit]');
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.className = 'bg';

        this.storeHotelSearchRoomtypeInit();
        this.routeInit();
        this.observableInit(); // 옵져버블 초기화
        this.subscribeInit(); // 서브스크라이브 초기화

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
    * 옵져버블 초기화
    */
    observableInit() {
        // 캘린더
        this.modalCalendar$ = this.store.pipe(
            select(hotelModalCalendarSelectors.getSelectId(['hotel-main']))
        );

        this.modalTravelerOption$ = this.store.pipe(
            select(hotelModalTravelerOptionSelectors.getSelectId(['hotelTraveler']))
        );
    }

    /**
     * 서브스크라이브 초기화
     */
    subscribeInit() {
        /**
         * 인수날짜 ~ 반납날짜
         */
        this.subscriptionList.push(
            this.modalCalendar$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalCalendar$ > subscribe]', ev);
                        if (ev) {
                            this.mySearchInfo.checkDate.in = moment(ev.result.selectList[0].toString()).format('YYYY-MM-DD');
                            this.mySearchInfo.checkDate.out = moment(ev.result.selectList[1].toString()).format('YYYY-MM-DD');
                        }
                    }
                )
        );

        this.subscriptionList.push(
            this.modalTravelerOption$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalHotelModalTravelerOption$ > subscribe]', ev);
                        if (ev) {
                            const hotelTravelerOpt = _.cloneDeep(ev);
                            this.mySearchInfo.traveler = hotelTravelerOpt;
                            this.mySearchInfo.travelerInfo = this.comService.getTravelerInfo(hotelTravelerOpt.roomList);
                        }
                    }
                )
        );
    }

    /**
     * 라우트 초기화 : get으로 데이터 전달 받음
     */
    routeInit() {
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.info('[1. route 통해 데이터 전달 받기]', data);
                        this.resolveData = _.cloneDeep(data.resolveData);

                        console.info('[1. route 통해 데이터 전달 받기 isBrowser]', this.resolveData);

                        const rq = {
                            stationTypeCode: environment.STATION_CODE,
                            currency: 'KRW',
                            language: 'KO',
                            condition: {
                                hotelCode: this.resolveData.hCode
                            }
                        };

                        if (_.has(this.resolveData, 'trd'))
                            rq['transactionSetId'] = this.resolveData.trd;

                        this.resolveData.rq = _.cloneDeep(rq);

                        this.vmInit();

                        if (this.isBrowser) {
                            this.pageInit(this.resolveData);
                        }
                    }
                )
        );
    }

    vmInit() {
        const RESOLVE_DATA = this.resolveData;

        //재검색 여행자 정보
        this.travelerInfo = this.comService.getTravelerInfo(RESOLVE_DATA.roomList);

        this.vm = {
            city: RESOLVE_DATA.city,
            chkIn: RESOLVE_DATA.chkIn,
            chkOut: RESOLVE_DATA.chkOut,
            roomList: RESOLVE_DATA.roomList,
            hotelCode: RESOLVE_DATA.hCode,
            trd: RESOLVE_DATA.trd,
            rq: RESOLVE_DATA.rq,
            rs: null,
            roomListRq: null,
            roomListRs: null
        };

        console.info('[vmInit] > this.vm', this.vm);
        console.info('[vmInit] > RESOLVE_DATA', RESOLVE_DATA);

        this.loadingBool = true;
        this.upsertOne({
            id: 'hotel-roomtype-resolve-data',
            result: this.vm
        });

    }
    /**
     * 1. 호텔 정보 api 호출
     * 2. 룸리스트 api 호출
     * @param $resolveData
     */
    pageInit($resolveData) {
        const resolveData = JSON.parse(JSON.stringify($resolveData));
        this.hotelCode = _.cloneDeep($resolveData.hCode);
        console.log(resolveData, 'resolveData');

        this.loadingBar.start();
        // ---------[헤더 초기화]
        this.headerInit();
        // ---------[ end 헤더 초기화]

        // ---------[내 검색 정보]
        const travelerInfo = this.comService.getTravelerInfo($resolveData.roomList); //객실 수, 인원
        this.mySearchInfo.traveler.roomList = _.cloneDeep($resolveData.roomList);
        this.mySearchInfo.travelerInfo = `${travelerInfo}`;
        this.mySearchInfo.checkDate.in = $resolveData.chkIn;
        this.mySearchInfo.checkDate.out = $resolveData.chkOut;
        // ---------[ end 내 검색 정보]


        this.hotelInfoLoadingBool = false;

        this.subscriptionList.push(
            this.apiHotelService.POST_HOTEL_INFORMATION(resolveData.rq)
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            console.info('[pageInit > POST_HOTEL_INFORMATION]', res);
                            this.hotelInfoTrd = _.cloneDeep(res['transactionSetId']);
                            this.hotelInfoRs = _.cloneDeep(res);
                            this.storageS.makeRecentData(
                                'local',
                                {
                                    rq: this.resolveData,
                                    dateRange: `${moment($resolveData.chkIn).format('MM.DD(ddd)')}-${moment($resolveData.chkOut).format('MM.DD(ddd)')}`,
                                    travelerInfo: this.mySearchInfo.travelerInfo,
                                    hotelName: this.hotelInfoRs.result.hotel.hotelNameLn,
                                    photoUrl: this.hotelInfoRs.result.hotel.photos[0].photoUrl,
                                },
                                'hotel'
                            );
                            this.vm.rs = this.hotelInfoRs;
                            //store 저장
                            this.upsertOne({
                                id: 'hotel-search-roomtype-info',
                                result: this.vm
                            });

                            this.hotelInfo = this.hotelInfoRs.result.hotel;
                            this.hotelInfoInit(this.hotelInfo);
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                    },
                    () => {
                        console.log('POST_HOTEL_INFORMATION completed.');
                        this.hotelInfoLoadingBool = true;
                        this.roomLoadingBool = false;
                        this.loadingBar.complete();
                        const roomList = this.comService.makeRoomCondition(resolveData.roomList);
                        const hotelInfoTrd = this.hotelInfoTrd;
                        this.hotelRoomListRq = this.makeHotelRoomListRq({
                            resolveData, hotelInfoTrd, roomList
                        });

                        this.callRoomListApi(this.hotelRoomListRq);
                    }
                )
        );
    }

    /**
    * 검색 api 호출 | 호텔 룸 리스트
    */
    callRoomListApi($rq) {
        this.subscriptionList.push(
            this.apiHotelService.POST_HOTEL_ROOM_LIST($rq)
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            console.info('[pageInit > POST_HOTEL_ROOM_LIST]', res);
                            this.hotelRoomListRs = res;

                            this.vm.roomListRq = $rq;
                            this.vm.roomListRs = this.hotelRoomListRs;
                            //store 저장
                            this.upsertOne({
                                id: 'hotel-search-roomtype-info',
                                result: this.vm
                            });
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        // 하림
                        // this.alertService.showApiAlert(err.error.errorMessage);
                        console.log('HTTP Error', err);
                        this.roomLoadingBool = false;
                        if (this.rxAlive) {
                            const error = err.error;
                            if (error)
                                if (error.errorCode === 'error.hotel.roomList')
                                    this.errorMsgAlert('에러', '룸리스트 오류가 발생했습니다.');
                        }
                    },
                    () => {
                        console.log('POST_HOTEL_ROOM_LIST completed.');
                        this.roomLoadingBool = true;
                    }
                )
        );
    }


    /**
     * 룸 리스트 rq
     * @param param0
     */
    makeHotelRoomListRq({ resolveData, hotelInfoTrd, roomList }) {
        console.info('[makeHotelRoomListRq]', resolveData);
        const con = {
            hotelCode: resolveData.hCode,
            checkInDate: resolveData.chkIn,
            checkOutDate: resolveData.chkOut,
            rooms: roomList,
            dynamicRateYn: false
        };

        const result = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            transactionSetId: hotelInfoTrd,
            condition: con,
        };

        return result;
    }

    /**
    * 호텔 정보 데이터 초기화
    * 사진/인근명소/ 호텔정보 / 일반사항
    * @param $hotelInfo
    */
    hotelInfoInit($hotelInfo) {

        //사진 (URL _z -> _y 변경하여 존재하는 img photoList 에 담기)
        if ($hotelInfo.photos.length > 0)
            this.photoList = this.changeUrlPhotoList($hotelInfo.photos);

        // 인근명소 거리순으로 정렬
        this.attractions = _.sortBy($hotelInfo.poi.attractions, 'distance');
        //호텔정보_각 항목에 내용 없으면 필터링 됨
        const info = [];
        info.push({
            title: 'address',
            dtTxt: '주소',
            txt: ($hotelInfo.addressLn) ? $hotelInfo.addressLn : $hotelInfo.addressEn
        });
        info.push({
            title: 'contact',
            dtTxt: '연락처',
            txt: $hotelInfo.phoneNo + $hotelInfo.faxNo
        });
        info.push({
            title: 'homepageUrl',
            dtTxt: '홈페이지',
            txt: $hotelInfo.homepageUrl
        });

        this.information = _.filter(info, (obj) => {
            return !_.isEmpty(obj.txt);
        });

        //일반사항_각 항목에 내용 없으면 필터링 됨
        const general = [];
        if ($hotelInfo.hotelIntro) {
            general.push({
                title: '호텔 소개',
                txt: $hotelInfo.hotelIntro
            });
        }

        if ($hotelInfo.roomFacility) {
            general.push({
                title: '객실',
                txt: $hotelInfo.roomFacility
            });
        }
        if ($hotelInfo.hotelFacility) {
            general.push({
                title: '편의시설',
                txt: $hotelInfo.hotelFacility
            });
        }
        if ($hotelInfo.hotelCaution) {
            general.push({
                title: '유의사항',
                txt: $hotelInfo.hotelCaution
            });
        }

        this.generalInfo = _.filter(general, (obj) => {
            return !_.isEmpty(obj.txt);
        });

        //편의 시설
        _.forEach($hotelInfo.facilities, ($fItem) => {
            const codeName = this.getFacilityName($fItem.facilityCode);
            const obj = {
                name: $fItem.facilityName,
                codeName: codeName
            };
            this.facility.push(obj);
        });

        //주변 추천 호텔 리스트
        if (_.has($hotelInfo, 'recommends')) {
            if ($hotelInfo.recommends.length > 0)
                this.recommendHotels = $hotelInfo.recommends;
        }
    }

    /**
    * store 초기화
    */
    storeHotelSearchRoomtypeInit() {
        this.store.dispatch(clearHotelModalDestinations());
        this.store.dispatch(clearHotelModalCalendars());
        this.store.dispatch(clearHotelModalTravelerOptions());

        this.store.dispatch(clearHotelSearchRoomtypes());
        this.store.dispatch(clearHotelSessionStorages());
    }


    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_HOTEL
        };
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
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertHotelSearchRoomtype({
            hotelSearchRoomtype: _.cloneDeep($obj)
        }));
    }

    upsertSessionOne($obj) {
        this.store.dispatch(upsertHotelSessionStorage({
            hotelSessionStorage: _.cloneDeep($obj)
        }));
    }


    /**
     * @param $photos
     */
    changeUrlPhotoList($photos): void {
        const photos = JSON.parse(JSON.stringify($photos));
        photos.forEach((item) => {
            if (item.photoUrl) { // photoUrl 값이 있을 경우
                const resultUrl = this.comService.replaceImageQulaity(item.photoUrl, '_z');
                item.photoUrl = resultUrl;
            }
        });

        return photos;
    }

    /**
     * 호텔 사진 클릭 이벤트 /
     * @param e
     */
    onThumbnailClick(event: MouseEvent, $idx: number) {
        event && event.preventDefault();

        console.log('호텔 사진 modal open ...', $idx);
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        const initialState = {
            currentSlide: $idx
        };

        this.bsThumbnailRef = this.bsModalService.show(HotelModalDetailImageComponent, { initialState, ...configInfo });

    }

    /**
     * 객실 정보 모달 오픈
     * @param roomType$
     */
    openRoomInfo(roomType$) {
        console.log('객실 정보 modal open ...', this.hotelRoomListRs);

        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            transactionSetId: this.hotelRoomListRs.transactionSetId,
            condition: {
                hotelCode: this.vm.hotelCode,
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

        this.bsModalRoomtypeDetailRef = this.bsModalService.show(HotelModalRoomInformationComponent, { initialState, ...configInfo });
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
     * tab-header 클릭 시, 스크롤 이벤트
     * @param e
     * @param $tgId
     */
    onTabClick(e, $tgId) {
        const rowList = e.target.parentNode.parentNode.parentNode;
        const tgElList = rowList.querySelectorAll(`[data-target="tab-header-outer"] a`);
        _.forEach(tgElList, (tgElItem) => {
            tgElItem.classList.remove('active');
        });
        rowList.querySelector(`[data-target="${$tgId}"]`).classList.add('active');

        const doc = document.documentElement;
        const targetOffset = document.getElementById($tgId).getBoundingClientRect();
        const windowScrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        const top = targetOffset.top + windowScrollTop - 54;
        window.scrollTo(0, top);
    }


    /**
     * 더보기 버튼 이벤트
     * @param $moreStr room : 객실선택 | general : 일반사항 | facility : 편의시설
     * @param $num
     */
    viewMore($moreStr, $num) {
        this.moreIndex[$moreStr] = this.moreIndex[$moreStr] + $num;
    }

    /**
     * 편의시설 코드에 해당하는 css 클래스 명 가져오기
     * @param $code
     */
    getFacilityName($code) {
        let nameVal = '';
        switch ($code) {
            case 'HF001':
                nameVal = 'wifi';
                break;
            case 'HF002':
                nameVal = 'parking';
                break;
            case 'HF003':
                nameVal = 'airport-pickup';
                break;
            case 'HF004':
                nameVal = 'restaurant';
                break;
            case 'HF005':
                nameVal = 'lounge';
                break;
            case 'HF006':
                nameVal = 'pool';
                break;
            case 'HF007':
                nameVal = 'fitness';
                break;
            case 'HF008':
                nameVal = 'airconditioner';
                break;
            case 'HF009':
                nameVal = 'refrigerator';
                break;
            default:
                break;
        }
        return nameVal;
    }

    /**
     * 내 검색 정보 변경 시, 재검색
     */
    onResearchRoomtype() {
        this.onRoomtypeHotelDtl(this.vm.hotelCode, this.hotelInfoTrd);
    }
    /**
     * 객실 재검색 / 주변 추천 호텔 상세
     * @param $hotelCode
     */
    onRoomtypeHotelDtl($hotelCode, $trd?) {
        const VM_DATA = this.vm;
        const rqInfo = {
            city: VM_DATA.city,
            hCode: $hotelCode,
            chkIn: this.mySearchInfo.checkDate.in,
            chkOut: this.mySearchInfo.checkDate.out,
            roomList: this.mySearchInfo.traveler.roomList
        };

        let regionCode;
        const cityGubun = this.comService.getDestinationCodeName(this.vm.city.codeName);
        if (cityGubun === 'regionCode') {
            regionCode = this.vm.city.val;
        }

        this.comService.moveRoomtypePage(rqInfo, $trd, regionCode, true);
    }

    /**
     * 룸 선택 버튼 클릭 시, 예약자 입력 페이지로 이동
     * @param $selRoom
     */
    goBookingInformation($selRoom) {
        console.info('go bookin', this.vm);
        const rq = {
            hotelCode: this.vm.hotelCode,
            roomInfo: {
                roomType: $selRoom,
                lowestRoomAmount: this.hotelRoomListRs.result.roomTypes[0].amountSum
            },
            checkInDate: this.vm.chkIn,
            checkOutDate: this.vm.chkOut
        };

        const cityGubun = this.comService.getDestinationCodeName(this.vm.city.codeName);
        if (cityGubun === 'regionCode') {
            rq['regionCode'] = this.vm.city.val;
        }

        const roomConRq = {
            rooms: this.vm.roomListRq.condition.rooms,
        };

        if (this.hotelInfoTrd) {
            roomConRq['transactionSetId'] = this.hotelInfoTrd;
        }

        const rqInfo = {
            roomConRq: roomConRq,
            rq: rq
        };

        console.info('go bookin', rqInfo);

        this.upsertSessionOne({
            id: 'hotel-booking-information-rq',
            result: rqInfo
        });
        //return false;

        console.info('go to hotel-booking-information', rqInfo);
        const path = '/hotel-booking-information/';
        this.router.navigate([path], { relativeTo: this.route });
    }


    /**
     * 호텔 api 에러 코드 alert
     * @param $str 에러 메세지
     */
    errorMsgAlert($alertTitle, $titleTxt) {
        const initialState = {
            alertTitle: $alertTitle,
            titleTxt: $titleTxt,
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
       * 지도 옵션 설정
       */
    onMapReady(map) {
        this.map = map;
        this.map.setOptions({
            zoomControl: 'true',
            scrollwheel: false,
            zoomControlOptions: {
                position: ControlPosition.TOP_LEFT
            },
            maxZoom: 18, //최대 줌
            minZoom: 1,  //최소 줌
            mapTypeControl: true,
            mapTypeControlOptions: {
                mapTypeId: google.maps.MapTypeId.ROADMAP // 지도 유형(ROADMAP, SATELLITE, HYBRID 또는 TERRAIN)
            },

            disableDefaultUI: true, //기본 UI 사용 여부
            disableDoubleClickZoom: true, //더블클릭 중심으로 확대 사용 여부
            draggable: true, //지도 드래그 이동 사용 여부
            keyboardShortcuts: true, //키보드 단축키 사용 여부

            scaleControl: true, // 지도로 드래그해서 스트리트 뷰를 활성화할 수 있는 펙맨 아이콘이 있습니다. 기본적으로 이 컨트롤은 지도의 오른쪽 아래 근처에 나타납니다.
            streetViewControl: true, // 경사진 이미지가 포함된 지도에 틸트와 회전 옵션 조합을 제공합니다. 기본적으로 이 컨트롤은 지도의 오른쪽 아래 근처에 나타납니다.
            rotateControl: true, // 지도 배율 요소를 표시합니다. 이 컨트롤은 기본적으로 비활성화되어 있습니다.

            fullscreenControl: true,
            clickableIcons: false //google map icon 클릭
        });
    }

    //------------------------------[캘린더]
    /**
    * 여행 일정
    */
    onDateClick(e) {
        console.info('[여행 일정]', e);
        if (this.calendarObj.state !== CalendarState.IS_OPEN) {
            //열린창 닫기
            this.onTravelerClose(this);

            this.calendarObj.typeId = 'from';
            this.calendarObj.state = CalendarState.IS_OPEN;

            const tgWrapName = 'tg-roomtype-search';
            const tgWrap = document.querySelector(`[data-target="${tgWrapName}"]`);
            this.calendarObj.top = tgWrap.clientHeight + 69;
            this.openCalendar(0);
        } else {
            //캘린더 모달창 닫기
            this.onCalendarClose(this);
        }
    }

    /**
     * 달력 팝업
     */
    openCalendar($tgNum) {
        console.info('[달력 팝업 > $tgNum]', $tgNum);

        const itemCategoryCode = 'IC02';
        const storeId = 'hotel-main';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,
            step: 0,
            totStep: 2,
            tabTxtList: ['체크인', '체크아웃'],
            selectList: [],

            rq: {
                currency: 'KRW',
                language: 'KO',
                stationTypeCode: environment.STATION_CODE,
                condition: {
                    itemCategoryCode: itemCategoryCode
                }
            }
        };

        console.info('[initialState]', initialState);

        this.subscriptionList.push(
            this.modalCalendar$
                .pipe(take(1))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalCalendar$ > subscribe]', ev);
                        if (ev) {
                            initialState.step = $tgNum;
                            initialState.totStep = ev.result.totStep;
                            initialState.tabTxtList = ev.result.tabTxtList;
                            initialState.selectList = _.slice(ev.result.selectList, 0, $tgNum);
                            console.info('[initialState 2]', initialState);
                        }

                        this.calendarObj.initialState = initialState;
                    }
                )
        );
    }
    onCalendarClose($ctx) {
        console.info('[onCalendarClose]');
        $ctx.calendarObj.state = CalendarState.IS_DEFAULT;
    }
    //------------------------------[end 캘린더]

    //------------------------------[여행자 옵션]
    onTravelerClick(e) {
        if (this.travelerObj.state !== CalendarState.IS_OPEN) {
            this.onCalendarClose(this);
            console.info('[여행자 옵션]', e);
            this.travelerObj.state = CalendarState.IS_OPEN;

            const tgWrapName = 'tg-roomtype-search';
            const tgWrap = document.querySelector(`[data-target="${tgWrapName}"]`);
            this.travelerObj.top = tgWrap.clientHeight + 69;
        } else {
            //여행자 옵션 모달창 닫기
            this.onTravelerClose(this);
        }
    }

    onTravelerClose($ctx) {
        console.info('[onTravelerClose]');
        $ctx.travelerObj.state = CalendarState.IS_DEFAULT;
    }
    //------------------------------[end 여행자 옵션]

    //------------------------------[재검색]
    openResearchEvt(event: MouseEvent) {
        event && event.preventDefault();

        this.researchBool = true;
        console.info('openResearchEvt', this.researchBool);

    }

    closeResearchEvt(event: MouseEvent) {
        event && event.preventDefault();

        this.researchBool = false;
    }

    //------------------------------[end 재검색]
    //------------------------------[slick]
    next() {
        this.slickElement.slickNext();
    }

    prev() {
        this.slickElement.slickPrev();
    }
    //------------------------------[end slick]

    //------------------------------[장바구니]

    addCart($roomType) {
        this.selRoomType = $roomType;
        const curUrl = this.route.snapshot['_routerState'].url;
        this.jwtService.loginGuardInit(curUrl).then(
            (e) => {
                console.info('[jwtService.loginGuardInit > ok]', e);
                this.commonUserInfoInit();
            },
            (err) => {
                console.info('[jwtService.loginGuardInit > err]', err);
            });
    }

    commonUserInfoInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(commonUserInfoSelectors.getSelectId('commonUserInfo')), // 스토어 ID
                    takeWhile(() => this.rxAlive))
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
                                    hotelCode: this.hotelRoomListRq.condition.hotelCode,
                                    checkInDate: this.hotelRoomListRq.condition.checkInDate,//필수
                                    checkOutDate: this.hotelRoomListRq.condition.checkOutDate,//필수
                                    rooms: this.hotelRoomListRq.condition.rooms,//필수
                                    roomTypeName: this.selRoomType.roomTypeName, //필수
                                    searchAmount: this.selRoomType.amountSum //필수
                                }
                            };

                            if (_.has(this.vm.roomListRs, 'transactionSetId')) // room/list rs > transactionSetId 필수값 아님
                                rq['transactionSetId'] = this.hotelRoomListRs.transactionSetId;

                            // if (_.has(this.selRoomType, 'roomTypeCodedData')) // room/list rs > roomTypes > roomTypeCodedData 필수값 아님
                            //     rq.condition['receiveDeviceToken'] = this.selRoomType.roomTypeCodedData;

                            if (_.has(this.userInfo, 'emailAddress')) //로그인 개인정보 > 이메일 필수값 아님
                                rq.condition['receiveEmailAddress'] = this.userInfo.emailAddress;


                            console.info('addCart > rq', rq);
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
    async putHotelBasketApi($rq) {
        await this.apiHotelService.PUT_HOTEL_BASKET($rq)
            .toPromise()
            .then((res: any) => {
                if (res.succeedYn) {
                    console.info('[API 호출 | 호텔 장바구니 추가 > ]', res);
                    this.cartMsgAlert('장바구니에 저장되었습니다.', '장바구니로 이동하시겠습니까?', false);
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err: any) => {
                // this.alertService.showApiAlert(err.error.errorMessage);
                console.info('[API 호출 | 호텔 장바구니 추가 > err]', err);
                this.cartMsgAlert('장바구니 저장 에러', '장바구니 저장 에러', true);
            });
    }

    /**
     * 장바구니 alert 이벤트
     * @param $alertTitle modal alert header title
     * @param $titleTxt   modal alert body title
     * @param $errorBool  api error > true / success > false
     */

    cartMsgAlert($alertTitle: any, $titleTxt: any, $errorBool: boolean) {
        const initialState = {
            alertTitle: $alertTitle,
            titleTxt: $titleTxt,
            closeObj: {
                fun: () => {
                    this.goToCartList();
                }
            }
        };

        if ($errorBool) { // 장바구니 추가 에러일 경우
            initialState['okObj'] = {
                fun: () => { }
            };
        } else {
            initialState['okObj'] = {
                fun: () => {
                    this.goToCartList();
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
        const path = '/my-wish-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
        // this.onCloseClick();
    }

    //------------------------------[end 장바구니]


}
