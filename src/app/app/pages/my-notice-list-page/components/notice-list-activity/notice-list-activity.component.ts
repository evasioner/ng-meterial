import { Component, OnInit, Input, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { LoadingBarService } from '@ngx-loading-bar/core';

import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { CommonModalAlertComponent } from 'src/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { MyModalNoticeViewComponent } from '../../modal-components/my-modal-notice-view/my-modal-notice-view.component';
import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-notice-list-activity',
    templateUrl: './notice-list-activity.component.html',
    styleUrls: ['./notice-list-activity.component.scss']
})
export class NoticeListActivityComponent extends BaseChildComponent implements OnInit, OnDestroy {
    loadingBool: Boolean = false;
    result: any;
    cateResult: any[] = [];
    noticeList: any[] = [];
    flightNoticeList: any[] = [];
    hotelNoticeList: any[] = [];
    activityNoticeList: any[] = [];
    rentNoticeList: any[] = [];
    pagePath: any;
    totalCount = 0;
    totalListCount = 0;
    checkBoxValue: boolean = true;
    limitStart = 0;
    limitEnd = 10;
    pageCount = 10;
    resolveData$: Observable<any>;
    selTab: any;
    infiniteScrollConfig: any = {
        distance: 0,
        throttle: 300
    };
    mainForm: FormGroup; // 생성된 폼 저장
    vm: any = {
        searchStr: null
    };
    rxAlive: boolean = true;
    bsModalRef: BsModalRef;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private fb: FormBuilder,
        private apiMypageService: ApiMypageService,
        private loadingBar: LoadingBarService,
        private bsModalService: BsModalService,
        private alertService: ApiAlertService
    ) {
        super(platformId);
    }

    @Input() resolveData: any;

    ngOnInit(): void {
        // this.callReservationtListApi();
        console.info('all-resolveData >>>>>>>>>>>>>>>', this.resolveData);
        this.increase();
        this.mainFormInit();
    }

    ngOnDestroy() {
        this.rxAlive = false;
    }

    searchForm() {
        this.totalListCount = 0;
        this.limitStart = 0;
        this.limitEnd = 10;
        this.noticeList = [];
        this.increase();
    }

    // API 호출 전체 예약리스트
    async callNoticeListApi(cate) {
        const $rq = {
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                'postCategoryCode': 'IC04',
                'searchItem': 'A',
                'keyword': this.vm.searchStr,
                'limits': [this.limitStart, this.limitEnd]
            }
        };

        if (!this.vm.searchStr) {
            delete $rq.condition.searchItem;
            delete $rq.condition.keyword;
        }

        if (this.totalCount === 0) {  //처음 로딩시에만 안보이게 처리하고 무한스크롤로 추가될때는 true상태로 진행됨
            this.loadingBool = false;
        }
        this.loadingBar.start();
        console.info('$rq >>>>>>>>>', $rq);
        return this.apiMypageService.POST_MYPAGE_NOTICE($rq)
            .toPromise()
            .then((res: any) => {
                console.info('[공지사항 액티비티리스트 > res]', res);

                if (res.succeedYn) {
                    this.limitStart += this.pageCount;
                    this.limitEnd += this.pageCount;
                    console.info('limitStart>>>', $rq.condition.limits[0]);
                    console.info('limitEnd>>>', $rq.condition.limits[1]);
                    this.loadingBool = true;
                    this.loadingBar.complete();
                    return res;
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err);
            });
    }

    async increase() {
        // //  * IC01,   // 항공
        // //  * IC02,   // 호텔
        // //  * IC03,   // 렌터카
        // //  * IC04,   // 티켓/투어, 액티비티
        // //  * IC05,   // 묶음할인
        if (this.totalCount !== 0 && this.totalCount < this.pageCount) {  // totalCount != 0 (첫번째 api 호출)이 아니고
            alert('마지막 데이터입니다.');
            return false;                                                   // api결과 갯수가 pageCount보다 작으면 마지막 data로 봄
        }
        this.result = await this.callNoticeListApi(null);
        console.info('this.result>>>>>', this.result);

        const tmpCateResult = await this.result.result.list;      // api에서 limit갯수로 받아온 리스트
        this.noticeList = this.noticeList.concat(tmpCateResult);  // cateResult에 tmpCateResult 가 concat 된 리스트
        this.totalCount = this.result.result.totalCount;              // api 결과값의 totalCount
        this.totalListCount = Object.keys(this.noticeList).length;    // cateResult 총 갯수
        console.info('totalListCount>>>>>', this.totalListCount);
        console.info('flightNoticeList>>>>>', this.flightNoticeList);
        console.info('noticeList>>>>>', this.noticeList);
    }

    selectDetail($event) {
        (<HTMLInputElement>event.target).closest('.btn-detail-view').classList.toggle('active');
    }

    onScroll() {
        this.increase();
    }

    /**
     * 폼 초기화
     */
    mainFormInit() {
        this.mainFormCreate();
        this.mainForm.patchValue({
            searchStr: this.vm.searchStr
        });
    }

    mainFormCreate() {
        this.mainForm = this.fb.group({
            searchStr: [this.vm.searchStr, Validators.required], // 렌터카 인수 장소
            // driverBirthday: [this.vm.driverBirthday, [
            //     Validators.required,
            //     Validators.pattern('^(19[0-9][0-9]|20\\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$')
            // ]]

        });

    }

    onSubmit($form: any) {
        console.info('$form.value.searchStr >>>>>>>', $form.value.searchStr);
        if ($form.value.searchStr) {
            setTimeout(() => {
                console.info('[onSubmit]', $form, $form.value);
                console.info('$form.value  >>>>>>', $form.value);
                console.info('[vm]', this.vm);
                this.vm.searchStr = $form.value.searchStr;
                this.searchForm();
            });
        } else {
            this.onAlertClick();
        }
    }

    detailView(postSeq) {
        const initialState = {
            postSeq: postSeq,
            list: [],
            title: 'notice detail'
        };
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalRef = this.bsModalService.show(MyModalNoticeViewComponent, { initialState, ...configInfo });
    }

    onAlertClick() {
        /**
         * titleTxt string | 필수
         * alertHtml string | html 형식으로 작성 |
         * okObj: { name: '', fun: function }
         * cancelObj: { name: '', fun: function }
         */
        const initialState = {
            titleTxt: '검색어.',
            alertHtml: '검색어를 입력해주세요.',
            // okObj: {
            //     fun: () => {
            //       this.pageFun();
            //     }
            // },
            // cancelObj: {
            //   name: '',
            //   fun: null
            // }
        };
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
    }

}

