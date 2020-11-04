import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT, Location } from '@angular/common';
import { takeWhile, take } from 'rxjs/operators';

import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import * as travelerOptionSelector from 'src/app/store/hotel-common/hotel-modal-traveler-option/hotel-modal-traveler-option.selectors';
import { upsertHotelModalTravelerOption } from 'src/app/store/hotel-common/hotel-modal-traveler-option/hotel-modal-traveler-option.actions';
import * as hotelSearchResultPageSelectors from 'src/app/store/hotel-search-result-page/hotel-search-result/hotel-search-result.selectors';
import * as hotelSearchRoomtypePageSelectors from 'src/app/store/hotel-search-roomtype-page/hotel-search-roomtype/hotel-search-roomtype.selectors';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HotelModalChildrenInformationComponent } from '../hotel-modal-children-information/hotel-modal-children-information.component';

@Component({
    selector: 'app-hotel-modal-traveler-option',
    templateUrl: './hotel-modal-traveler-option.component.html',
    styleUrls: ['./hotel-modal-traveler-option.component.scss']
})
export class HotelModalTravelerOptionComponent extends BaseChildComponent implements OnInit, OnDestroy {

    updateModel: object;

    rxAlive: boolean = true;
    loadingBool: boolean = false;

    /**
   * 호텔 재검색 에서 모달창 오픈 시
   * isResearch = true
   */
    isResearch: boolean = false;

    /**
    * 룸타입 선택 페이지 에서 모달창 오픈 시
    * isRoomtype= true
    */
    isRoomtype: boolean = false;

    hotelListRq: any;
    hotelRoomtypeRq: any;
    hotelTravelerOpt: any;
    modalTravelerOpt: any;

    hotelListRq$: Observable<any>;
    hotelRoomtypeRq$: Observable<any>;
    hotelTravelerOpt$: Observable<any>;  // 좌석등급, 인원 수

    vm: any = {
        id: 'hotelTravelerOption',
        header: {
            txt: '인원선택',
            reloadTxt: '새로고침',
            closeTxt: '닫기'
        },
        room: {
            title: '객실 ',
            childrenInfo: '아동 예약 안내',
            delTxt: '삭제',
            adultTxt: '성인',
            adultDesc: '만12세 이상',
            childrenTxt: '아동',
            childrenDesc: '만12세 미만',
            ageSelTxt: ' 나이 선택',
            appTxt: '적용하기',
            roomAddTxt: '객실 추가',
            upTxt: 'UP',
            downTxt: 'DOWN',
            ageList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        },
        roomList: []
    };
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private route: ActivatedRoute,
        private store: Store<any>,
        private bsModalService: BsModalService,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
        this.subscriptionList = [];
    }

    ngOnInit(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        this.loadingBool = true;

        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.info('[1. route 통해 데이터 전달 받기]' + data);
                        if (data.resolveData) {
                            this.isResearch = data.resolveData.isResearch;
                            this.isRoomtype = data.resolveData.isRoomtype;
                        }
                    }
                )
        );

        this.observableInit();
        this.subscribeInit();
        this.setFilterData();
    }

    /**
     * 모달이 제거될때 생성한 항목 삭제
     */
    ngOnDestroy(): void {
        this.rxAlive = false;
        console.info('[ngOnDestroy > rxAlive]', this.rxAlive);
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
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

        if (this.isRoomtype) {
            this.hotelRoomtypeRq$ = this.store
                .pipe(select(hotelSearchRoomtypePageSelectors.getSelectId('hotel-roomtype-rq-info')));
        } else {
            this.hotelListRq$ = this.store
                .pipe(select(hotelSearchResultPageSelectors.getSelectId('hotel-list-rq-info')));
        }
        this.hotelTravelerOpt$ = this.store.select(
            travelerOptionSelector.getSelectId(['hotelTravelerOption'])
        );
    }


    subscribeInit() {
        if (this.isRoomtype) {
            this.subscriptionList.push(
                this.hotelRoomtypeRq$
                    .pipe(takeWhile(() => this.rxAlive))
                    .subscribe(
                        (ev: any) => {
                            console.info('[hotelRoomtyRq observableInit > subscribe]', ev);
                            if (ev) {
                                this.hotelRoomtypeRq = _.cloneDeep(ev.res);
                            }
                        }
                    )
            );
        } else {
            this.subscriptionList.push(
                this.hotelListRq$
                    .pipe(takeWhile(() => this.rxAlive))
                    .subscribe(
                        (ev: any) => {
                            console.info('[hotelListRq observableInit > subscribe]', ev);
                            if (ev) {
                                this.hotelListRq = _.cloneDeep(ev.res);
                            }
                        }
                    )
            );
        }

        this.subscriptionList.push(
            this.hotelTravelerOpt$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[hotelTravelerOpt$ observableInit > subscribe]', ev);
                        if (ev) {
                            this.hotelTravelerOpt = _.cloneDeep(ev);
                        }
                    }
                )
        );
    }

    setFilterData() {
        if (this.hotelTravelerOpt) {  //모달 창에서 선택된 필터 값
            console.info('main');
            this.modalTravelerOpt = this.hotelTravelerOpt;
        } else if (this.isResearch) {
            console.info('isResearch');
            /**
             * result page > 모달창 오픈 시,
             * 필터값 있으면 셋팅
             */
            this.modalTravelerOptInit(this.hotelListRq.roomList);
        } else if (this.isRoomtype) {
            console.info('isRoomtype');
            /**
             * roomty page > 모달창 오픈 시,
             * 필터값 있으면 셋팅
             */
            this.modalTravelerOptInit(this.hotelRoomtypeRq.roomList);
        }

        /**
         * 선택한 필터가 있을 경우
         * 값 셋팅
         */
        if (this.modalTravelerOpt) { // 선택한 필터가 있을 경우
            setTimeout(() => {

                //인원정보
                const personnelInfo = _.split(this.modalTravelerOpt.roomList, '@');
                _.forEach(personnelInfo, (item) => {
                    const childAges: any = [];

                    const pSplit = _.split(item, '^');
                    if (_.toNumber(pSplit[1]) > 0) {
                        const cAgeSplit = _.split(pSplit[2], ',');
                        _.forEach(cAgeSplit, (item2) => {
                            childAges.push(_.toNumber(item2));
                        });
                    }

                    this.vm.roomList.push({
                        adultCount: _.toNumber(pSplit[0]),
                        childAges: childAges
                    });
                });
            }, 500);
        } else {
            this.vm.roomList.push({
                adultCount: 2,
                childAges: []
            });
        }

    }

    modelInit($personnelInfo) {
        // 업데이트 모델 초기화
        console.info('modelInit');
        this.updateModel = {
            id: 'hotelTravelerOption',
            roomList: $personnelInfo
        };
    }

    modalTravelerOptInit($roomList) {
        this.modalTravelerOpt = {
            id: 'hotelTravelerOption',
            roomList: $roomList
        };

    }


    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertHotelModalTravelerOption({
            hotelModalTravelerOption: $obj
        }));
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onReloadClick(event: MouseEvent) {
        event && event.preventDefault();

        console.info('초기화');
        this.vm.roomList = [];
        this.vm.roomList.push({
            adultCount: 2,
            childAges: []
        });
    }

    onCloseClick(event: MouseEvent) {
        event && event.preventDefault();

        console.info('모달 닫기');
        this.modalClose();
    }

    move() {
        console.info('[호텔 메인 >> 상세 검색 모달]');
        // 모달 전달 데이터
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalService.show(HotelModalChildrenInformationComponent, { ...configInfo });
    }

    // 인원 변경
    onChangeCount(type: string, upNdown: string, idx: number) {
        console.info('onChangeCount');
        switch (type) {
            case 'adult':
                if (upNdown === 'up') {
                    if (this.vm.roomList[idx].adultCount < 9) {
                        this.vm.roomList[idx].adultCount += 1;
                    }
                } else {
                    if (this.vm.roomList[idx].adultCount === 1) break;
                    this.vm.roomList[idx].adultCount -= 1;
                }
                break;
            case 'children':
                if (upNdown === 'up') {
                    if (this.vm.roomList[idx].childAges.length < 4) {
                        this.vm.roomList[idx].childAges.push([]);
                    }

                    console.info(this.vm.roomList[idx].childAges);
                } else {
                    if (this.vm.roomList[idx].childAges.length > 0) {
                        this.vm.roomList[idx].childAges.pop();
                    }
                }
                break;
        }
    }

    //아동 나이 변경
    onChageAge(event: any, roomIdx: number, childrenIdx: number) {
        const age = event.target.value;
        this.vm.roomList[roomIdx].childAges[childrenIdx] = _.toNumber(age);
    }

    // 객실 추가
    addRoom() {
        const roomNum = this.vm.roomList.length;
        if (roomNum < 9) {
            this.vm.roomList.push(
                {
                    adultCount: 2,
                    childAges: []
                }
            );
        }
    }

    // 객실 제거
    removeRoom(idx: number) {
        this.vm.roomList = this.vm.roomList.filter((m, i) => idx !== i);
    }

    //적용하기
    onSubmit() {
        console.info('[onSubmit] 적용하기');

        const roomNum: number = this.vm.roomList.length;
        let adultNum: number = 0;
        let childNum: number = 0;

        let personnelInfo: any = '';
        for (let i = 0; i < roomNum; i++) {
            const room = this.vm.roomList[i];
            room.childCount = room.childAges.length;
            childNum += room.childCount;
            adultNum += _.toNumber(room.adultCount);
            personnelInfo += (_.toNumber(room.adultCount) + '^' + room.childAges.length) + '^';
            if (room.childAges.length > 0)
                personnelInfo += (room.childAges);
            if (i < roomNum - 1)
                personnelInfo += '@';

            for (let j = 0; j < room.childAges.length; j++) {
                const cObj = room.childAges[j];
                if (!_.isNumber(cObj)) {
                    const rNum = i + 1;
                    const cNum = j + 1;
                    const message = '객실' + rNum + '의 ' + cNum + '아동 나이를 선택해주세요.';
                    alert(message);
                    return false;
                }
            }
        }

        if (adultNum > 9) {
            alert('성인은 총 9명까지만 예약 가능합니다.');
            return false;
        }

        if (childNum > 4) {
            alert('아동은 총 4명까지만 예약 가능합니다.');
            return false;
        }


        this.modelInit(personnelInfo);
        // 데이터 업데이트
        console.info('[onSubmit > upsertOne]');
        this.upsertOne(this.updateModel);

        this.modalClose();
    }

}
