import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { environment } from '@/environments/environment';

import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { ApiBookingService } from '../../../../api/booking/api-booking.service';
import { upsertMyMileage } from 'src/app/store/my-mileage/my-mileage/my-mileage.actions';

import { JwtService } from 'src/app/common-source/services/jwt/jwt.service';
import { PostCategoryCode, CategoryList } from '@/app/common-source/models/my-qna/post-category-code.model';
import { BoardMaster, BoardMasterList } from '@/app/common-source/models/my-qna/board-master.model';

@Component({
    selector: 'app-my-modal-qna-write',
    templateUrl: './my-modal-qna-write.component.html',
    styleUrls: ['./my-modal-qna-write.component.scss']
})
export class MyModalQnaWriteComponent extends BaseChildComponent implements OnInit {
    private subscriptionList: Subscription[];
    private dataModel: any;
    public viewModel: any;
    public boardMaster: BoardMaster[];
    public postCategoryCode: PostCategoryCode[];
    resolveData: any;
    mainForm: FormGroup; // 생성된 폼 저장
    bookingForm: FormGroup;

    totalCount = 0;
    totalListCount = 0;
    checkBoxValue: boolean = true;
    limitStart = 0;
    limitEnd = 10;
    pageCount = 10;
    userInfoRes: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public translateService: TranslateService,
        public bsModalRef: BsModalRef,
        public bsModalService: BsModalService,
        private apiMypageService: ApiMypageService,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: ApiAlertService,
        private store: Store<any>,
        private fb: FormBuilder,
        private apiBookingService: ApiBookingService,
        public jwtService: JwtService,
    ) {
        super(platformId);
        this.initialize();
        this.mainFormCreate();
    }


    ngOnInit(): void {
        super.ngOnInit();


        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveData = _.cloneDeep(data.resolveData);
                        console.info('[1. route 통해 데이터 전달 받기]', data);
                    }
                )
        );

    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
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
        this.postCategoryCode = CategoryList;
        this.boardMaster = BoardMasterList;
        this.subscriptionList = [];
        this.userInfoRes = await this.jwtService.getUserInfo();
    }


    upsertOne($obj) {
        this.store.dispatch(upsertMyMileage({
            myMileage: $obj
        }));
    }

    mainFormCreate() {
        this.mainForm = this.fb.group({
            postCategoryCode: new FormControl('', [Validators.required]),
            selectNumber: new FormControl('', [Validators.required]),
            boardMasterSeq: new FormControl(0, [Validators.required]),
            postTitle: new FormControl('', [Validators.required]),
            postDetail: new FormControl('', [Validators.required]),
        });

        console.log(this.mainForm, 'this.mainForm');
    }

    onSubmit(form: any) {
        if (this.mainForm.valid) {
            this.goToPage(form);
        } else {

        }
    }

    goToPage(form) {
        const path = '/my-qna-list/';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);

    }

    async writeComplete() {

        const rqInfo =
        {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                boardMasterSeq: Number(this.mainForm.get('boardMasterSeq').value),
                postCategoryCode: this.mainForm.get('postCategoryCode').value,
                userNo: this.userInfoRes.result.user.userNo,
                postTitle: this.mainForm.get('postTitle').value,
                postDetail: this.mainForm.get('postDetail').value,
                bookingItemCode: this.mainForm.get('selectNumber').value
            },
        };

        this.subscriptionList.push(
            this.apiMypageService.PUT_QNA(rqInfo)
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            this.modalClose();
                            this.dataModel.response = _.cloneDeep(res.result);
                            this.dataModel.transactionSetId = res.transactionSetId;
                            this.dataModel.form = this.mainForm;
                            console.log('성공이다~~~~');

                            this.upsertOne({
                                id: 'my-qna-list',
                                result: this.dataModel.response
                            });

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


    public changeCategory(event: MouseEvent) {
        event && event.preventDefault();

        if (this.mainForm.value.postCategoryCode === '') {
            this.mainFormCreate();
        } else {

            this.setBookingList();
        }
    }

    private setBookingList() {

        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                userNo: this.userInfoRes.result.user.userNo,
                excludeCancelYn: true,
                limits: [0, 10],
                itemCategoryCode: this.mainForm.value.postCategoryCode
            },

        };


        this.subscriptionList.push(
            this.apiMypageService.POST_BOOKING_LIST(rq)
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            this.viewModel.list = _.cloneDeep(res.result.list);
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err);
                    }
                )
        );

    }
}

