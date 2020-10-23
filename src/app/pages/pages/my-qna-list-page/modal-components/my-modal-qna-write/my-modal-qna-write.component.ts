import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
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

import { upsertMyMileage } from 'src/app/store/my-mileage/my-mileage/my-mileage.actions';

@Component({
    selector: 'app-my-modal-qna-write',
    templateUrl: './my-modal-qna-write.component.html',
    styleUrls: ['./my-modal-qna-write.component.scss']
})
export class MyModalQnaWriteComponent extends BaseChildComponent implements OnInit {
    private subscriptionList: Subscription[];
    private dataModel: any;
    public viewModel: any;

    resolveData: any;
    mainForm: FormGroup; // 생성된 폼 저장
    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public translateService: TranslateService,
        public bsModalRef: BsModalRef,
        public bsModalService: BsModalService,
        private apiMypageService: ApiMypageService,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: ApiAlertService,
        private store: Store<any>,
        private fb: FormBuilder,

    ) {
        super(platformId);
        this.initialize();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.mainFormCreate();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveData = _.cloneDeep(data.resolveData);

                        console.info('[1. route 통해 데이터 전달 받기]', data);
                        this.pageInit(data.resolveData);
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

    private initialize() {
        this.dataModel = {};
        this.viewModel = {};
        this.subscriptionList = [];

    }
    /**
     * 페이지 초기화
     *  api 호출 (
     * @param resolveData
     */
    async pageInit(resolveData) {
        this.resolveData = _.cloneDeep(resolveData);
        console.log(this.resolveData, 'this.resolveData');
        const rqInfo =
        {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                userNo: 1,
                limits: [0, 10]
            }
        };
        this.getQnaList(rqInfo);

    }

    getQnaList(rq) {
        this.subscriptionList.push(
            this.apiMypageService.POST_QNA(rq)
                .subscribe(
                    (resp: any) => {
                        if (resp.succeedYn) {
                            this.dataModel.response = _.cloneDeep(resp.result);
                            this.dataModel.transactionSetId = resp.transactionSetId;
                            this.upsertOne({
                                id: 'my-qna-list',
                                result: this.dataModel.response
                            });
                        } else {
                            this.alertService.showApiAlert(resp.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                )
        );

    }

    upsertOne($obj) {
        this.store.dispatch(upsertMyMileage({
            myMileage: $obj
        }));
    }



    mainFormInit() {
        this.mainFormCreate();
    }
    mainFormCreate() {
        this.mainForm = this.fb.group({
            selectQna: ['', [Validators.required]],
            selectNumber: ['', [Validators.required]],
            selectCounsel: ['', [Validators.required]],
            counselContent: ['', [Validators.required]],
        });

        console.log(this.mainForm, 'this.mainForm');

    }
    onSubmit(form: any) {
        this.goToPage(form);
    }

    goToPage(form) {

        const path = '/my-qna-list/';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);

    }

    writeComplete() {
        this.modalClose();
        this.mainForm.getRawValue();
        console.log(this.mainForm, 'this.mainForm');
    }
}
