import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';
import * as qs from 'qs';

import { StorageService } from '@app/common-source/services/storage/storage.service';

import { BaseChildComponent } from '@app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-rent-recent-list',
    templateUrl: './rent-recent-list.component.html',
    styleUrls: ['./rent-recent-list.component.scss']
})
export class RentRecentListComponent extends BaseChildComponent implements OnInit {
    viewModel: any;
    dataModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private storageS: StorageService,
        private router: Router,
        private route: ActivatedRoute,
        public translateService: TranslateService
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
            recent: this.storageS.getItem('local', 'recent').rent || []
        };
        this.viewModel = {
            recentList: []
        };

        if (!_.isEmpty(this.dataModel.recent) && this.dataModel.recent.length > 0) {
            this.dataModel.recent.map(
                (item: any, key: any): any => {
                    if (_.has(item, 'resolveData')) {
                        this.viewModel.recentList.push(
                            {
                                index: key,
                                dateRange: item.dateRange,
                                pickLocation: this.parseLocation(item),
                                locationAccept: item.locationAccept,
                                locationReturn: item.locationReturn,
                                vehicleName: item.vehicleName,
                                photoUrls: item.photoUrls
                            }
                        );

                    }
                }
            );

            if (this.viewModel.recentList.length > 1)
                this.viewModel.recentList = _.orderBy(this.viewModel.recentList, ['index'], ['desc']);

            console.info('rent recentList', this.viewModel.recentList);

        }
    }

    private parseLocation(item) {
        if (_.isEqual(item.locationAccept, item.locationReturn)) {
            return '인수장소와 동일';
        } else {
            return item.locationReturn;
        }
    }
    /**
      * onDeleteItem
      * 아이템 삭제
      * @param event dom 이벤트
      * @param vrIndex viewModel.recentList 삭제 대상 배열 번호
      * @param drIndex dataModel.recent     삭제 대상 배열 번호
    */
    public onDeleteItem(event: any, vrIndex: number, drIndex: number): void {
        event && event.preventDefault();

        this.viewModel.recentList.splice(vrIndex, 1);
        this.storageS.removeRecentData('local', this.dataModel.recent, 'rent', drIndex);
    }

    /**
     * onSearchResult
     * 아이템 검색 결과
     *
     * @param event dom 이벤트
     * @param index dataModel.recent 삭제 대상 배열 번호
     */
    public onSearchResult(event: any, drIndex: number): void {
        event && event.preventDefault();

        const qsStr = qs.stringify(this.dataModel.recent[drIndex].resolveData);
        const path = '/rent-booking-information/' + qsStr;
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
}
