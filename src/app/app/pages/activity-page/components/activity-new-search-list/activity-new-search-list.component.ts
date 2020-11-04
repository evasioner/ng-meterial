import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as qs from 'qs';
import * as _ from 'lodash';

import { StorageService } from '@/app/common-source/services/storage/storage.service';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';


@Component({
    selector: 'app-activity-new-search-list',
    templateUrl: './activity-new-search-list.component.html'
})
export class ActivityNewSearchListComponent extends BaseChildComponent implements OnInit {
    viewModel: any;
    dataModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
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
                    (item: any): any => {
                        if (_.has(item, 'resolveData')) {
                            this.viewModel.recentList.push(
                                {
                                    activityCode: item.activityCode,
                                    activityNameEn: item.activityNameEn,
                                    continentNameLn: item.continentNameLn,
                                    cityNameLn: item.cityNameLn,
                                    amountSum: item.amountSum,
                                }
                            )
                        }
                    }
                );

                if (this.viewModel.recentList.length > 1)
                    this.viewModel.recentList = _.reverse(this.viewModel.recentList);

                console.log(this.viewModel.recentList, 'this.viewModel.recentList');
            }
        } catch (error) {
            console.log(error);
            this.dataModel.recent = [];
            this.viewModel.recentList = [];
        }





    }

    /**
     * onDeleteItem
     * 아이템 삭제
     *
     * @param event dom 이벤트
     * @param index 삭제 대상 배열 번호
     */
    public onDeleteItem(event: any, index: number): void {
        event && event.preventDefault();

        this.viewModel.recentList.splice(index, 1);
        this.storageS.removeRecentData('local', this.dataModel.recent, 'activity', index);
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
        const path = '/activity-search-result-detail/' + qsStr;
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);

    }
}
