import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { JwtService } from 'src/app/common-source/services/jwt/jwt.service';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { MyModalReservationQnaViewComponent } from './modal-components/my-modal-reservation-qna-view/my-modal-reservation-qna-view.component';
import { MyModalReservationQnaWriteComponent } from './modal-components/my-modal-reservation-qna-write/my-modal-reservation-qna-write.component';
import { environment } from '@/environments/environment';



@Component({
    selector: 'app-my-reservation-qna-list-page',
    templateUrl: './my-reservation-qna-list-page.component.html',
    styleUrls: ['./my-reservation-qna-list-page.component.scss']
})
export class MyReservationQnaListPageComponent extends BasePageComponent implements OnInit, OnDestroy {

    headerType: any;
    headerConfig: any;
    result: any;
    bsModalRef: BsModalRef;
    rxAlive: boolean = true;
    loadingBool: Boolean = false;
    resolveData: any;
    cateResult: any[] = [];
    totalCount = 0;
    totalListCount = 0;
    lastMessage: any;
    pageCount: 10;
    limitEnd: 10;
    limitStart: 0;
    checkBoxValue: boolean = true;
    private subscriptionList: Subscription[];
    private dataModel: any;
    public viewModel: any;

    userInfoRes: any;
    userNo: any;
    bookingItemCode: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private route: ActivatedRoute,
        public bsModalService: BsModalService,
        private apiMypageService: ApiMypageService,
        private alertService: ApiAlertService,
        public jwtService: JwtService,

    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );

        this.subscriptionList = [];
        this.initialize();
    }

    ngOnInit(): void {

        super.ngOnInit();
        this.headerInit();
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveData = _.cloneDeep(data.resolveData);
                        this.callDetailApi();
                        console.log(this.bookingItemCode, 'bookingItemCode');

                        console.info('[1. route 통해 데이터 전달 받기]', data);


                    }
                )
        );
        console.log(this.resolveData, ' this.resolveData');
        console.log(this.bookingItemCode, ' this.bookingItemCode');

    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    initialize() {
        this.dataModel = {};
        this.viewModel = {
            list: []
        };
    }

    headerInit() {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: '고객 문의',
            key: null
        };
    }

    async callDetailApi() {

        this.userInfoRes = await this.jwtService.getUserInfo();

        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                userNo: this.userInfoRes.result.user.userNo,
                limits: [0, 10],
            },
        };

        this.loadingBool = false;
        await this.apiMypageService.POST_CONSULTING(rq)
            .toPromise()
            .then((res: any) => {
                console.info('[예약상세 > res]', res);

                if (res.succeedYn) {
                    this.loadingBool = true;
                    this.dataModel = _.cloneDeep(res.result);
                    console.log(this.dataModel, 'this.dataModel');

                    this.setViewModel();

                    return res;

                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err);
            });

        if (this.totalCount === 0) {  //처음 로딩시에만 안보이게 처리하고 무한스크롤로 추가될때는 true상태로 진행됨
            this.loadingBool = false;
        }

    }

    private setViewModel() {
        this.viewModel.list = this.dataModel.list;
        this.totalCount = this.dataModel.totalCount;
        console.log(this.viewModel.list, 'viewModel.list');

    }

    // 고객문의 상세 모달
    openQnaView() {
        const initialState = {
            bookingItemCode: this.dataModel.list.bookingItemCode,
            boardMasterSeq: this.dataModel.list.boardMasterSeq,
            requestDatetime: this.dataModel.list.requestDatetime,
            questionTitle: this.dataModel.list.questionTitle,
            questionDetail: this.dataModel.list.questionDetail,
            answerDetail: this.dataModel.list.answerDetail,
            handleFinishDatetime: this.dataModel.list.handleFinishDatetime,

        };
        console.log(initialState, 'initialState');

        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: true
        };
        this.bsModalRef = this.bsModalService.show(MyModalReservationQnaViewComponent, { initialState, ...configInfo });
    }

    // 고객문의 등록 모달
    openQnaWrite() {
        const initialState = {
            bookingItemCode: this.dataModel.list.bookingItemCode,
        };
        console.log(initialState, 'initialState');

        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: true
        };
        this.bsModalRef = this.bsModalService.show(MyModalReservationQnaWriteComponent, { initialState, ...configInfo });
    }

    openCancelReservation() {
        alert('예약취소 페이지..삭제?');
    }

    async increase() {

        if (this.totalCount !== 0 && this.totalCount < this.pageCount) {  // totalCount != 0 (첫번째 api 호출)이 아니고
            this.lastMessage = '마지막 데이터입니다.';
            return false;                                                   // api결과 갯수가 pageCount보다 작으면 마지막 data로 봄
        } else {
            this.result = await this.callDetailApi();
            console.info('this.result>>>>>', this.result);
            // 전체리스트 중 묶음할인인 경우 여러경우의 수가 나오므로 ~.items[..]에 ~.categories.code값을 세팅에서 items[..]로만 templete을 renderring함
            this.result.result.list.forEach((el) => {
                if (Object.keys(el.items).length > 1) {
                    el.items.forEach((e, i) => {
                        e.cateCode = el.categories[i].code;
                        e.cateName = el.categories[i].name;
                    });
                }
            });
        }
        const tmpCateResult = await this.result.result.list;      // api에서 limit갯수로 받아온 리스트
        this.cateResult = this.cateResult.concat(tmpCateResult);  // cateResult에 tmpCateResult 가 concat 된 리스트
        this.totalCount = this.result.result.totalCount;              // api 결과값의 totalCount
        this.totalListCount = Object.keys(this.cateResult).length;    // cateResult 총 갯수
        console.info('tmpCateResult>>>>>', tmpCateResult);
        console.info('cateResult>>>>>', this.cateResult);
    }
    onCheck() {
        this.checkBoxValue = !this.checkBoxValue;
        this.totalCount = 0;
        this.limitStart = 0;
        this.limitEnd = 10;
        this.cateResult = [];
        this.increase();
    }
}
