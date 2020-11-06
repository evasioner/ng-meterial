import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ITreeOptions, IActionMapping, ITreeState } from '@circlon/angular-tree-component';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as activitySearchResultPageSelectors from '@app/store/activity-search-result-page/activity-result-search/activity-result-search.selectors';
import * as _ from 'lodash';
import * as qs from 'qs';
import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';
import { ActivityComServiceService } from '@/app/common-source/services/activity-com-service/activity-com-service.service';
import { ActivityCommon } from '@/app/common-source/enums/activity/activity-common.enum';
import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';

@Component({
    selector: 'app-activity-modal-option',
    templateUrl: './activity-modal-option.component.html',
    styleUrls: ['./activity-modal-option.component.scss']
})
export class ActivityModalOptionComponent extends BaseChildComponent implements OnInit, OnDestroy {
    rqInfo: any;

    optionType: String = '';

    vm: any = {
        continents: null, // 도시
        categories: null // 카테고리
    };

    actionMapping: IActionMapping = {
        mouse: {
            click: (tree, node) => this.check(node, !node.data.checked)
        }
    };

    continentsNodes: any; // 도시 tree Json
    categoriesNodes: any; // 카테고리 tree Json
    continentsOptions: ITreeOptions = {
        actionMapping: this.actionMapping
    }; // 도시/카테고리 Option
    state: ITreeState;


    rxAlive: boolean = true;

    loadingBool: Boolean = false;
    transactionSetId: any;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private store: Store<any>,
        private router: Router,
        private readonly activityComServiceService: ActivityComServiceService,
        public bsModalRef: BsModalRef,
    ) {
        super(platformId);
        this.subscriptionList = [];
    }



    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        this.vmInit();
        this.subscribeInit();
    }

    ngOnDestroy() {
        this.rxAlive = false;
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    vmInit() {
        // tab active
        if (this.optionType === null) {
            this.optionType = 'CITY';
        }
    }

    subscribeInit() {
        this.subscriptionList.push(
            this.store
                .select(activitySearchResultPageSelectors.getSelectId(ActivityStore.STORE_RESULT_LIST_RQ))
                .subscribe(
                    (ev: any) => {
                        // console.info('[activityListRq$ > subscribe]', ev);
                        if (ev) {
                            this.rqInfo = _.cloneDeep(ev.result);
                            this.loadingBool = true;
                        } else {
                            this.loadingBool = false;
                        }
                    }
                )
        );

        this.subscriptionList.push(
            this.store
                .select(activitySearchResultPageSelectors.getSelectId(ActivityStore.STORE_RESULT_LIST_RS))
                .subscribe(
                    (ev: any) => {
                        // console.info('[activityListRs$ > subscribe]', ev);
                        if (ev) {
                            this.setFilter(ev.result.result);
                            this.transactionSetId = ev.result['transactionSetId'];
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
     * activity/list rs 값을 통해 필터 값 셋팅
     * 1. 전체 필터 범위 셋팅
     * 2. 선택된 필터 셋팅
     * 도시 필터 제외. 박종선(2020.06.03)
     */
    setFilter($result) {
        console.info('[forFilter]', $result.forFilter);
        // this.vm.continents = $result.forFilter.continents;
        this.vm.categories = $result.forFilter.categories;

        // 1.1 continents tree 형태로 변경
        // this.continentsNodes = _.cloneDeep(this.vm.continents);
        // const allNode = {
        //   "code": "ALL",
        //   "name": "전체",
        //   "count": 0,
        //   "checked": false,
        //   "isExpanded": false,
        //   "children" : []
        // };
        // allNode.count = _.sumBy(this.continentsNodes, function(o) { return o["count"];});

        // this.continentsNodes =  _.concat(
        //   allNode
        //   , _.forEach(this.continentsNodes, function(objs) {
        //     objs.checked = false;
        //     objs.isExpanded = false;
        //     // objs.children = objs.countries;
        //     objs.children = _.forEach(objs.countries, function(objc) {
        //         objc.checked = false;
        //         objc.isExpanded = false;
        //         // objc.children = objc.cities;
        //         objc.children = _.forEach(objc.cities, function(objd) {
        //             objd.checked = false;
        //             objd.isExpanded = false;
        //         });
        //         delete objc.cities;
        //     });
        //     delete objs.countries;
        // }));


        // 1.2 categories tree 형태로 변경
        this.categoriesNodes = _.cloneDeep(this.vm.categories);
        const allNode1 = {
            'code': 'ALL',
            'name': '전체',
            'count': 0,
            'checked': false,
            'isExpanded': false,
            'children': []
        };
        allNode1.count = _.sumBy(this.categoriesNodes, (o) => o['count']);
        this.categoriesNodes = _.concat(
            allNode1
            , _.forEach(this.categoriesNodes, (objs) => {
                objs.checked = false;
                objs.isExpanded = false;
                // objs.children = objs.types;
                objs.children = _.forEach(objs.types, (objc) => {
                    objc.checked = false;
                    objc.isExpanded = false;
                });
                delete objs.types;
            }));

        // console.log("[setFilter] continentsNodes : ", this.continentsNodes);
        // console.log("[setFilter] categoriesNodes : ", this.categoriesNodes);


        /**
         * 2. 선택한 필터가 있을 경우
         * 값 셋팅
         */
        if ($result.filter != null) { // 선택한 필터가 있을 경우
            setTimeout(() => {
                const that = this;

                //  도시
                // if('continents' in $result.filter){
                //   _.forEach($result.filter.continents, function(objsa) {
                //     _.forEach(that.continentsNodes, function(objsb) {

                //       if (objsa.code == objsb.code) {
                //         objsb.checked = true;

                //         if (objsa.countries.length > 0) {

                //           _.forEach(objsa.countries, function(objca) {
                //             _.forEach(objsb.children, function(objcb) {

                //               if (objca.code == objcb.code) {
                //                 objcb.checked = true;

                //                 if (objca.cities.length > 0) {

                //                   _.forEach(objca.cities, function(objda) {
                //                     _.forEach(objcb.children, function(objdb) {
                //                       if (objda.code == objdb.code) {
                //                         objdb.checked = true;
                //                       }
                //                     });
                //                   });
                //                 }
                //               }
                //             });

                //           });
                //         }
                //       }
                //     });
                //   });
                //   // all check 확인
                //   this.allCheckboxCheck(this.continentsNodes);
                // }

                // 카테고리
                if ('categories' in $result.filter) {
                    _.forEach($result.filter.categories, (objsa) => {
                        _.forEach(that.categoriesNodes, (objsb) => {

                            if (objsa.code == objsb.code) {
                                objsb.checked = true;

                                if (objsa.types.length > 0) {

                                    _.forEach(objsa.types, (objca) => {
                                        _.forEach(objsb.children, (objcb) => {

                                            if (objca.code == objcb.code) {
                                                objcb.checked = true;
                                            }
                                        });

                                    });
                                }
                            }
                        });
                    });
                    // all check 확인
                    this.allCheckboxCheck(this.categoriesNodes);
                }
            });
        }
    }

    public check(node, checked) {
        this.updateChildNodeCheckbox(node, checked);
        this.updateParentNodeCheckbox(node.realParent);
        this.allCheckboxCheck(node.treeModel.nodes);
    }

    public updateChildNodeCheckbox(node, checked) {
        node.data.checked = checked;
        if (node.children) {
            node.children.forEach((child) => this.updateChildNodeCheckbox(child, checked));
        }

        if (node.data.code === 'ALL') {
            // All
            node.treeModel.nodes.forEach((child) => this.updateChildCheckbox(child, checked));
        }
    }

    public updateChildCheckbox(node, checked) {
        node.checked = checked;
        if (node.children) {
            node.children.forEach((child) => this.updateChildCheckbox(child, checked));
        }
    }

    public updateParentNodeCheckbox(node) {
        if (!node) {
            return;
        }

        let allChildrenChecked = true;
        let noChildChecked = true;

        for (const child of node.children) {
            if (!child.data.checked || child.data.indeterminate) {
                allChildrenChecked = false;
            }
            if (child.data.checked) {
                noChildChecked = false;
            }
        }

        if (allChildrenChecked) {
            node.data.checked = true;
            node.data.indeterminate = false;
        } else if (noChildChecked) {
            node.data.checked = false;
            node.data.indeterminate = false;
        } else {
            node.data.checked = true;
            node.data.indeterminate = true;
        }
        this.updateParentNodeCheckbox(node.parent);
    }

    /**
     * * tree 중 전체 선택 체크 로직
     * @param node
     */
    public allCheckboxCheck(node) {
        if (!node) {
            return;
        }

        setTimeout(() => {
            const flattenAll = this.flatten(node);
            const checkFalseArr = _.filter(flattenAll, (o) => !o.checked);
            const allIndex = _.findIndex(node, { 'code': 'ALL' });
            if (checkFalseArr.length >= 1) {
                if (checkFalseArr.length == 1 && checkFalseArr[0].code == 'ALL') {
                    node[allIndex].checked = true;
                } else {
                    node[allIndex].checked = false;
                }

            } else {
                node[allIndex].checked = true;
            }
        }, 50); // 이전 함수를 실행하고나서 실행하기 위해 setTimeout에 시간을 적용함.
    }

    /**
     *  tree CSS Design을 맞추기 위한 Method
    */
    getPaddingLeft($level) {
        const defaultPadding = 12;
        const paddingLeftVal = defaultPadding * ($level - 1);
        const paddingLeftObj = {
            'padding-left': paddingLeftVal + 'px'
        };
        return paddingLeftObj;
    }
    /**
     *  tree CSS Design을 맞추기 위한 Method
    */
    getClassChk($checked, $indeterminate) {

        const checked = $checked || false;
        const indeterminate = $indeterminate || false;

        const temp = {
            'is-checked': false,
            'is-no-checked': false,
            'is-indeterminate': false
        };

        if (checked === true && indeterminate === false) { // 모두 체크
            temp['is-checked'] = true;
        } else if (checked === false && indeterminate === false) { // 체크 안됨
            temp['is-no-checked'] = true;
        } else if (checked === true && indeterminate === true) { // 일부만 체크
            temp['is-indeterminate'] = true;
        }

        return temp;
    }


    flatten(array) {
        if (!array || array.length == 0) return [];

        const flat = [];
        const that = this;
        array.forEach((item) => {
            // get child properties only
            const flatItem = {};
            Object.keys(item).forEach((key) => {
                if (item.hasOwnProperty(key) && !Array.isArray(item[key])) {
                    flatItem[key] = item[key];
                }






                // recursive flattern on subitems
                // add recursive call results to the
                // current stack version of "flat", by merging arrays
                else if (Array.isArray(item[key])) {
                    Array.prototype.push.apply(flat, that.flatten(item[key]));
                }
            });
            flat.push(flatItem);
        });

        return flat;
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick(e) {
        this.modalClose();
    }

    onSelectTab($optionType): void {
        this.optionType = $optionType;
    }

    /**
     * 적용하기
     * 1. rent-list-rq 스토어에 저장
     * @param $form
     * 도시 필터 제외. 박종선(2020.06.03)
     */
    onSubmit() {
        this.modalClose();
        setTimeout(() => {

            // 도시
            // const checkCityArr = _.filter(this.continentsNodes, function(o) { return o.checked; });
            // if (checkCityArr.length >= 1) {

            //   const filterContinents = [];
            //   checkCityArr.forEach(function(objs) {
            //     const continent = {};
            //     if (objs.checked && objs.code !== 'ALL') {
            //       continent["code"] = objs.code;

            //       if (objs.children) {
            //         const countries = [];

            //         objs.children.forEach(function(objc) {
            //           const country = {};
            //           if (objc.checked) {
            //             country["code"] = objc.code;

            //             if (objc.children) {
            //               const cities = [];
            //               _.forEach(objc.children, function(objd) {
            //                 const citiy = {};
            //                 if (objd.checked) {
            //                   citiy["code"] = objd.code;
            //                   cities.push(citiy);
            //                 }
            //               });

            //               if (cities.length > 0) {
            //                 country["cities"] = cities;
            //               }
            //             }
            //             countries.push(country);
            //           }
            //         });

            //         if (countries.length > 0) {
            //           continent["countries"] = countries;
            //         }
            //       }
            //       filterContinents.push(continent);
            //     }
            //   });
            //   //console.log("[onSubmit] filterContinents : " , filterContinents);
            //   this.rqInfo.rq.condition.filter.continents = filterContinents;


            // } else if ('continents' in this.rqInfo.rq.condition.filter) {
            //   this.rqInfo.rq.condition.filter = _.omit(this.rqInfo.rq.condition.filter, 'continents');
            // }


            // 카테고리
            const checkCategoryArr = _.filter(this.categoriesNodes, (o) => o.checked);
            if (checkCategoryArr.length >= 1) {

                const filterCategories = [];
                checkCategoryArr.forEach((objs) => {
                    const category = {};
                    if (objs.checked && objs.code !== 'ALL') {
                        category['code'] = objs.code;

                        if (objs.children) {
                            const types = [];

                            objs.children.forEach((objc) => {
                                const type = {};
                                if (objc.checked) {
                                    type['code'] = objc.code;
                                    types.push(type);
                                }
                            });

                            if (types.length > 0) {
                                category['types'] = types;
                            }
                        }
                        filterCategories.push(category);
                    }
                });
                // console.log("[onSubmit] filterCategories : " , filterCategories);
                this.rqInfo.rq.condition.filter.categories = filterCategories;

            } else if ('categories' in this.rqInfo.rq.condition.filter) {
                this.rqInfo.rq.condition.filter = _.omit(this.rqInfo.rq.condition.filter, 'categories');
            }



            // default check
            if (!('filter' in this.rqInfo.rq.condition)) {
                this.rqInfo.rq.condition.filter = {};
            }
            this.rqInfo.rq.condition.limits = [0, 10]; // 1페이지를 조회한다.
            this.rqInfo.rq = { ...this.rqInfo.rq, transactionSetId: this.transactionSetId };
            const rsData = this.activityComServiceService.beforeEncodingRq(_.cloneDeep(this.rqInfo));
            //console.info('[onSubmit rsData]', rsData);

            /**
             * 결과페이지 라우터 이동
             */
            // const base64Str = this.base64Svc.base64EncodingFun(this.rqInfo);
            // const path = ActivityStore.PAGE_SEARCH_RESULT + base64Str;
            const qsStr = qs.stringify(rsData);
            const path = ActivityCommon.PAGE_SEARCH_RESULT + qsStr;

            // 페이지 이동후 생명주기 재실행
            this.router.navigateByUrl('/', { skipLocationChange: true })
                .then(() => this.router.navigate([path]));
        });
    }

}
