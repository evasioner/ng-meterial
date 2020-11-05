import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import * as _ from 'lodash';
import * as moment from 'moment';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { environment } from '@/environments/environment';

import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { JwtService } from 'src/app/common-source/services/jwt/jwt.service';
import { CommonLayoutSideMenuService } from '../../../app/common-source/services/common-layout-side-menu/common-layout-side-menu.service';

import { upsertMyMileage } from 'src/app/store/my-mileage/my-mileage/my-mileage.actions';

import { BoardMaster, BoardMasterList } from '@/app/common-source/models/my-qna/board-master.model';
import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { MyModalQnaWriteComponent } from './modal-components/my-modal-qna-write/my-modal-qna-write.component';
import { MyModalQnaViewComponent } from './modal-components/my-modal-qna-view/my-modal-qna-view.component';
import { BasePageComponent } from '../base-page/base-page.component';


@Component({
    selector: 'app-my-qna-list-page',
    templateUrl: './my-qna-list-page.component.html',
    styleUrls: ['./my-qna-list-page.component.scss']
})
export class MyQnaListPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    tabNo: any;
    headerType: any;
    headerConfig: any;

    rxAlive: boolean = true;
    loadingBool: boolean = false;
    resolveData: any;

    private subscriptionList: Subscription[];
    private dataModel: any;
    public viewModel: any;

    foldingKey: boolean = false;
    bsModalRef: BsModalRef;
    selCate: any = 0;
    selCateStr: any;
    totalCount: any;
    activityCount: any;
    airtelCount: any;
    rentCount: any;
    hotelCount: any;
    flightCount: any;

    bookingItemCode: any;
    travelFromDate: any;
    qnaList = [];
    userInfoRes: any;

    public writeDay: any;
    public boardMaster: BoardMaster[];

    qnaTransactionSetId: any;
    isSearchDone: boolean = false;
    resultList: any;
    infiniteScrollConfig: any = {
        distance: 2,
        throttle: 50
    };

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private bsModalService: BsModalService,
        private apiMypageService: ApiMypageService,
        private route: ActivatedRoute,
        private alertService: ApiAlertService,
        private store: Store<any>,
        private location: Location,
        public commonLayoutSideMenuService: CommonLayoutSideMenuService,
        public jwtService: JwtService,
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
        this.initialize();
        this.pageInit();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.selectTab(0);
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveData = _.cloneDeep(data.resolveData);

                        console.info('[1. route 통해 데이터 전달 받기]', data.resolveData);

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
        this.rxAlive = false;

    }


    /**
     * 헤더 초기화
     */
    headerInit() {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: '상품문의',
            key: null
        };
    }

    selectTab(no) {
        this.tabNo = no;
    }
    private async initialize() {
        this.dataModel = {};
        this.viewModel = {
            list: []
        };
        this.subscriptionList = [];
        this.boardMaster = BoardMasterList;
        this.userInfoRes = await this.jwtService.getUserInfo();

        // this.setBookingList();
    }
    /**
     * 페이지 초기화
     *  api 호출 (
     */
    async pageInit() {
        console.log(this.userInfoRes, 'this.userInfoRes');
        this.isSearchDone = false;
        const userInfoRes = await this.jwtService.getUserInfo();
        const rqInfo =
        {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                userNo: userInfoRes.result.user.userNo,
                limits: [0, 10]
            }
        };
        this.getQnaList(rqInfo);
        this.isSearchDone = true;
        this.dataModel.rq = _.cloneDeep(rqInfo);

    }

    getQnaList(rq) {
        this.subscriptionList.push(
            this.apiMypageService.POST_QNA(rq)
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {

                            this.viewModel = _.cloneDeep(res.result);
                            this.totalCount = _.cloneDeep(res.result.totalCount);
                            this.dataModel.transactionSetId = res.transactionSetId;

                            this.flightCount = this.viewModel.list.filter(item => item.postCategoryCode === 'IC01').length;
                            this.hotelCount = this.viewModel.list.filter(item => item.postCategoryCode === 'IC02').length;
                            this.rentCount = this.viewModel.list.filter(item => item.postCategoryCode === 'IC03').length;
                            this.activityCount = this.viewModel.list.filter(item => item.postCategoryCode === 'IC04').length;
                            this.airtelCount = this.viewModel.list.filter(item => item.postCategoryCode === 'IC05').length;

                            const today = moment();
                            this.writeDay = today.format('YYYY-MM-DD');

                            this.upsertOne({
                                id: 'my-qna-list',
                                result: this.dataModel.response
                            });




                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
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
    /**
     * 뒤로가기
     */
    onBackClick() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.location.back();
    }

    public onMenuClick(event: any): void {
        event && event.preventDefault();

        this.commonLayoutSideMenuService.setOpen();
    }

    selectFolding() {
        this.foldingKey = !this.foldingKey;
    }

    selectCate(selCate) {
        this.selCate = selCate;
        this.selCateStr = (<HTMLInputElement>event.target).textContent;
        this.selectFolding();
    }
    writeQna() {
        const initialState = {

        };
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalRef = this.bsModalService.show(MyModalQnaWriteComponent, { initialState, ...configInfo });
    }

    detailView(i: number) {
        const initialState = {
            bookingItemCode: this.viewModel.list[i].bookingItemCode,
            boardMasterSeq: this.viewModel.list[i].boardMasterSeq,
            handleDatetime: this.writeDay,
            postTitle: this.viewModel.list[i].postTitle,
            postDetail: this.viewModel.list[i].postDetail,
        };
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalRef = this.bsModalService.show(MyModalQnaViewComponent, { initialState, ...configInfo });
    }

    onScroll() {
        console.log('scrollllllll');

        if (this.isSearchDone)
            this.listIncrease();
    }

    /**
     * 더보기
     */
    async listIncrease() {

        this.curLimitsIncrease();
        this.getQnaListIncrease(_.cloneDeep(this.dataModel.result));
        this.isSearchDone = true;
    }

    /**
     * 스크롤 작동시
     * 리스트 가져오기
    */
    getQnaListIncrease(rq) {

        if (this.viewModel.list.length === this.totalCount) {
            return false;
        }

        this.apiMypageService.POST_QNA(rq)
            .subscribe(
                (res: any) => {
                    if (res.succeedYn) {
                        this.dataModel.result = _.cloneDeep(res.result);
                        this.qnaTransactionSetId = res.transactionSetId;
                        this.viewModel.list = this.viewModel.list.concat(this.dataModel.result.list);
                        console.log(this.dataModel.result, 'this.dataModel.result');
                        console.log(this.viewModel.list, 'this.viewModel.list');

                    } else {
                        this.alertService.showApiAlert(res.errorMessage);
                    }
                },
                (err: any) => {
                    this.alertService.showApiAlert(err);
                }
            );
    }

    /**
     * 증가
     */
    curLimitsIncrease() {
        console.info('[curLimitsIncrease]', this.dataModel.rq);
        const rq = _.cloneDeep(this.dataModel.rq);
        rq.condition.limits[0] += 10;
        rq.condition.limits[1] += 10;
        rq.transactionSetId = this.qnaTransactionSetId;
        this.dataModel.result = rq;
    }


}
