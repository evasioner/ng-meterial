import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { upsertAirtelModalTravelerOption } from 'src/app/store/airtel-common/airtel-modal-traveler-option/airtel-modal-traveler-option.actions';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AirtelModalChildrenInformationComponent } from '../airtel-modal-children-information/airtel-modal-children-information.component';

@Component({
    selector: 'app-airtel-modal-traveler-option',
    templateUrl: './airtel-modal-traveler-option.component.html',
    styleUrls: ['./airtel-modal-traveler-option.component.scss']
})
export class AirtelModalTravelerOptionComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Input() selectedOption: any;

    storeModel: any;

    modalTravelerOption$: Observable<any>;  // 좌석등급, 인원 수

    travelerOptionSub: Subscription;        // 좌석등급, 인원 수

    modalRef2: BsModalRef;

    rxAlive: any = true;

    vm: any = {
        cabinClassCode: 'Y',
        cabinClassNm: '일반석',
        cabinClassTxt: '',
        classList: [
            {
                classCode: 'Y',
                classNm: '일반석'
            },
            {
                classCode: 'W',
                classNm: '프리미엄 일반석'
            },
            {
                classCode: 'C',
                classNm: '비즈니스석'
            },
            {
                classCode: 'F',
                classNm: '일등석'
            }
        ],
        adultCount: 1,
        childCount: 0,
        infantCount: 0
    };

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private store: Store<any>,
        public bsModalRef: BsModalRef,
        private bsModalService: BsModalService
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        this.vmInit();
    }

    /**
     * 모달이 제거될때 생성한 항목 삭제
     */
    ngOnDestroy(): void {
        console.info('[좌석등급, 인원 수 MODAL CLOSE]');

        this.rxAlive = false;

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }

    vmInit() {
        console.log('selectedOption >', this.selectedOption);
        this.vm.cabinClassCode = this.selectedOption.cabinClassCode;
        this.vm.adultCount = Number(this.selectedOption.adultCount);
        this.vm.childCount = Number(this.selectedOption.childCount);
        this.vm.infantCount = Number(this.selectedOption.infantCount);
    }

    modelInit() {
        // 업데이트 모델 초기화
        this.storeModel = {
            id: 'travelerOption',
            option: this.vm
        };
    }

    /**
       * 데이터 추가 | 업데이트
       * action > key 값을 확인.
       */
    upsertOne($obj) {
        this.store.dispatch(upsertAirtelModalTravelerOption({
            airtelModalTravelerOption: $obj
        }));
    }


    txtSet() {
        this.vm.cabinClassTxt = `${this.vm.cabinClassNm}, `;
        let travelerCount = '';

        if (this.vm.adultCount > 0) {
            travelerCount = `성인${this.vm.adultCount}명`;
        }
        if (this.vm.childCount > 0) {
            travelerCount += ` 아동${this.vm.childCount}명`;
        }
        if (this.vm.infantCount > 0) {
            travelerCount += ` 유아${this.vm.infantCount}명`;
        }

        this.vm.cabinClassTxt += travelerCount;
        console.info('[cabinClassTxt >]', this.vm.cabinClassTxt);
    }

    onSeatChange(classCode: string, classNm: string) {
        this.vm.cabinClassCode = classCode;
        this.vm.cabinClassNm = classNm;
        console.info('[selected Seat] > ', this.vm.cabinClassCode + this.vm.cabinClassNm);
    }

    onSeatDesc() {
        this.modalRef2 = this.bsModalService.show(AirtelModalChildrenInformationComponent);
    }

    modalClose() {
        this.bsModalRef.hide();
    }

    /**
     * 탑승인원 카운트
     * 최대 9명 (성인 + 아동 + 유아)
     * 성인은 최소1명 포함
     * @param type
     * @param event
     */
    onChangeCount(type: string, event: string) {
        console.info('[onChangeCount type>]', type);
        console.info('[onChangeCount event>]', event);

        if (this.vm.adultCount + this.vm.childCount + this.vm.infantCount == 9 && event == 'up') {
            alert('예약당 최대 인원수는 9명입니다. 9명을 초과하는 경우 별도로 에약하시기 바랍니다.');
            return;
        }

        switch (type) {
            case 'adult':
                if (event == 'up') {
                    if (this.vm.adultCount < 9) {
                        this.vm.adultCount += 1;
                    }
                } else {
                    if (this.vm.adultCount > 1) {
                        this.vm.adultCount -= 1;
                    }
                }
                break;
            case 'kid':
                if (event == 'up') {
                    if (this.vm.childCount < 4) {
                        this.vm.childCount += 1;
                    }
                } else {
                    if (this.vm.childCount > 0) {
                        this.vm.childCount -= 1;
                    }
                }
                break;
            case 'child':
                if (event == 'up') {
                    if (this.vm.infantCount < 2) {
                        this.vm.infantCount += 1;
                    }
                } else {
                    if (this.vm.infantCount > 0) {
                        this.vm.infantCount -= 1;
                    }
                }
                break;
        }
    }

    //적용하기
    onSubmit() {
        // 0. cabinClassTxt 셋팅
        this.txtSet();

        // 1. 모델 셋팅
        this.modelInit();

        // 2. 모델에 데이터 셋팅
        this.upsertOne(this.storeModel);

        // 3. 모달 닫기
        this.modalClose();
    }

}