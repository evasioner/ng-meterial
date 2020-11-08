import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { DOCUMENT, Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from '@/environments/environment';
import { JwtService } from 'src/app/common-source/services/jwt/jwt.service';

import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
    selector: 'app-my-modal-reservation-qna-write',
    templateUrl: './my-modal-reservation-qna-write.component.html',
    styleUrls: ['./my-modal-reservation-qna-write.component.scss']
})
export class MyModalReservationQnaWriteComponent extends BaseChildComponent implements OnInit {
    private subscriptionList: Subscription[];
    private dataModel: any;
    public viewModel: any;
    element: any;
    $element: any;
    mainForm: FormGroup; // 생성된 폼 저장
    bookingItemCode: any;
    typeCode: any;
    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        @Inject(DOCUMENT) private document: Document,
        private store: Store<any>,
        public translateService: TranslateService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private el: ElementRef,
        public bsModalRef: BsModalRef,
        public jwtService: JwtService,
        private apiMypageService: ApiMypageService,
        private alertService: ApiAlertService,
    ) {
        super(platformId);
        this.element = this.el.nativeElement;
        this.initialize();
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        this.route.params.subscribe(params => {
          this.rqCode = params['currency'];
        });

    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick() {
        this.modalClose();
    }

    private async initialize() {
        this.dataModel = {};
        this.viewModel = {};
        this.typeCode = {
            IC01: [
                '예약문의', '결제문의', '변경문의', '취소문의', '기타'
            ],
            IC02: [
                '예약문의', '결제문의', '취소문의', '기타'
            ],
            IC03: [
                '예약문의', '결제문의', '취소문의', '기타'
            ],
            IC04: [
                '예약문의', '결제문의', '배송문의', '취소문의', '기타'
            ]
        };
        console.log(this.typeCode, 'typeCode');

    }

    mainFormCreate() {
        this.mainForm = this.fb.group({
            consultingTypeCode: new FormControl('', [Validators.required]),
            questionDetail: new FormControl('', [Validators.required]),
        });
    }

    async writeComplete() {
        const userInfoRes = await this.jwtService.getUserInfo();
        const rqInfo =
        {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                consultingCategoryCode: this.mainForm.get('postCategoryCode').value,
                consultingTypeCode: 'CS001',
                userNo: userInfoRes.result.user.userNo,
                smsReceiveYn: true,
                questionTitle: 'title',
                questionDetail: this.mainForm.get('questionDetail').value,
                bookingItemCode: this.bookingItemCode,
            },
        };

        this.subscriptionList.push(
            this.apiMypageService.PUT_CONSULTING(rqInfo)
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            this.modalClose();
                            this.dataModel.response = _.cloneDeep(res.result);
                            this.dataModel.transactionSetId = res.transactionSetId;
                            this.dataModel.form = this.mainForm;
                            console.log('성공이다~~~~');

                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        console.log('error');
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                )
        );
        this.mainForm.getRawValue();
        console.log(rqInfo, 'rqInfo');
        console.log(this.mainForm.getRawValue(), 'this.mainForm.getRawValue()');

    }

}
