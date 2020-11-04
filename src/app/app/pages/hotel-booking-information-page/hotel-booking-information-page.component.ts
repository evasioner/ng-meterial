import { Component, Inject, PLATFORM_ID, ViewEncapsulation, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

//store
import { upsertHotelBookingInformation } from '../../store/hotel-booking-information-page/hotel-booking-information/hotel-booking-information.actions';
import { upsertHotelSessionStorage } from 'src/app/store/hotel-common/hotel-session-storage/hotel-session-storage.actions';

import * as commonUserInfoSelectors from 'src/app/store/common/common-user-info/common-user-info.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as moment from 'moment';
import { extendMoment } from 'moment-range';
import * as _ from 'lodash';

//service
import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { ApiHotelService } from 'src/app/api/hotel/api-hotel.service';
import { HotelComService } from 'src/app/common-source/services/hotel-com-service/hotel-com-service.service';
import { ApiBookingService } from 'src/app/api/booking/api-booking.service';
import { UtilUrlService } from '../../common-source/services/util-url/util-url.service';
import { JwtService } from '../../common-source/services/jwt/jwt.service';
import { CommonValidatorService } from '@/app/common-source/services/common-validator/common-validator.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';
import { HotelCommon } from '@/app/common-source/enums/hotel/hotel-common.enum';

//component
import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { HotelModalAgreementComponent } from './modal-components/hotel-modal-agreement/hotel-modal-agreement.component';

@Component({
    selector: 'app-hotel-booking-information-page',
    templateUrl: './hotel-booking-information-page.component.html',
    styleUrls: ['./hotel-booking-information-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HotelBookingInformationPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    element: any;
    ctx: any = this;
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;

    //resolveData: any;
    vm: any;
    hotelSessionRq: any;
    hotelInfoRq: any;
    roomConditoinRq: any;
    useDate: any;
    roomList: any;
    roomType: any;
    guestNumInfo: any;
    roomUpgrade: number;
    hotelInfoRs: any;
    specialInstructions: any; // 알아두실 사항 +  유의사항
    roomConditoinRs: any;
    clientCancelDeadline: any;

    noRoomUpgradeBool: boolean = false;
    invalidBool: boolean = false;
    mainForm: FormGroup; // 생성된 폼 저장
    travelerForm: FormGroup;

    userInfo: any;
    traveler: any;
    selTravelerList: any = [];
    // adultList: any = [];
    // childList: any = [];
    commonUserInfo$: any;

    arrivalTime: any;

    private subscriptionList: Subscription[];

    public bookingLoading: boolean;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private store: Store<any>,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private apiHotelService: ApiHotelService,
        private apiBookingService: ApiBookingService,
        private bsModalService: BsModalService,
        private comHotelS: HotelComService,
        private comValidator: CommonValidatorService,
        public jwtService: JwtService,
        public utilUrlService: UtilUrlService,
        private el: ElementRef,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
        this.element = this.el.nativeElement;
        this.subscriptionList = [];
        this.bookingLoading = true;
        this.mainFormInit();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.sessionInit();
        this.vmInit();
        if (this.isBrowser) {
            this.loginInit();
        }
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );

        this.rxAlive = false;
        this.closeAllModals();
        console.info('[ngOnDestroy > rxAlive]', this.rxAlive);
    }

    /**
     * 모든 bsModal 창 닫기
     */
    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    sessionInit() {
        const session = JSON.parse(localStorage.getItem('hotel-common'));
        console.info(session);
        if (!_.isEmpty(session.hotelSessionStorages.entities)) {
            this.hotelSessionRq =
                session.hotelSessionStorages.entities[
                    'hotel-booking-information-rq'
                ].result;
        }
    }

    vmInit() {
        const SESSOION_DATA = this.hotelSessionRq;

        this.vm = {
            roomConRq: SESSOION_DATA.roomConRq,
            rq: SESSOION_DATA.rq,

            userInfo: null,
            traveler: null,

            hotelInfoRs: null,
            roomConditoinRs: null
        };


        this.upsertOne({
            id: 'hotel-resolve-data',
            result: this.vm
        });

    }

    loginInit() {
        const curUrl = this.route.snapshot['_routerState'].url;
        this.jwtService.loginGuardInit(curUrl).then(
            (e) => {
                console.info('[jwtService.loginGuardInit > ok]', e);
                if (e) {
                    this.commonUserInfoInit();
                    this.pageInit();
                }
            },
            (err) => {
                console.info('[jwtService.loginGuardInit > err]', err);
            });
    }

    commonUserInfoInit() {
        this.subscriptionList = [
            this.store
                .pipe(
                    select(commonUserInfoSelectors.getSelectId('commonUserInfo')), // 스토어 ID
                    takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        if (ev) { // 변경 되이터
                            console.info('commonUserInfoSelectors', ev);
                            const tempVm = _.cloneDeep(this.vm);
                            tempVm.userInfo = ev['userInfo'];
                            tempVm.traveler = ev['traveler'];
                            this.vm = tempVm;
                            const traveler = ev['traveler'];
                            this.traveler = _.map(traveler, ($item) => {
                                const obj = JSON.parse(JSON.stringify($item));
                                obj['active'] = true;
                                return obj;
                            });

                            this.mainForm.patchValue({
                                userNo: this.vm.userInfo.user.userNo,
                                userName: this.vm.userInfo.user.nameKo,
                                userPhone: this.vm.userInfo.user.mobileNo.replace(/-/gi, ''),
                                userEmail: this.vm.userInfo.user.emailAddress
                            });

                        }
                    })
        ];
    }

    /**
     * 페이지 초기화
     * 2. 헤더, api rq 초기화
     */
    async pageInit() {
        //this.resolveData = $resolveData;
        // ---------[hotel-list-rq-info 스토어에 저장]
        // this.upsertOne({
        //   id: 'hotel-booking-infomation-rq-info',
        //   res: $resolveData
        // });

        const Moment = extendMoment(moment);
        // ---------[헤더 초기화]
        console.info('[2. 헤더, api rq 초기화 Start]');
        console.info('[2-1. 헤더 초기화 Start]');
        const checkInDate = moment(this.vm.rq.checkInDate).format('MM.DD');
        const checkOutDate = moment(this.vm.rq.checkOutDate).format(
            'MM.DD'
        );
        const range = Moment.range(
            this.vm.rq.checkInDate,
            this.vm.rq.checkOutDate
        );
        const dayDiff = range.diff('days'); //여행일수

        const getRoomInfo = this.parseTravelerInfo(
            this.vm.roomConRq.rooms
        );
        const travelerInfo = this.comHotelS.getTravelerInfo(getRoomInfo, true);

        const headerTitle = `예약자 입력`;
        const headerDetail = `${checkInDate}-${checkOutDate}(${dayDiff}박), ${travelerInfo}`;

        this.headerInit('user-information', headerTitle, headerDetail);
        console.info('[2-1. 헤더 초기화 End]');
        // ---------[ end 헤더 초기화]

        // ---------[api 호출 rq 초기화]
        console.info('[2-2. api 호출 rq 초기화 Start]');
        //호텔 정보 조회 rq
        this.hotelInfoRq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            transactionSetId: this.vm.roomConRq.transactionSetId,
            condition: {
                hotelCode: this.vm.rq.hotelCode,
            },
        };
        console.info('호텔 정보 조회 rq', this.hotelInfoRq);

        //호텔 취소수수료 정책 rq
        const lowestRoomAmount = this.vm.rq.roomInfo.lowestRoomAmount;
        this.roomType = this.vm.rq.roomInfo.roomType;
        this.roomUpgrade = this.roomType.amountSum - lowestRoomAmount;

        if (this.roomUpgrade === 0) this.noRoomUpgradeBool = true;

        console.info('선택된 객실', this.roomType);
        console.info('객실 업그레이드', this.roomUpgrade);

        this.roomConditoinRq = {
            stationTypeCode: environment.STATION_CODE, // 필수
            currency: 'KRW', // 필수
            language: 'KO', // 필수
            condition: {
                // 필수
                hotelCode: this.vm.rq.hotelCode, // 필수
                checkInDate: this.vm.rq.checkInDate, // 필수
                checkOutDate: this.vm.rq.checkOutDate, // 필수
                rooms: this.vm.roomConRq.rooms,
                roomTypeCode: this.roomType.roomTypeCode, // 필수
                roomTypeName: this.roomType.roomTypeName, // 필수
                payTypeCode: this.roomType.payTypeCode // 필수
            },
        };
        console.info('호텔 취소수수료 정책 rq', this.roomConditoinRq);

        if (_.has(this.roomType, 'guaranteeTypeCode')) {
            this.roomConditoinRq[
                'guaranteeTypeCode'
            ] = this.roomType.guaranteeTypeCode;
        }

        if (_.has(this.roomType, 'specialRateCode')) {
            this.roomConditoinRq[
                'specialRateCode'
            ] = this.roomType.specialRateCode;
        }

        if (_.has(this.roomType, 'roomTypeCodedData')) {
            this.roomConditoinRq[
                'condition'
            ].roomTypeCodedData = this.roomType.roomTypeCodedData;
        }

        if (_.has(this.roomType, 'transactionSetId')) {
            this.roomConditoinRq[
                'transactionSetId'
            ] = this.roomType.transactionSetId;
        }

        if (_.has(this.vm.rq, 'regionCode'))
            this.roomConditoinRq.condition.regionCode = this.vm.rq.regionCode;

        console.info('호텔 취소수수료 정책 rq', this.roomConditoinRq);

        console.info('[2-2. api 호출 rq 초기화 End]');
        // ---------[end api 호출 rq 초기화]

        // ---------[이용일 초기화]

        const checkInDate2 = moment(this.vm.rq.checkInDate).format(
            'YYYY.MM.DD(ddd)'
        );
        const checkOutDate2 = moment(this.vm.rq.checkOutDate).format(
            'YYYY.MM.DD(ddd)'
        );
        const dayDiff2 = range.diff('days'); //여행일수
        this.useDate = `${checkInDate2}-${checkOutDate2}, ${dayDiff2}박`;
        console.info('[이용일]', this.useDate);
        // ---------[이용일 초기화 end]
        // ---------[인원정보 초기화]
        this.roomList = this.vm.roomConRq.rooms;
        this.guestListInit(this.roomList);
        console.info('인원정보', this.guestNumInfo);
        // ---------[인원정보 초기화 end]

        this.arrivalTime = this.comHotelS.getCheckInTimeList();
        console.info('[2. 헤더, api rq 초기화 End]', this.arrivalTime);

        console.info('[3. api 호출 Start]');

        this.subscriptionList.push(
            forkJoin([
                this.apiHotelService.POST_HOTEL_ROOM_CONDITION(this.roomConditoinRq),
                this.apiHotelService.POST_HOTEL_INFORMATION(this.hotelInfoRq),
            ])
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    ([res1, res2]: any) => {
                        /**
                         * res1 : 호텔 취소수수료 정책
                         * res2 : 호텔 정보 조회
                         */

                        if (res1.succeedYn && res2.succeedYn) {
                            const tempVm = _.cloneDeep(this.vm);
                            tempVm.roomConditoinRs = res1['result'];
                            tempVm.hotelInfoRs = res2['result'];
                            this.vm = tempVm;

                            console.info(
                                '호텔 취소수수료 정책 res1 > roomConditoinRs',
                                res1
                            );

                            this.roomConditoinRs = res1['result'];
                            if (this.roomConditoinRs.chargeConditions.length > 0) {
                                const noFreeBool = _.every(
                                    this.roomConditoinRs.chargeConditions,
                                    (item) => item.chargeAmount !== 0
                                ); // 무료취소기간이 있을때 false / 없을때 true
                                if (!noFreeBool) {
                                    this.roomConditoinRs.chargeConditions.map(
                                        (item: any): void => {
                                            if (item.chargeAmount === 0) {
                                                this.clientCancelDeadline =
                                                    item.clientToTime;
                                            }
                                        }
                                    );
                                }
                            }

                            console.info(
                                '호텔 취소수수료 정책 res1 > clientCancelDeadline',
                                this.clientCancelDeadline
                            );

                            console.info('호텔 정보 조회 res2 > hotelInfoRs', this.vm.hotelInfoRs.hotel);
                            this.hotelInfoRs = this.vm.hotelInfoRs.hotel;
                            if (this.hotelInfoRs.defaultPhotoUrl)
                                this.hotelInfoRs.defaultPhotoUrl = this.comHotelS.replacePhotoUrl(
                                    this.hotelInfoRs.defaultPhotoUrl
                                );

                            console.info('upsert vm', _.pick(this.vm, ['roomConRq', 'hotelInfoRs', 'rq']));
                            this.upsertOne({
                                id: 'hotel-booking-infomation-rs',
                                result: this.vm
                            });
                            this.upsertOneSession({
                                id: 'hotel-booking-infomation-rs',
                                result: _.pick(this.vm, ['roomConRq', 'hotelInfoRs', 'rq'])
                            });
                            this.bookingLoading = false;
                        } else {
                            if (res1.errorMessage) {
                                this.alertService.goBackApiAlert(res1.errorMessage);
                            } else if (res2.errorMessage) {
                                this.alertService.goBackApiAlert(res2.errorMessage);
                            }
                        }
                    }, err => {
                        this.alertService.goBackApiAlert();
                    }
                )
        );

        console.info('[3. api 호출 End]');
    }

    /**
     * 헤더 초기화
     */
    headerInit($iconType, $headerTitle, $headerDetail) {
        console.info(
            '[headerInit] iconType: ',
            $iconType,
            ' headerTitle: ',
            $headerTitle,
            ' headerDetail',
            $headerDetail
        );
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            icon: $iconType,
            step: {
                title: $headerTitle,
            },
            detail: $headerDetail,
            ctx: this.ctx,
        };
    }

    /**
     * 폼 초기화
     */
    mainFormInit() {
        this.mainFormCreate();
    }

    /**
     * 폼 생성
     */
    mainFormCreate() {
        this.mainForm = this.fb.group({
            userNo: [''],
            userName: ['', [Validators.required, this.comValidator.customPattern({ pattern: /^[가-힣a-zA-Z]*$/, msg: '한글 또는 영문으로만 입력해주세요.' })]],
            userPhone: ['', [Validators.required, this.comValidator.customPattern({ pattern: /^01([0|1|6|7|8|9]?)([0-9]{3,4})([0-9]{4})$/, msg: '\'-\'를 제외한 숫자만 입력해주세요.' })]], // - 입력도 포함
            userEmail: ['', [Validators.required, Validators.email]],
            rooms: this.fb.array([]),
            requestList: this.fb.array([false, false, false]),
            arrivalTime: new FormControl(''),
            specialRequest: ['', [Validators.maxLength(50), this.comValidator.customPattern({ pattern: /^[\w|\r\n|\n|\r|\s|\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]*$/i, msg: '영문만 입력해주세요.' })]], //대소문 숫자 개행 띄어쓰기 특수
            agreeList: this.fb.array([new FormControl(false), new FormControl(false), new FormControl(false)], [this.comValidator.validateAgreeList]),
        });
    }

    addGuest($ageTypeCode): FormGroup {
        return this.fb.group({
            guestNameKr: new FormControl('', [
                Validators.required,
                Validators.maxLength(33),
                this.comValidator.customPattern({ pattern: /^[가-힣]*$/, msg: '한글만 입력해주세요.' })
            ]),
            guestLastName: new FormControl('', [
                Validators.required,
                Validators.maxLength(50),
                this.comValidator.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' })
            ]),
            guestFirstName: new FormControl('', [
                Validators.required,
                Validators.maxLength(50),
                this.comValidator.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' })
            ]),
            guestGender: new FormControl('M', Validators.required),
            ageTypeCode: new FormControl($ageTypeCode, Validators.required),
        });
    }

    addChildGuest(ageTypeCode: any, manAge: number): FormGroup {
        const manAgeInfo: string = (manAge === 0) ? '만 1세 미만' : `만 ${manAge}살`;
        return this.fb.group({
            guestNameKr: new FormControl('', [
                Validators.required,
                Validators.maxLength(33),
                this.comValidator.customPattern({ pattern: /^[가-힣]*$/, msg: '한글만 입력해주세요.' })
            ]),
            guestLastName: new FormControl('', [
                Validators.required,
                Validators.maxLength(50),
                this.comValidator.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' })
            ]),
            guestFirstName: new FormControl('', [
                Validators.required,
                Validators.maxLength(50),
                this.comValidator.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' })
            ]),
            guestGender: new FormControl('M', Validators.required),
            birthday: new FormControl('', [
                Validators.required,
                this.comValidator.ageFormValidator({
                    msg: '생년월일은 \'-\'를 제외한 8자리(2000101) 숫자만으로 입력해주세요.',
                    ageMsg: '호텔 체크인 날짜 ' + this.hotelSessionRq.rq.checkInDate + ' 에 맞는 ' + manAgeInfo + ' 아동이 없습니다. 연령 기준에 맞게 다시 조회하여 이용바랍니다.',
                    tgDay: this.hotelSessionRq.rq.checkInDate,
                    tgAge: manAge
                })
            ]),
            ageTypeCode: new FormControl(ageTypeCode, Validators.required)
        });
    }

    get mForm() {
        return this.mainForm;
    }

    get rooms(): FormArray {
        return this.mainForm.get('rooms') as FormArray;
    }

    get agreeList(): FormArray { return this.mainForm.get('agreeList') as FormArray; }

    isValid(field: string) {
        if (
            !this.mainForm.get(field).valid &&
            this.mainForm.get(field).touched
        ) {
            const control = this.mainForm.controls[field];
            return control;
        } else {
            return null;
        }
    }

    isGuestValid(
        $roomIdx: number,
        $guestIdx: number,
        field: string,
        field2: string
    ) {
        const guest = this.rooms.at($roomIdx).get(field).get(`${$guestIdx}`);

        if (!guest.get(field2).valid && guest.get(field2).touched) {
            return guest.get(field2);
        } else {
            return null;
        }
    }

    guestListInit($roomList) {
        console.info('guestListInit', $roomList);
        //const travelertFormArray: FormArray = this.mainForm.get('travelers') as FormArray;
        let returntxt: string = '';
        let adultNum: number = 0;
        let childrenNum: number = 0;

        for (const roomItem of $roomList) {
            adultNum += _.toNumber(roomItem.adultCount);
            childrenNum += roomItem.childAges.length;

            const fbArray = this.fb.array([]);
            for (let i = 0; i < roomItem.adultCount; i++) {
                fbArray.push(this.addGuest('ADT'));
            }

            const fbArrayChild = this.fb.array([]);

            if (roomItem.childCount > 0) {
                _.forEach(roomItem.childAges, (childVal) => {
                    fbArrayChild.push(this.addChildGuest('CHD', childVal));
                });
            }
            // for (let i = 0; i < roomItem.childAges.length; i++) {
            //     fbArrayChild.push(this.addChildGuest('CHD'));
            // }

            let formGroup: FormGroup;
            if (fbArrayChild.length > 0) {
                formGroup = this.fb.group({
                    adultList: fbArray,
                    childList: fbArrayChild,
                });
            } else {
                formGroup = this.fb.group({
                    adultList: fbArray,
                });
            }

            this.rooms.push(formGroup);
        }

        returntxt = '성인 ' + adultNum + '명';

        returntxt += (childrenNum > 0) ? ` 아동 ${childrenNum}명` : '';

        //인원수 정보
        this.guestNumInfo = returntxt;
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(
            upsertHotelBookingInformation({
                hotelBookingInformation: $obj,
            })
        );
    }

    upsertOneSession($obj) {
        this.store.dispatch(
            upsertHotelSessionStorage({
                hotelSessionStorage: _.cloneDeep($obj),
            })
        );
    }

    /**
     * parseTravelerInfo
     * 호텔 객실 투숙객 정보
     *
     * @param {Array} rooms 방정보
     */
    private parseTravelerInfo = (rooms: Array<any>): string => {
        // 성인^아동^아동나이,아동나이@
        let roomString: string = '';

        rooms.map((item: any, index: number) => {
            if (index > 0) {
                roomString += '@';
            }
            roomString += `${item.adultCount}^${item.childCount
                }^${item.childAges.join(',')}`;
        });

        return roomString;
    };

    /**
     * resetText
     * 텍스트 박스 리셋
     *
     * @param event? 돔 이벤트
     * @param idx
     */
    public userInfoReset(event?: any, num?: number) {
        event && event.preventDefault();
        if (num === 1) this.mainForm.get('userName').patchValue('');
        else if (num === 2) this.mainForm.get('userPhone').patchValue('');
        else if (num === 3) this.mainForm.get('userEmail').patchValue('');
    }

    //---------------------[호텔 정보]-----------------------------------------//


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

    range(i: number) {
        return Array(i);
    }

    //---------------------[투숙객 정보]---------------------------------------//
    /**
     * 여행자 정보 셀렉트 박스 (성인)
     * @param event
     * @param roomIdx
     * @param adultIdx
     */
    onGuestChange(event, roomIdx, adultIdx) {
        event && event.preventDefault();

        setTimeout(() => {
            let selIndex: number; // 신규 여행자 추가 시, 사용
            const travelerIdx = Number(event.target.value);

            const findIndex = _.findIndex(this.selTravelerList, {
                roomIdx: roomIdx,
                adultIdx: adultIdx,
            });
            if (findIndex >= 0) {
                //선택된 여행자가 있을 경우, 배열에서 제거
                selIndex = this.selTravelerList[findIndex].travelerIdx;
                this.selTravelerList.splice(findIndex, 1);
            }

            if (event.target.value) {
                this.selTravelerList.push({
                    //선택된 여행자 추가
                    roomIdx: roomIdx,
                    adultIdx: adultIdx,
                    travelerIdx: travelerIdx,
                });
                _.forEach(this.traveler, (item, idx) => {
                    const findGuest = _.findIndex(this.selTravelerList, {
                        travelerIdx: idx,
                    });
                    if (findGuest >= 0) {
                        // 선택한 여행자 정보 traveler 에서 active false
                        this.traveler[idx].active = false;
                    } else {
                        this.traveler[idx].active = true;
                    }
                });

            } else {
                // 신규 여행자 추가일 경우, 선택 해제된 값의 active true 로 변경
                this.traveler[selIndex].active = true;
            }

            const formArray = this.rooms
                .at(roomIdx)
                .get('adultList') as FormArray;
            const guset = formArray.at(adultIdx);
            const selGuest = this.traveler[event.target.value];
            let formData = {};
            if (event.target.value) {
                formData = {
                    guestNameKr: selGuest.name,
                    guestLastName: selGuest.lastName,
                    guestFirstName: selGuest.firstName,
                    guestGender: selGuest.gender,
                    ageTypeCode: guset.value.ageTypeCode,
                };
            } else {
                formData = {
                    guestNameKr: '',
                    guestLastName: '',
                    guestFirstName: '',
                    guestGender: 'M',
                    ageTypeCode: 'ADT',
                };
            }

            guset.patchValue(formData);
            console.info('traveler', this.traveler);
        });
    }

    /**
     * 여행자 정보 셀렉트 박스 (아동)
     * @param event
     * @param roomIdx
     * @param childIdx
     */
    onChildGuestChange(event, roomIdx, childIdx) {
        event && event.preventDefault();
        setTimeout(() => {
            let selIndex: number; // 신규 여행자 추가 시, 사용
            const travelerIdx = Number(event.target.value);

            const findIndex = _.findIndex(this.selTravelerList, {
                roomIdx: roomIdx,
                childIdx: childIdx,
            });
            if (findIndex >= 0) {
                // 해당 아동의 선택된 값이 있을 경우, 배열에서 제거
                selIndex = this.selTravelerList[findIndex].travelerIdx;
                this.selTravelerList.splice(findIndex, 1);
            }

            if (event.target.value) {
                this.selTravelerList.push({
                    roomIdx: roomIdx,
                    childIdx: childIdx,
                    travelerIdx: travelerIdx,
                });

                _.forEach(this.traveler, (item, idx) => {
                    const findGuest = _.findIndex(this.selTravelerList, {
                        travelerIdx: idx
                    });
                    if (findGuest >= 0) {
                        this.traveler[idx].active = false;
                    } else {
                        this.traveler[idx].active = true;
                    }
                });
            } else {
                // 신규 여행자 추가일 경우, 선택 해제된 값의 active true 로 변경
                this.traveler[selIndex].active = true;
            }

            const formArray = this.rooms
                .at(roomIdx)
                .get('childList') as FormArray;
            const guset = formArray.at(childIdx);
            const selGuest = this.traveler[event.target.value];
            let formData = {};
            if (event.target.value) {
                let brithdayVal = '';

                //birthday 데이터가 빈 값을때 에러 방지
                if (selGuest.birthday)
                    brithdayVal = selGuest.birthday.replace(/-/gi, '');

                formData = {
                    guestNameKr: selGuest.name,
                    guestLastName: selGuest.lastName,
                    guestFirstName: selGuest.firstName,
                    guestGender: selGuest.gender,
                    birthday: brithdayVal,
                    ageTypeCode: guset.value.ageTypeCode,
                };
            } else {
                formData = {
                    guestNameKr: '',
                    guestLastName: '',
                    guestFirstName: '',
                    guestGender: '',
                    birthday: '',
                    ageTypeCode: 'CHD',
                };
            }

            guset.patchValue(formData);
        });
    }


    onArrivalTimeChange(event: any) {
        event && event.preventDefault();

        const arrivalTime = this.mainForm.get(`arrivalTime`);
        console.info('onArrivalTimeChange', arrivalTime);

        const formArray: FormArray = this.mainForm.get(
            `requestList`
        ) as FormArray;
        const value = formArray.value[2];
        if (value) {
            arrivalTime.setValidators([Validators.required]);
            arrivalTime.updateValueAndValidity();
        } else {
            arrivalTime.clearValidators();
            arrivalTime.updateValueAndValidity();
        }
    }

    /**
     * 선택 요청사항 체크박스 이벤트
     * @param event
     * @param idx
     */
    onRequestCheckboxChange(event, idx) {
        event && event.preventDefault();
        const formArray: FormArray = this.mainForm.get(
            `requestList`
        ) as FormArray;

        formArray.removeAt(idx); // 삭제
        if (event.target.checked) {
            // 체크
            formArray.insert(idx, new FormControl(true));
        } else {
            // 취소
            formArray.insert(idx, new FormControl(false));
        }

        if (idx === 2) {
            // 레이트 체크인
            const value = formArray.value[idx];
            const arrivalTime = this.mainForm.get(`arrivalTime`);
            if (value) {
                if (arrivalTime.value) {
                    arrivalTime.clearValidators();
                    arrivalTime.updateValueAndValidity();
                } else {
                    arrivalTime.setValidators([Validators.required]);
                    arrivalTime.updateValueAndValidity();
                }
            } else {
                arrivalTime.setValue('');
                arrivalTime.clearValidators();
                arrivalTime.updateValueAndValidity();
            }
        }
        console.info('[onRequestCheckboxChange formArray]', formArray);
    }

    /**
     * 유의사항 > 더보기 버튼 이벤트
     *  @param event
     */
    moreViewCaution(event: any) {
        event && event.preventDefault();

        const divHotelCautionAreaEl = this.element.querySelector('[data-target="hotelCautionArea"');
        const aHotelCautionMoreViewEl = this.element.querySelector('[data-target="hotelCautionMoreView"');

        // 유의사항 데이터 영역 넓히기
        // min-data class 있으면 제거
        if (divHotelCautionAreaEl.classList.contains('min-data')) {
            divHotelCautionAreaEl.classList.remove('min-data');
        }

        // 더보기 버튼 숨기기
        // hide class 없으면 추가
        if (!aHotelCautionMoreViewEl.classList.contains('hide')) {
            aHotelCautionMoreViewEl.classList.add('hide');
        }
    }

    /**
     * 요금, 취소수수료 규정
     * @param event
     * @param storeId normal:일반규정 | cancel:취소규정 | personalInfo:개인정보취급방침
     */
    onAgreementClick(event, storeId) {
        event && event.preventDefault();
        console.info('[요금, 취소수수료 규정]', event);
        let tabNumber: number;

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,
            okFun: ((store) => {
                console.info('[okFun]',);
                if (store === 'normal')
                    tabNumber = 0;
                else if (store === 'cancel')
                    tabNumber = 1;
                else if (store === 'personalInfo')
                    tabNumber = 2;

                this.onChangeAgreement(tabNumber);
            })
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalService.show(HotelModalAgreementComponent, { initialState, ...configInfo });

    }

    /**
     * 동의하기 체크박스 이벤트
     * @param idx
     * @param event
     */
    onChangeAgreement(idx, event?) {
        event && event.preventDefault();
        let chkBool: boolean = true;

        //checkbox change 이벤트 발생 시
        if (!_.isEmpty(event)) {
            //checked false 경우
            if (!event.target.checked)
                chkBool = false;
        }

        //form update
        {
            this.agreeList.controls[idx].setValue(chkBool);
        }

        //모든 동의 checkbox checked
        const isTotChk = _.every(this.agreeList.value);
        const totChk = this.element.querySelector(`[data-target="agreeAllChk"] input[type='checkbox']`);
        if (isTotChk) { // 모두 동의
            totChk.checked = true;
        } else {
            totChk.checked = false;
        }

        console.info('[onChangeAgreement formArray]', this.agreeList);
    }

    /**
     * 모든 약관에 동의 체크박스 이벤트
     * @param event
     */
    onChangeAllAgreement(event: any) {
        event && event.preventDefault();
        const tgElList = this.element.querySelectorAll(`[data-target="agreeChk"] input[type='checkbox']`);
        if (event.target.checked) {
            _.forEach(tgElList, (tgElItem, index) => {
                tgElItem.checked = true;
                this.agreeList.controls[index].setValue(true);
            });
        } else {
            _.forEach(tgElList, (tgElItem, index) => {
                tgElItem.checked = false;
                this.agreeList.controls[index].setValue(false);
            });
        }
    }


    /**
     * booking rq > traveler 셋팅
     * @param index
     * @param item
     * @param userNo
     */
    travelerDataSet(index, item, userNo) {
        const ageTypeCode = item.ageTypeCode;
        const lastName = _.upperCase(item.guestLastName);
        const firstName = _.upperCase(item.guestFirstName);
        const returnObj: any = {
            travelerIndex: index, //필수
            name: item.guestNameKr, //필수
            gender: item.guestGender, //필수
            ageTypeCode: item.ageTypeCode, //필수
            nationalityCode: 'KR', //필수
            userNo: userNo,
            lastName: lastName,
            middleName: '',
            firstName: firstName,
        };

        if (ageTypeCode === 'CHD')
            returnObj.birthday = moment(String(item.birthday)).format(
                'YYYY-MM-DD'
            );
        return returnObj;
    }

    /**
     * booking api 호출
     * @param rq
     */
    hotelBookingApi(rq) {
        this.subscriptionList.push(
            this.apiBookingService.POST_BOOKING(rq)
                .subscribe(
                    (res: any) => {
                        console.info('[예약진행 > res]', res);
                        if (res.succeedYn) {
                            this.upsertOneSession({
                                id: 'hotel-booking-rs',
                                result: res['result'],
                            });

                            this.location.replaceState(HotelCommon.PAGE_MAIN); // 예약 완료 페이지에서 뒤로가기시 메인페이지로 가기
                            this.router.navigate([HotelCommon.PAGE_BOOKING_PAYMENT], { relativeTo: this.route });
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err);
                    },
                    () => {
                        this.bookingLoading = false;
                    }
                )
        );
    }

    async goBooking($form) {
        //high floor, late checkIn 고층 늦은 체크인 txt
        console.info('[goBooking] $form', $form);
        const roomType = this.roomType;
        const roomConditoin = this.roomConditoinRs;
        const clientCancelDeadline = moment(
            roomConditoin.cancelDeadline.clientCancelDeadline
        ).format('YYYY-MM-DD HH:mm');

        // ---------[선택 요청사항]
        const precodedRemarks = [];
        const specialRequestVal = this.mainForm.get(`specialRequest`).value;
        if (specialRequestVal) {
            const specialRequest = {
                code: 'BRQ99',
                memoRequest: '',
            };
            specialRequest.memoRequest = specialRequestVal;
            precodedRemarks.push(specialRequest);
        }
        const tg = this.element.querySelectorAll(
            `[data-target="requestChk"] input[type='checkbox']`
        );
        _.forEach($form.value.requestList, ($item, requestIdx) => {
            const rqChecked = $item;
            if (rqChecked) {
                //선택요청사항 checked true 경우 rq 에 담기
                const tgCodeValue = tg[requestIdx].value;
                const obj: object = {
                    code: tgCodeValue,
                };
                if (tgCodeValue === 'BRQ03') {
                    const arrivalTime = this.mainForm.get(`arrivalTime`).value;
                    obj['memoRequest'] = arrivalTime.val;
                }
                precodedRemarks.push(obj);
            }
        });

        console.info('[precodedRemarks]', precodedRemarks);

        // ---------[투숙객 정보]
        const roomList = [];
        const travelerList = [];
        let travelerIndex: number = 0;
        _.forEach($form.value.rooms, (room, roomIdx) => {
            const roomObj = {
                // smokingOptionCode or bedTypeOptionCode ???
                roomNo: roomIdx + 1, //필수
                travelerIndexes: [], //필수
                //smokingOptionCode: 'test',
                // bedTypeOptionCode: 'test'
            };

            //성인
            _.forEach(room.adultList, (adult) => {
                travelerIndex++;
                const adultObj = this.travelerDataSet(
                    travelerIndex,
                    adult,
                    $form.value.userNo
                );
                travelerList.push(adultObj);
                roomObj.travelerIndexes.push(travelerIndex);
            });

            //아동
            _.forEach(room.childList, (child) => {
                travelerIndex++;
                const childObj = this.travelerDataSet(
                    travelerIndex,
                    child,
                    $form.value.userNo
                );
                travelerList.push(childObj);
                roomObj.travelerIndexes.push(travelerIndex);
            });

            if (_.has(roomType, 'doubleBedYn'))
                roomObj['doubleBedYn'] = roomType.doubleBedYn;

            roomList.push(roomObj);
        });

        // ---------[booking rq 셋팅]
        const rq: any = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                // condition 필수 : domainAddress / deviceTypeCode / booker / travelers
                domainAddress: window.location.hostname, // 현재 도메인
                deviceTypeCode: 'MA', // MA: Mobile App, MW: Mobile Web, PC: PC
                booker: {
                    userNo: $form.value.userNo,
                    email: $form.value.userEmail,
                    mobileNo: _.replace(
                        $form.value.userPhone,
                        new RegExp('-', 'g'),
                        ''
                    ),
                    // picUno: 14830548,
                    name: $form.value.userName,
                },
                travelers: travelerList, //필수
                hotelItems: [
                    {
                        hotelCode: this.hotelSessionRq.rq.hotelCode, //필수
                        checkInDate: this.hotelSessionRq.rq.checkInDate, //필수
                        checkOutDate: this.hotelSessionRq.rq.checkOutDate, //필수
                        roomTypeCode: roomType.roomTypeCode, //필수
                        roomTypeName: roomType.roomTypeName, //필수
                        payTypeCode: roomType.payTypeCode, //필수
                        productAmount: roomType.productAmount, //필수
                        taxAmount: roomType.taxAmount, //필수
                        amountSum: roomType.amountSum, //필수
                        taxIncludedYn: roomType.taxIncludedYn, //필수
                        refundableYn: roomType.refundableYn,
                        clientCancelDeadline: clientCancelDeadline,
                        rooms: roomList, //필수
                        guaranteeTypeCode: 'GRT99',
                        freeBreakfastYn: roomType.freeBreakfastYn,
                        freeBreakfastName: roomType.freeBreakfastName,
                        dynamicRateYn: false,
                        // specialRateCode: 'false',
                        // rackAmount: 47959318.62613943,
                        roomTypeCodedData: roomType.roomTypeCodedData,
                        roomConditionCodedData:
                            roomConditoin.roomConditionCodedData,
                    },
                ],
                // bookingCode: 'minim',
                // itineraryMasterSeq: -18401997
            },
        };

        if (precodedRemarks.length > 0)
            rq.condition.hotelItems[0]['preCodedRemarks'] = precodedRemarks;

        if (_.has(this.hotelSessionRq.rq, 'freeWifiYn'))
            rq.condition.hotelItems[0][
                'freeWifiYn'
            ] = this.hotelSessionRq.rq.freeWifiYn;

        if (_.has(this.hotelSessionRq.rq, 'regionCode'))
            rq.condition.hotelItems[0][
                'regionCode'
            ] = this.hotelSessionRq.rq.regionCode;

        if (_.has(roomType, 'originAmount'))
            //없으면 조립안함
            rq.condition.hotelItems[0]['originAmount'] = roomType.originAmount;

        if (_.has(roomType, 'discountAmount'))
            //없으면 조립안함
            rq.condition.hotelItems[0]['discountAmount'] =
                roomType.discountAmount;

        if (_.has(roomConditoin, 'specialCheckInInstructions')) {
            if (roomConditoin.specialCheckInInstructions)
                rq.condition.hotelItems[0]['specialCheckInInstructions'] =
                    roomConditoin.specialCheckInInstructions;
        }

        if (_.has(roomConditoin, 'cancelPolicyDescription')) {
            if (roomConditoin.cancelPolicyDescription)
                rq.condition.hotelItems[0]['cancelPolicyDescription'] =
                    roomConditoin.cancelPolicyDescription;
        }

        if (_.has(roomConditoin, 'checkInInstructions')) {
            if (roomConditoin.checkInInstructions)
                rq.condition.hotelItems[0]['checkInInstructions'] =
                    roomConditoin.checkInInstructions;
        }

        console.info('[goBooking] rq', rq);

        this.hotelBookingApi(rq);
    }

    onSubmit($form: any) {
        console.info('[onSubmit]', $form);
        console.info('$form.valid : ', $form.valid);
        if ($form.valid) {
            this.bookingLoading = true;
            this.rxAlive = false;
            console.info('[1. 유효성 체크 성공]');
            this.goBooking($form);
        } else {
            _.forEach($form.controls, ($val, $key) => {
                if (!$val.valid) {
                    console.info('[$key | 유효성 체크 실패]', $key);
                    let targetId = $key;
                    if ($key === 'rooms') {
                        let flag = true;
                        _.forEach(
                            $form.controls.rooms.controls,
                            ($roomVal: any, roomIndex: number) => {
                                _.forEach(
                                    $roomVal.controls.adultList.controls,
                                    ($adultVal: any, adultIndex: number) => {
                                        console.info(
                                            adultIndex,
                                            ' [$key | 유효성 체크 실패 > adultList]',
                                            $adultVal.valid
                                        );

                                        if (flag && !$adultVal.valid) {
                                            flag = false;
                                            const errorKey = this.comValidator.getFirstErrorKeyValidation($adultVal);
                                            targetId = `${roomIndex}_a_${errorKey}${adultIndex}`;
                                        }
                                    }
                                );

                                if ($roomVal.controls.childList) {
                                    _.forEach(
                                        $roomVal.controls.childList.controls,
                                        ($adultVal: any, adultIndex: number) => {
                                            console.info(
                                                adultIndex,
                                                ' [$key | 유효성 체크 실패 > adultList]',
                                                $adultVal.valid
                                            );

                                            if (flag && !$adultVal.valid) {
                                                flag = false;
                                                const errorKey = this.comValidator.getFirstErrorKeyValidation($adultVal);
                                                targetId = `${roomIndex}_c_${errorKey}${adultIndex}`;
                                            }
                                        }
                                    );
                                }
                            }
                        );
                    }

                    this.inValidAlert(targetId);

                    return false;
                }
            });
            this.invalidBool = true;
        }
    } // end onSubmit

    public inValidAlert(targetId) {
        console.info('inValidAlert', targetId);
        const initialState = {
            titleTxt: '입력 값이 올바르지 않은 항목이 있습니다.',
            closeObj: { fun: () => { } },
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
        this.subscriptionList.push(
            this.bsModalService.onHidden
                .subscribe(
                    () => {
                        this.comValidator.scrollToTarget(targetId);
                    }
                )
        );

    }

    public isValidError(control: AbstractControl, submitted: boolean): boolean {
        const formControl = control as FormControl;
        return formControl.errors && (submitted || formControl.dirty || formControl.touched);
    }

}