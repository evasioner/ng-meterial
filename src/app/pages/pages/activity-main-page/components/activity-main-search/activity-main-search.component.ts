import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';

import * as activityModalDestinationSelectors from '@/app/store/activity-common/activity-modal-destination/activity-modal-destination.selectors';

import { BsModalService } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';

import * as qs from 'qs';

import { environment } from '@/environments/environment';

import { DestinationState } from '@/app/common-source/enums/destination-state.enum';
import { ActivityCommon } from '@/app/common-source/enums/activity/activity-common.enum';
import { ActivitySearch } from '@/app/common-source/enums/activity/activity-search.enum';

import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-activity-main-search',
    templateUrl: './activity-main-search.component.html',
    styleUrls: ['./activity-main-search.component.scss']
})
export class ActivityMainSearchComponent extends BaseChildComponent implements OnInit, OnDestroy {
    private dataModel: any;
    private subscriptionList: Subscription[];

    public mainForm: FormGroup;
    /**
    * 목적지 검색 : 도시검색 + 자동검색
    */
    public destinationObj: any;
    public viewModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private fb: FormBuilder,
        private store: Store<any>,
        private bsModalService: BsModalService,
        private route: ActivatedRoute,
        private router: Router,
        public translateService: TranslateService
    ) {
        super(platformId);

        this.initialize();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    private initialize() {
        this.dataModel = {
            type: null,
            cityRequest: {
                currency: 'KRW',
                language: 'KO',
                stationTypeCode: environment.STATION_CODE,
                condition: {
                    limits: [0, 12]
                }
            }
        };
        this.viewModel = {
            isDestination: false,
            beforeCity: {},
            categoryList: [
                { categoryId: 'AC01', styleType: 'sim', categoryName: 'WIFI&SIM', translateName: '' }, // WIFI&SIM카드
                { categoryId: 'AC02', styleType: 'service', categoryName: '여행서비스', translateName: '' }, // 여행서비스
                { categoryId: 'AC03', styleType: 'pickup', categoryName: '픽업/샌딩', translateName: '' }, // 픽업/샌딩
                { categoryId: 'AC04', styleType: 'ticket', categoryName: '티켓/패스', translateName: '' }, // 티켓/패스
                { categoryId: 'AC05', styleType: 'tour', categoryName: '투어', translateName: '' }, // 투어
                { categoryId: 'AC06', styleType: 'experience', categoryName: '체험', translateName: '' }, // 체험
                // { categoryId: 'AC07', styleType: 'delicious', categoryName: '맛집', translateName: '' } // 맛집
            ],
            searchCategoryCode: '',
            searchCategoryName: ''
        };

        this.mainFormInit(); //폼 초기화
        this.destinationObjInit();
        this.subscribeInit();
    }

    private mainFormInit() {
        this.mainForm = this.fb.group({
            name: '',
            cityName: '',
            cityCode: '',
            categoryCode: '',
            categoryName: ''
        });
    }

    private destinationObjInit() {
        this.destinationObj = {
            storeCategoryType: 'ACTIVITY', // 카테고리 선택 | FLIGHT, HOTEL, AIRTEL, RENT, ACTIVITY, MY
            state: null,
            storeId: null,
            inputId: null,
            left: 0,
            top: 0,
            initialState: null,
            majorDestinationRq: {
                rq: {
                    currency: 'KRW',
                    language: 'KO',
                    stationTypeCode: environment.STATION_CODE,
                    condition: {
                        itemCategoryCode: ActivityCommon.IITEM_CATEGORY_CODE,
                        compCode: environment.COMP_CODE
                    }
                }
            },
            destinationRq: {
                rq: {
                    currency: 'KRW',
                    language: 'KO',
                    stationTypeCode: environment.STATION_CODE,
                    condition: {
                        itemCategoryCode: ActivityCommon.IITEM_CATEGORY_CODE,
                        keyword: null,
                        limits: [0, 20]
                    }
                }
            }
        };
    }

    private subscribeInit() {
        this.subscriptionList = [
            this.store.pipe(
                select(activityModalDestinationSelectors.getSelectId('search'))
            )
                .subscribe(
                    (resp: any) => {
                        if (resp) {
                            console.log(resp);
                            this.dataModel.type = resp.type;

                            if (this.dataModel.type === ActivitySearch.SEARCH_TYPE_CITY) {
                                this.mainForm.patchValue(
                                    { name: resp.name, cityName: resp.name, cityCode: resp.val, categoryCode: '', categoryName: '' }
                                );
                            } else if (this.dataModel.type === ActivitySearch.SEARCH_TYPE_DETAIL) {
                                this.mainForm.patchValue(
                                    { name: resp.name, cityName: resp.cityNameLn, cityCode: resp.cityCode, categoryCode: Number(resp.val), categoryName: resp.name }
                                );
                            }

                            this.viewModel.beforeCity = this.mainForm.value;
                            this.destinationObj.state = DestinationState.IS_DEFAULT;
                        } else {
                            this.dataModel.type = null;
                        }
                    }
                )
        ];
    }

    private msgAlert(titleTxt: string) {
        const initialState = {
            titleTxt: titleTxt,
            okObj: {
                fun: () => { }
            }
        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
    }

    /**
     * onDestinationFocus
     * 목적지 포커스 온
     *
     * @param event 마우스 이벤트
     */
    public onDestinationFocus(event: MouseEvent) {
        event && event.preventDefault();

        this.viewModel.beforeCity = this.mainForm.value;
        this.destinationObjInit();
        this.mainFormInit();

        this.destinationObj.storeId = 'search';
        this.destinationObj.inputId = 'tgDesInput'; // tgDesInput
        this.destinationObj.top = 0;
        this.destinationObj.state = DestinationState.IS_CITY;

        const tgWrapName = 'tg-search-area-form';
        const tgWrap = document.querySelector(`[data-target="${tgWrapName}"]`);
        this.destinationObj.top = tgWrap.clientHeight + 107;
    }

    /**
     *
     * @param event 키보드 이벤트
     */
    public onDestinationKeyup(event: any) {
        event && event.preventDefault();
        console.info('[onDestinationKeyup]', event.target.value);

        const tgVal = event.target.value;

        if (tgVal.length === 0) {  // 도시검색
            this.destinationObj.state = DestinationState.IS_CITY;
        } else if (tgVal.length > 0) { // 자동검색
            this.destinationObj.state = DestinationState.IS_AUTO;
        }
    }

    /**
     * onGoCategorySearch
     * 카테고리 검색
     *
     * @param event 마우스 이벤트
     * @param index 카테고리리스트 번호
     */
    public onGoCategorySearch(event: MouseEvent, index: number) {
        event && event.preventDefault();

        this.viewModel.searchCategoryCode = this.viewModel.categoryList[index].categoryId;
        this.viewModel.searchCategoryName = this.viewModel.categoryList[index].translateName;
    }

    public clickOutsideDest(event?: any) {
        event && event.preventDefault();

        this.mainForm.patchValue(this.viewModel.beforeCity);
        this.destinationObj.state = DestinationState.IS_DEFAULT;
    }

    /**
     * onSubmit
     * 도시 검색 페이지로 이동
     */
    public onSubmit() {
        console.log(this.mainForm.value, this.dataModel);

        const newData = this.mainForm.value;
        let validFlag: boolean = false;
        let nextPage = '';
        switch (this.dataModel.type) {
            case ActivitySearch.SEARCH_TYPE_CITY:
                if (newData.cityCode === '') {
                    validFlag = true;
                }

                this.dataModel.cityRequest.condition.cityCode = newData.cityCode;
                nextPage = ActivityCommon.PAGE_CITY_INTRO;
                break;

            case ActivitySearch.SEARCH_TYPE_DETAIL:
                if (newData.categoryCode === '') {
                    validFlag = true;
                }

                this.dataModel.cityRequest.condition.cityCode = newData.cityCode;
                this.dataModel.cityRequest.condition.activityCode = newData.categoryCode;
                nextPage = ActivityCommon.PAGE_SEARCH_RESULT;
                break;

            default:
                validFlag = true;
                break;
        }

        if (validFlag) {
            return this.msgAlert('검색조건이 모두 입력되지 않았습니다.<br>검색 조건을 확인해주세요.');
        } else {
            const querString = {
                rq: this.dataModel.cityRequest,
                searchCategoryName: newData.categoryName === '' ? null : newData.categoryName,
                searchCityName: newData.cityName
            };
            const qsStr = qs.stringify(querString);
            const path = nextPage + qsStr;
            const extras = {
                relativeTo: this.route
            };

            console.log('activity-main-search.component : ', querString);
            // this.location.replaceState(ActivityEnums.PAGE_MAIN+);
            this.router.navigate([path], extras);
        }
    }

}
