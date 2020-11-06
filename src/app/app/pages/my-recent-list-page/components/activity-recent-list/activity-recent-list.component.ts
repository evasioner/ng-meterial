import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as qs from 'qs';
import * as _ from 'lodash';


import { StorageService } from '@/app/common-source/services/storage/storage.service';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';


@Component({
    selector: 'app-activity-recent-list',
    templateUrl: './activity-recent-list.component.html'
})
export class ActivityRecentListComponent extends BaseChildComponent implements OnInit {
    viewModel: any;
    dataModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private storageS: StorageService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super(platformId);

        this.initialize();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    /**
     * initialize
     * 초기화
     */
    private initialize(): void {
        this.dataModel = {
            recent: this.storageS.getItem('local', 'recent').activity || []
        };
        this.viewModel = {
            recentList: []
        };

        try {
            if (!_.isEmpty(this.dataModel.recent) && this.dataModel.recent.length > 0) {
                this.dataModel.recent.map(
                    (item: any, key: any): any => {
                        if (_.has(item, 'resolveData')) {
                            this.viewModel.recentList.push(
                                {
                                    index: key,
                                    searchCityName: item.resolveData.searchCityName,
                                    dateRange: item.dateRange,
                                    vendorCompName: item.vendorCompName
                                    // travelers: (item.vm.travelerStore)
                                }
                            )
                        }
                    }
                );
            }
        } catch (error) {
            console.log(error);
            this.dataModel.recent = [];
            this.viewModel.recentList = [];
        }
        if (!_.isEmpty(this.dataModel.recent) && this.dataModel.recent.length > 0) {
            this.dataModel.recent.map(
                (item: any, key: any): any => {
                    if (_.has(item, 'resolveData')) {
                        this.viewModel.recentList.push(
                            {
                                index: key,
                                searchCityName: item.resolveData.searchCityName,
                                dateRange: item.dateRange,
                                vendorCompName: item.vendorCompName
                                // travelers: (item.vm.travelerStore)
                            }
                        )
                    }
                }
            );
        }
        console.log(this.dataModel, 'datamodel');
        console.log(this.viewModel, 'viewmodel');
    }
    private parseTraveler(item: any): string {
        let returnText = '';

        if (Number(item.adultCount) > 0) {
            returnText = `성인 ${item.adultCount}명, `;
        }

        if (Number(item.childCount) > 0) {
            returnText += `아동 ${item.childCount}명, `;
        }

        if (Number(item.infantCount) > 0) {
            returnText += `유아 ${item.infantCount}명, `;
        }

        return returnText;
    }

    /**
     * onDeleteItem
     * 아이템 삭제
     *
     * @param event dom 이벤트
     * @param index 삭제 대상 배열 번호
     */
    public onDeleteItem(event: any, vrIndex: number, drIndex: number): void {
        event && event.preventDefault();

        this.viewModel.recentList.splice(vrIndex, 1);
        this.storageS.removeRecentData('local', this.dataModel.recent, 'activity', drIndex);
    }


    /**
     * onSearchResult
     * 아이템 검색 결과
     *
     * @param event dom 이벤트
     * @param index 삭제 대상 배열 번호
     */
    public onSearchResult(event: any, index: number): void {
        event && event.preventDefault();

        const qsStr = qs.stringify(this.dataModel.recent[index].resolveData);
        const path = '/activity-search-result/' + qsStr;
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);

    }
}
