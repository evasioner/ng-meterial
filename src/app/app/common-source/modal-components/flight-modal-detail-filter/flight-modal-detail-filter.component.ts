import { Component, PLATFORM_ID, Inject, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import * as flightSearchResultSelector from 'src/app/store/flight-common/flight-search-result/flight-search-result.selectors';

import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as qs from 'qs';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-flight-modal-detail-filter',
    templateUrl: './flight-modal-detail-filter.component.html',
    styleUrls: ['./flight-modal-detail-filter.component.scss']
})
export class FlightModalDetailFilterComponent extends BaseChildComponent implements OnInit, OnDestroy {
    element: any;
    detailFilterForm: FormGroup; // 생성된 폼 저장
    rqInfo: any; // 수정되는 rq 저장
    vm: any = {
        reload: '초기화',
        dSearch: '상세 검색',
        close: '닫기',
        stops: [],          // 직항,경유
        stopsAll: false,
        airlines: [],       // 항공사
        airlinesAll: false,
        airlinesCount: 5,
        airLineDetail: false,
        amount: null,         // 가격대
        cabinClasses: null,   // 좌석등급
        cabinClassesAll: false,

        card: null,           // 할인카드(현재 보류 03/20)

        departure: null,      // 출발시간
        arrival: null,        // 도착시간
        ground: null,         // 경유지 체류시간
        duration: null,       // 총 소요시간

        originAirports: [], // 출발 공항
        originAirportsAll: false,
        destinationAirports: [],   // 도착 공항
        destinationAirportsAll: false,
        viaAirports: [],    // 도착 공항
        viaAirportsAll: false,

        others: [],       // 공동운항
        othersAll: false,
        accordionOpen: {}
    };

    /**
    * 가격대 슬라이드 옵션
    */
    amountMin: number;
    amountMax: number;

    rxAlive: boolean = true;  // 스토어 구독 제어자
    flightSearchListRQ$: Observable<any>; // 항공 리스트 RQ
    flightSearchListRS$: Observable<any>; // 항공 리스트 RS

    loadingBool: boolean = false; // 완료 여부 (완료 : 화면 display)

    ctx: any = this;  // 현재 페이지 지시자
    ground: any;
    duration: any;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private router: Router,
        public el: ElementRef,
        private fb: FormBuilder,
        private store: Store<any>,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
        this.element = this.el.nativeElement;
        this.mainFormCreate();  // 폼 생성
        this.subscriptionList = [];
    }

    ngOnInit() {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        this.observableInit();  // 옵져버블 초기화
        this.subscribeInit();   // 구독
    }

    ngOnDestroy() {
        this.rxAlive = false; // 구독 해제
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    /**
    * mainFormCreate
    * 폼 생성
    */
    private mainFormCreate(): void {
        this.detailFilterForm = this.fb.group({
            stopsList: this.fb.array([], []), // 직항/경유
            airlinesList: this.fb.array([], []), // 항공사
            amountList: this.fb.array([], []), //
            cabinClassesList: this.fb.array([], []),
            departureList: this.fb.array([], []),
            arrivalList: this.fb.array([], []),
            groundList: this.fb.array([], []),
            durationList: this.fb.array([], []),
            originAirportsList: this.fb.array([], []),
            destinationAirportsList: this.fb.array([], []),
            viaAirportsList: this.fb.array([], []),
            othersList: this.fb.array([], [])
        });
    }

    /**
     * 옵져버블 초기화
     */
    observableInit() {
        this.flightSearchListRQ$ = this.store
            .pipe(select(flightSearchResultSelector.getSelectId('flight-list-rq-info')));
        this.flightSearchListRS$ = this.store
            .pipe(select(flightSearchResultSelector.getSelectId('flight-list-rs')));
    }

    /**
     * 구독
     */
    subscribeInit() {
        this.subscriptionList.push(
            this.flightSearchListRQ$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev) => {
                        console.info('[flightListRq$ > subscribe]', ev);
                        if (ev) {
                            this.rqInfo = _.cloneDeep(ev);

                            this.loadingBool = true;
                        } else {
                            this.loadingBool = false;
                        }
                    }
                )
        );

        this.subscriptionList.push(
            this.flightSearchListRS$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev) => {
                        console.info('[flightListRs$ > subscribe]', ev);
                        if (ev) {
                            // 필터 셋팅
                            // transactionSetId 추가(검색-예약 트랜잭션을 묶어주는값)
                            this.rqInfo.option.rq.transactionSetId = _.cloneDeep(ev.option.transactionSetId);
                            this.setFilter(ev.option.result);
                            this.loadingBool = true;
                        } else {
                            this.loadingBool = false;
                        }
                    }
                )
        );
    }

    /**
    * 필터 셋팅
    * flight/list rs 값을 통해 필터 값 셋팅
    * 1. 전체 필터 범위 셋팅
    * 2. 선택된 필터 셋팅
    */
    setFilter($result) {

        this.vm.othersAll = false;

        // 직항/경유
        this.vm.stops = _.cloneDeep(
            _.orderBy($result.forFilter.stops, ['viaCount'], ['asc'])
                .map(
                    (item: any): any => {
                        return { ...item, ...{ checked: false } };
                    }
                )
        );

        // 항공사
        $result.forFilter.alliances.map(
            (item: any) => {
                item.airlines.map(
                    (subItem: any): void => {
                        this.vm.airlines.push({ ...subItem, ...{ checked: false } });
                    }
                );
            }
        );

        // 가격대
        this.amountMin = $result.forFilter.amount.lowestAmount;
        this.amountMax = $result.forFilter.amount.highestAmount;
        this.vm.amount = {
            value: [this.amountMin, this.amountMax],  // 슬라이더 값 범위
            min: this.amountMin,       // 슬라이더 선택 값 (최소 금액)
            max: this.amountMax,      // 슬라이더 선택 값 (최대 금액)
            setMin: this.amountMin,    // 슬라이더 상단 현재 선택 값 표시(최소 금액)
            setMax: this.amountMax,   // 슬라이더 상단 현재 선택 값 표시(최대 금액)
            rangeMin: this.amountMin,  // 슬라이더 하단 범위 (최소 금액)
            rangeMax: this.amountMax, // 슬라이더 하단 범위 (최대 금액)
            slideEvt: this.priceUpdate,                       // 슬라이더 이벤트
            ctx: this.ctx                                     // 현재(현 컴포넌트) 페이지 지시자(슬라이더는 다른 컴포넌트 페이지)
        };

        // 좌석등급
        this.vm.cabinClasses = _.cloneDeep(
            $result.forFilter.cabinClasses.map(
                (item: any): any => {
                    return { ...item, ...{ checked: false } };
                }
            )
        );

        // 출발시간
        this.vm.departure = {
            value: [0, 1440],
            setMin: '00:00',
            setMax: '23:59',
            slideEvt: this.timeHourUpdate,
            ctx: this.ctx
        };

        // 도착시간
        this.vm.arrival = {
            value: [0, 1440],
            setMin: '00:00',
            setMax: '23:59',
            slideEvt: this.timeHourUpdate,
            ctx: this.ctx
        };

        // 경유지 체류시간
        this.ground = $result.forFilter.time.ground;
        this.vm.ground = this.convertMinToHour($result.forFilter.time.ground);

        // 총 소요시간
        this.duration = $result.forFilter.time.duration;
        this.vm.duration = this.convertMinToHour($result.forFilter.time.duration);

        // 출발 공항
        this.vm.originAirports = _.cloneDeep(
            $result.forFilter.originAirports.map(
                (item: any): any => {
                    return { ...item, ...{ checked: false } };
                }
            )
        );

        // 도착 공항
        this.vm.destinationAirports = _.cloneDeep(
            $result.forFilter.destinationAirports.map(
                (item: any): any => {
                    return { ...item, ...{ checked: false } };
                }
            )
        );

        // 경유지
        this.vm.viaAirports = _.cloneDeep(
            $result.forFilter.viaAirports.map(
                (item: any): any => {
                    return { ...item, ...{ checked: false } };
                }
            )
        );

        this.vm.others = [];
        // 기타 - 환승시 공항 변경 없음
        _.forEach($result.forFilter.others.airportChange, item => {
            const addItem: any = {
                key: 'airportChange,changedOrNot',
                code: item.changedOrNot,
                name: '환승시 공항 변경 없음',
                checked: false
            };

            if (!item.changedOrNot) {
                this.vm.others.push(addItem);
            }
        });

        // 기타 - 공동운항편 제외
        _.forEach($result.forFilter.others.codeShare, item => {
            const addItem: any = {
                key: 'codeShare,sharedOrNot',
                code: item.sharedOrNot,
                name: '공동운항편 제외',
                checked: false
            };

            if (!item.sharedOrNot) {
                this.vm.others.push(addItem);
            }
        });

        console.info('this.vm.others >', this.vm.others);

        /**
         * 선택한 필터가 있을 경우
         * 값 셋팅
         */
        if ($result.filter) {
            console.log('[2. 선택된 필터 셋팅]');

            // 직항,경유
            if (_.has($result.filter, 'stops')) {
                this.addFormArrayFilter($result.filter, 'stopsList', 'stops', 'viaCount');
            }

            // 항공사
            if (_.has($result.filter, 'airlines')) {
                this.addFormArrayFilter($result.filter, 'airlinesList', 'airlines', 'code');
            }

            // 좌석등급
            if (_.has($result.filter, 'cabinClasses')) {
                this.addFormArrayFilter($result.filter, 'cabinClassesList', 'cabinClasses', 'code');
            }

            // 출발공항
            if (_.has($result.filter, 'originAirports')) {
                this.addFormArrayFilter($result.filter, 'originAirportsList', 'originAirports', 'code');
            }

            // 도착공항
            if (_.has($result.filter, 'destinationAirports')) {
                this.addFormArrayFilter($result.filter, 'destinationAirportsList', 'destinationAirports', 'code');
            }

            // 경유지
            if (_.has($result.filter, 'viaAirports')) {
                this.addFormArrayFilter($result.filter, 'viaAirportsList', 'viaAirports', 'code');
            }

            // 기타
            if (_.has($result.filter, 'others')) {
                Object.entries($result.filter.others).map(
                    ([key, item]): void => {
                        const originalItem: Array<any> = item as Array<any>;

                        if (originalItem.length > 0) {
                            originalItem.map(
                                (subItem: any,): void => {
                                    Object.entries(subItem).map(
                                        ([thirdKey]) => {
                                            this.addFormArrayFilter($result.filter.others, 'othersList', key, 'key', 'others', thirdKey);
                                        }
                                    );
                                }
                            );
                        }
                    }
                );
                if (Object.keys($result.forFilter.others).length === this.detailFilterForm.get('othersList').value.length) {
                    this.vm.othersAll = true;
                }
            }

            if ($result.filter.amount) {
                this.setElementPriceSliderFilter($result.filter, 'amount', 'amountList', 'lowestAmount', 'highestAmount');
            }

            // 출발시간
            if (_.has($result.filter, 'time')) {
                if ($result.filter.time.departure) {
                    this.setElementHourTimeSliderFilter($result.filter, 'departure', 'departureList', 'minTime', 'maxTime');
                }

                // 도착시간
                if ($result.filter.time.arrival) {
                    this.setElementHourTimeSliderFilter($result.filter, 'arrival', 'arrivalList', 'minTime', 'maxTime');
                }

                // 경유지 체류시간
                if ($result.filter.time.ground) {
                    this.setElementMinuteTimeSliderFilter($result.filter, 'ground', 'groundList', 'minMinutes', 'maxMinutes');
                }

                // 총 소요시간
                if ($result.filter.time.duration) {
                    this.setElementMinuteTimeSliderFilter($result.filter, 'duration', 'durationList', 'minMinutes', 'maxMinutes');
                }
            }
            console.log('[--- 슬라이더 셋팅 END]]');
        }
    }

    /**
     * 체크된 필터 값 FormArray 에 추가
     * 여러번 필터 적용 시,
     * 이전 필터값이 store에 저장 안되는 현상 방지
     *
     * @param filter hotel/list rs 필터 데이터
     * @param filterKey 필터 아이템명
     * @param vieModelName 뷰모델 아이템명
     * @param keyName 키 아이템명
     * @param subViewModelName?: 기타 필터 키
     * @param subKeyName?: 기타 필터 서브 키
     */
    private addFormArrayFilter(filter: any, filterKey: string, viewModelName: string, keyName: string, subViewModelName?: string, subKeyName?: string): void {
        const formArray: FormArray = this.detailFilterForm.get(`${filterKey}`) as FormArray;
        const newKeyName = subKeyName ? subKeyName : keyName;
        const newViewModelName = subViewModelName ? subViewModelName : viewModelName;
        let totalCount = 0;

        if (filter[viewModelName].length > 0) {
            filter[viewModelName].map(
                (item: any): void => {
                    let originalVal = '';

                    if (item.constructor === Object) {
                        if (subKeyName) {
                            originalVal = `${viewModelName},${subKeyName}`;
                        } else {
                            originalVal = item[newKeyName];
                        }
                    } else {
                        originalVal = item;
                    }

                    formArray.push(new FormControl(originalVal));

                    this.vm[newViewModelName].map(
                        (vmItem: any): any => {
                            if (String(originalVal) === String(vmItem[keyName])) {
                                vmItem.checked = true;
                                totalCount++;
                            } else {

                            }

                            return vmItem;
                        }
                    );
                }
            );

            if (totalCount === this.vm[newViewModelName].length) {
                this.vm[`${newViewModelName}All`] = true;
            }
        }
    }

    /**
     * 화면상에 00:00 ~ 23:59 로 표기
     * @param $filter flight/list -> rs
     * @param $tgStr  출발(departure), 도착(arrival)
     * @param $fbGrpKey formArray Name (ex: formGroup 내의 stopsList, departureList ...)
     * @param $min    rs key Name(minTime)
     * @param $max    rs key Name(maxTime)
     */
    setElementHourTimeSliderFilter($filter, $tgStr, $fbGrpKey, $min, $max) {
        const minTime = $filter['time'][$tgStr][$min];
        const maxTime = $filter['time'][$tgStr][$max];

        // form에 가격 셋팅
        const formArray: FormArray = this.detailFilterForm.get(`${$fbGrpKey}`) as FormArray;
        formArray.push(new FormControl(
            {
                minTime: minTime,
                maxTime: maxTime
            }
        ));

        // hh:mm -> minutes (Ex: 12:30 -> 750분)
        const converMin = _.toNumber((minTime.substr(0, 2) * 60)) + _.toNumber((minTime.substr(3, 2)));
        const converMax = _.toNumber((maxTime.substr(0, 2) * 60)) + _.toNumber((maxTime.substr(3, 2)));

        console.log('converMin >', converMin);
        console.log('converMax >', converMax);

        // 시간 설정
        this.vm[$tgStr].setMin = minTime;
        this.vm[$tgStr].setMax = maxTime;

        // 슬라이더 범위 설정 ( 0분 ~ 1440분 )
        this.vm[`${$tgStr}`].value = [converMin, converMax];
    }

    /**
     * 화면상에 00시간 00분 ~ 23시간 59분으로 표기
     * @param $filter flight/list -> rs
     * @param $tgStr  경유치 체류시간(ground), 총 소요시간(duration))
     * @param $fbGrpKey formArray Name (ex: formGroup 내의 stopsList, departureList ...)
     * @param $min    rs key Name(minTime)
     * @param $max    rs key Name(maxTime)
     */
    setElementMinuteTimeSliderFilter($filter, $tgStr, $fbGrpKey, $min, $max) {
        const minTime = $filter['time'][$tgStr][$min];
        const maxTime = $filter['time'][$tgStr][$max];

        // 시간 설정
        if (minTime < 60) {
            this.vm[$tgStr].setMin[1] = minTime;
            this.vm[$tgStr].setMin[0] = 0;
        } else {
            this.vm[$tgStr].setMin[0] = Math.floor(minTime / 60);
            this.vm[$tgStr].setMin[1] = minTime % 60;
        }

        if (maxTime < 60) {
            this.vm[$tgStr].setMax[0] = 0;
            this.vm[$tgStr].setMax[1] = maxTime;
        } else {
            console.log(maxTime / 60);
            this.vm[$tgStr].setMax[0] = Math.floor(maxTime / 60);
            this.vm[$tgStr].setMax[1] = maxTime % 60;
        }

        // 슬라이더 범위 설정
        this.vm[`${$tgStr}`].value = [minTime, maxTime];

        // form에 가격 셋팅
        const formArray: FormArray = this.detailFilterForm.get(`${$fbGrpKey}`) as FormArray;
        formArray.push(new FormControl(
            {
                minMinutes: minTime,
                maxMinutes: maxTime
            }
        ));
    }

    /**
     * 가격 필터 값 설정
     * @param $filter flight/list -> rs
     * @param $tgStr  가격(amount)
     * @param $fbGrpKey formArray Name (ex: formGroup 내의 stopsList, departureList ...)
     * @param $min    rs 명칭(lowestAmount)
     * @param $max    rs 명칭(highestAmount)
     */
    setElementPriceSliderFilter($filter, $tgStr, $fbGrpKey, $min, $max) {
        const minAmount = $filter[$tgStr][$min];
        const maxAmount = $filter[$tgStr][$max];

        // 가격 설정
        this.vm[$tgStr].setMin = minAmount;
        this.vm[$tgStr].setMax = maxAmount;

        // 슬라이더 범위 설정
        this.vm[`${$tgStr}`].value = [minAmount, maxAmount];

        // form에 fliter값 설정
        const formArray: FormArray = this.detailFilterForm.get(`${$fbGrpKey}`) as FormArray;
        formArray.push(new FormControl(
            {
                lowestAmount: minAmount,
                highestAmount: maxAmount
            }
        ));
    }

    modalClose() {
        this.bsModalRef.hide();
    }

    /**
     * 가격 셋팅
     * @param $val 가격 min($val[0]), max($val[1]) 값
     * @param $trg
     */
    priceSet($val, $trg) {
        this.vm[$trg].setMin = $val[0];
        this.vm[$trg].setMax = $val[1];
    }

    convertMinToHour($convertItem: any) {
        const item: any = {
            value: [$convertItem.minMinutes, $convertItem.maxMinutes],
            min: $convertItem.minMinutes,
            max: $convertItem.maxMinutes,
            setMin: [],
            setMax: [],
            rangeMin: [],
            rangeMax: [],
            slideEvt: this.timeMinuteUpdate,
            ctx: this.ctx
        };

        if ($convertItem.minMinutes < 60) {
            item.setMin[0] = 0;
            item.setMin[1] = $convertItem.minMinutes;
            item.rangeMin[0] = 0;
            item.rangeMin[1] = $convertItem.minMinutes;
        } else {
            item.setMin[0] = Math.floor($convertItem.minMinutes / 60);
            item.setMin[1] = $convertItem.minMinutes % 60;
            item.rangeMin[0] = Math.floor($convertItem.minMinutes / 60);
            item.rangeMin[1] = $convertItem.minMinutes % 60;
        }

        if ($convertItem.maxMinutes < 60) {
            item.setMax[0] = 0;
            item.setMax[1] = $convertItem.maxMinutes;
            item.rangeMax[0] = 0;
            item.rangeMax[1] = $convertItem.maxMinutes;
        } else {
            console.log($convertItem.maxMinutes / 60);
            item.setMax[0] = Math.floor($convertItem.maxMinutes / 60);
            item.setMax[1] = $convertItem.maxMinutes % 60;
            item.rangeMax[0] = Math.floor($convertItem.maxMinutes / 60);
            item.rangeMax[1] = $convertItem.maxMinutes % 60;
        }

        return item;
    }

    /**
     * 상세 검색 변경 여부
     */
    countControls = (control: AbstractControl): number => {
        if (control instanceof FormControl) {
            return 1;
        }

        if (control instanceof FormArray) {
            return control.controls.reduce((acc, curr) => acc + this.countControls(curr), 1);
        }

        if (control instanceof FormGroup) {
            return Object.keys(control.controls)
                .map(key => control.controls[key])
                .reduce((acc, curr) => acc + this.countControls(curr), 0);
        }
    };

    /**
     * onAirLinesMoreClick
     *
     * @param {any} event dom 이벤트
     */
    public onAirLinesMoreClick(event: any): void {
        event && event.preventDefault();

        this.vm.airLineDetail = !this.vm.airLineDetail;
        this.vm.airlinesCount = this.vm.airLineDetail ? 5 : this.vm.airlines.length;
    }


    /**
     * 항공시간 변경
     * @param $val      시간 min($val[0]), max($val[1]) 값
     * @param $trg      출발시간(departure), 도착시간(arrival)
     * @param $trgList  출발시간(departureList), 도착시간(arrivalList)
     */
    timeHourUpdate($val, $trg?, $trgList?) {
        console.log('[SLIDER-LOG > this]', this);
        console.log('[SLIDER-LOG > val]', $val);

        // 시간 셋팅
        this.ctx.timeHourSet($val, $trg);

        // formArray에 저장
        if ($trgList) {
            this.ctx.onSliderHourTimeChange($trgList, $trg);
        }
    }

    /**
     * 시간 셋팅(hour)
     * @param $val 시간 min($val[0]), max($val[1]) 값
     * @param $trg 출발시간(departure), 도착시간(arrival)
     */
    timeHourSet($val, $trg) {
        //24:00 일경우 23:59로 변경( 시간 범위 00:00 ~ 23:59 )
        _.forEach($val, (val, key) => {
            if (val == 1440) {
                $val[key] = 1439;
            }
        });

        // minutes으로 변환(0[00:00] ~ 1440[24:00])
        const setMin = moment.duration($val[0], 'minutes');
        const setMax = moment.duration($val[1], 'minutes');

        // minutes -> HH:mm
        this.vm[$trg].setMin = moment.utc(setMin.asMilliseconds()).format('HH:mm').toString();
        this.vm[$trg].setMax = moment.utc(setMax.asMilliseconds()).format('HH:mm').toString();

        console.log(this.vm[$trg].setMin);
        console.log(this.vm[$trg].setMax);
    }

    // 슬라이더(시간변경(hour))
    onSliderHourTimeChange($trgList, $trg) {
        const formArray: FormArray = this.detailFilterForm.get(`${$trgList}`) as FormArray;
        formArray.clear();
        formArray.push(new FormControl(
            {
                minTime: this.vm[$trg].setMin,
                maxTime: this.vm[$trg].setMax
            }
        ));
    }

    timeMinuteUpdate($val, $trg?, $trgList?) {
        console.log('[SLIDER-LOG > this]', this);
        console.log('[SLIDER-LOG > val]', $val);

        this.ctx.timeMinuteSet($val, $trg);

        if ($trgList) {
            this.ctx.onSliderMinuteTimeChange($trgList, $trg);
        }
    }

    /**
     * 시간 셋팅(minute)
     * @param $val 시간 min($val[0]), max($val[1]) 값
     * @param $trg 경유지 체류시간(ground), 총 소요시간(duration)
     */
    timeMinuteSet($val, $trg) {
        if ($val[0] < 60) {
            this.vm[$trg].setMin[0] = 0;
            this.vm[$trg].setMin[1] = $val[0];
        } else {
            this.vm[$trg].setMin[0] = Math.floor($val[0] / 60);
            this.vm[$trg].setMin[1] = $val[0] % 60;
        }

        if ($val[1] < 60) {
            this.vm[$trg].setMax[0] = 0;
            this.vm[$trg].setMax[1] = $val[1];
        } else {
            console.log($val[1] / 60);
            this.vm[$trg].setMax[0] = Math.floor($val[1] / 60);
            this.vm[$trg].setMax[1] = $val[1] % 60;
        }
    }

    // 슬라이더(시간변경(minute))
    onSliderMinuteTimeChange($trgList, $trg) {
        const formArray: FormArray = this.detailFilterForm.get(`${$trgList}`) as FormArray;
        const min = (this.vm[$trg].setMin[0] * 60) + this.vm[$trg].setMin[1];
        const max = (this.vm[$trg].setMax[0] * 60) + this.vm[$trg].setMax[1];
        formArray.clear();
        formArray.push(new FormControl(
            {
                minMinutes: min,
                maxMinutes: max
            }
        ));
    }

    /**
     * 슬라이드 이벤트 (가격대 변경)
     * @param $val      슬라이드 클릭 값
     * @param $trg      가격대(amount)
     * @param $trgList  가격대 리스트(amountList)
     */
    priceUpdate($val, $trg?, $trgList?) {
        console.log('[SLIDER-LOG > this]', this);
        console.log('[SLIDER-LOG > val]', $val);

        // 가격 셋팅
        this.ctx.priceSet($val, $trg);

        // 슬라이더 stop 이벤트(마우스 클릭 해제, 드래그 해제)
        if ($trgList) {
            this.ctx.onSliderPriceChange($trgList, $trg);
        }
    }

    // form에 데이터 셋팅
    onSliderPriceChange($trgList, $trg) {
        const formArray: FormArray = this.detailFilterForm.get(`${$trgList}`) as FormArray;
        formArray.clear();
        formArray.push(new FormControl(
            {
                lowestAmount: this.vm[$trg].setMin,
                highestAmount: this.vm[$trg].setMax
            }
        ));
    }

    /**
     * onCheckboxChange
     * 체크 박스 체크
     *
     * @param {any} event 폼 이벤트
     * @param {string} formTargetName 전체 선택한 셀렉트
     * @param {string} viewTargetName 전체 선택한 셀렉트
     */
    public onCheckboxChange(event: any, formTargetName: string, viewTargetName: string) {
        event && event.preventDefault();

        const formArray: FormArray = this.detailFilterForm.get(`${formTargetName}`) as FormArray;

        switch (event.target.value) {
            case 'on':
            case 'off':
                formArray.clear();

                this.vm[viewTargetName].map(
                    (item: any) => {
                        if (event.target.checked) {
                            item.checked = true;

                            if (viewTargetName.indexOf('stops') > -1) {
                                formArray.push(new FormControl(item.viaCount));
                            } else if (viewTargetName.indexOf('others') > -1) {
                                formArray.push(new FormControl(item.key));
                            } else {
                                formArray.push(new FormControl(item.code));
                            }
                        } else {
                            item.checked = false;
                        }
                    }
                );

                this.vm[`${viewTargetName}All`] = event.target.checked;
                break;

            default:
                if (event.target.checked) {
                    formArray.push(new FormControl(event.target.value));
                } else {
                    formArray.controls.map(
                        (item: FormControl, index: number) => {
                            if (String(item.value) === String(event.target.value)) {
                                formArray.removeAt(index);
                                return;
                            }
                        }
                    );
                }

                this.vm[viewTargetName].map(
                    (item: any) => {
                        if (viewTargetName.indexOf('stops') > -1) {
                            if (String(item.viaCount) === String(event.target.value)) {
                                item.checked = event.target.checked;
                            }
                        } else if (viewTargetName.indexOf('others') > -1) {
                            if (String(item.key) === String(event.target.value)) {
                                item.checked = event.target.checked;
                            }
                        } else {
                            if (String(item.code) === String(event.target.value)) {
                                item.checked = event.target.checked;
                            }
                        }
                    }
                );

                if (formArray.controls.length === this.vm[viewTargetName].length) {
                    this.vm[`${viewTargetName}All`] = true;
                } else {
                    this.vm[`${viewTargetName}All`] = false;
                }
                break;
        }
    }


    /**
  * 적용하기
  * 1. flight-list-rq 스토어에 저장
  * @param $form
  */
    onSubmit($form: any) {
        setTimeout(() => {
            console.info('[onSubmit]', $form.value);
            console.info('[rqInfo>]', this.rqInfo);

            if (!_.has(this.rqInfo.option.rq, 'condition.filter')) {
                this.rqInfo.option.rq.condition.filter = {};
            }

            this.rqInfo.option.rq.condition.filter.stops = _.map($form.value.stopsList, ($item) => {
                console.log($item);

                return { 'viaCount': $item };
            });
            this.rqInfo.option.rq.condition.filter.airlines = _.map($form.value.airlinesList, ($item) => {
                return { 'code': $item };
            });
            this.rqInfo.option.rq.condition.filter.amount = $form.value.amountList[0];
            this.rqInfo.option.rq.condition.filter.cabinClasses = _.map($form.value.cabinClassesList, ($item) => {
                return { 'code': $item };
            });
            this.rqInfo.option.rq.condition.filter.destinationAirports = _.map($form.value.destinationAirportsList, ($item) => {
                return { 'code': $item };
            });
            this.rqInfo.option.rq.condition.filter.originAirports = _.map($form.value.originAirportsList, ($item) => {
                return { 'code': $item };
            });
            this.rqInfo.option.rq.condition.filter.viaAirports = _.map($form.value.viaAirportsList, ($item) => {
                return { 'code': $item };
            });
            this.rqInfo.option.rq.condition.filter.others = {};
            _.forEach($form.value.othersList, item => {
                console.log('$form.value.othersList >', item);
                if (!_.isEmpty(item)) {
                    let keys = [];
                    keys = item.split(',');
                    console.log('keys >', keys);

                    this.rqInfo.option.rq.condition.filter.others[keys[0]] = [];
                    const addItem: any = {};
                    addItem[keys[1]] = false;

                    this.rqInfo.option.rq.condition.filter.others[keys[0]].push(addItem);
                }
            });

            if (!_.has(this.rqInfo.option.rq, 'condition.filter.time')) {
                this.rqInfo.option.rq.condition.filter.time = {};
            }

            this.rqInfo.option.rq.condition.filter.time.departure = $form.value.departureList[0];
            this.rqInfo.option.rq.condition.filter.time.arrival = $form.value.arrivalList[0];
            this.rqInfo.option.rq.condition.filter.time.ground = $form.value.groundList[0];
            this.rqInfo.option.rq.condition.filter.time.duration = $form.value.durationList[0];

            console.info('[rqInfo]', this.rqInfo.option.rq.condition.filter);
            /**
             * 결과페이지 라어터 이동
             */

            let page = '';
            switch (this.rqInfo.pageId) {
                case 'flightSearchResultGoPage':
                    page = '/flight-search-result-go/';
                    break;
                case 'flightSearchResultComePage':
                    page = '/flight-search-result-come/';
                    break;
                case 'flightSearchResultMultiPage':
                    page = '/flight-search-result-multi/';
                    break;
                default:
                    break;
            }

            const formArrayKey = Object.keys(this.detailFilterForm.controls);
            const formArrayCnt = formArrayKey.length;

            // 상세 검색 변경 여부
            if (formArrayCnt < this.countControls(this.detailFilterForm)) {
                this.rqInfo.option.detailUpdate = 'true';
            }

            // const base64Str = this.base64Svc.base64EncodingFun(this.rqInfo.option);

            const queryString = qs.stringify(this.rqInfo.option);
            console.log('queryString >', queryString);

            const path = page + queryString;

            // 페이지 이동후 생명주기 재실행
            this.router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(() => this.router.navigate([path]));

            this.modalClose();

        });
    }

    /**
     * resetModalData
     * 모델 초기화
     */
    private resetModalData(): void {
        this.mainFormCreate();
        // 요금 초기화
        Object.entries(this.vm).map(
            ([key, item]) => {
                if (
                    this.vm[key] !== undefined &&
                    this.vm[key] !== null
                ) {
                    if (key.indexOf('All') > -1) {
                        this.vm[key] = false;
                    } else if (item && (item.constructor === Array)) {
                        this.vm[key].map(
                            (subItem: any) => {
                                subItem.checked = false;
                            }
                        );
                    } else {
                        // tslint:disable-next-line: switch-default
                        switch (key) {
                            case 'amount':
                                this.vm[key] = {
                                    value: [this.amountMin, this.amountMax],  // 슬라이더 값 범위
                                    min: this.amountMin,       // 슬라이더 선택 값 (최소 금액)
                                    max: this.amountMax,      // 슬라이더 선택 값 (최대 금액)
                                    setMin: this.amountMin,    // 슬라이더 상단 현재 선택 값 표시(최소 금액)
                                    setMax: this.amountMax,   // 슬라이더 상단 현재 선택 값 표시(최대 금액)
                                    rangeMin: this.amountMin,  // 슬라이더 하단 범위 (최소 금액)
                                    rangeMax: this.amountMax, // 슬라이더 하단 범위 (최대 금액)
                                    slideEvt: this.priceUpdate,                       // 슬라이더 이벤트
                                    ctx: this.ctx                                     // 현재(현 컴포넌트) 페이지 지시자(슬라이더는 다른 컴포넌트 페이지)
                                };
                                break;

                            // 출발시간
                            case 'departure':
                            // 도착시간
                            case 'arrival':
                                this.vm[key] = {
                                    value: [0, 1440],
                                    setMin: '00:00',
                                    setMax: '23:59',
                                    slideEvt: this.timeHourUpdate,
                                    ctx: this.ctx
                                };
                                break;

                            case 'ground':
                            case 'duration':
                                this.vm[key] = this.convertMinToHour(this[key]);
                                break;
                        }
                    }
                }
            }
        );
    }

    /**
    * onReloadClick
    * 필터 초기화
    *
    * @param {any} event 폼 이벤트
    */
    public onReloadClick(event: any): void {
        event && event.preventDefault();

        this.resetModalData();
    }

    /**
    * onCloseClick
    * 팝업 닫음
    *
    * @param {any} event 폼 이벤트
    */
    public onCloseClick(event: any): void {
        event && event.preventDefault();

        this.modalClose();
    }
}