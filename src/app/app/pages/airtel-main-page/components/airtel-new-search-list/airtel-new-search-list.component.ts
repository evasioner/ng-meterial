import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as qs from 'qs';
import * as _ from 'lodash';
import * as moment from 'moment';

import { StorageService } from '@/app/common-source/services/storage/storage.service';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-airtel-new-search-list',
    templateUrl: './airtel-new-search-list.component.html',
    styleUrls: ['./airtel-new-search-list.component.scss']
})
export class AirtelNewSearchListComponent extends BaseChildComponent implements OnInit {
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
            recent: this.storageS.getItem('local', 'recent').airtel || []
        };
        this.viewModel = {
            recentList: []
        };

        if (!_.isEmpty(this.dataModel.recent) && this.dataModel.recent.length > 0) {
            this.dataModel.recent.map(
                (item: any): any => {
                }
            );
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
        this.storageS.removeRecentData('local', this.dataModel.recent, 'airtel', index);
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

        // const request: any = {
        //     rq: this.dataModel.recent[index].rq,
        //     vm: this.dataModel.recent[index].vm,
        //     detailUpdate: this.dataModel.recent[index].detailUpdate || undefined,
        //     alignUpdate: this.dataModel.recent[index].alignUpdate || undefined
        // };

        // const incodingOpt = {
        //     encodeValuesOnly: true
        // };

        // //항공(가는편)으로 이동(왕복, 편도)
        // const queryString = qs.stringify(request, incodingOpt);
        // let path = '/flight-search-result-go/';

        // //항공(다구간)으로 이동
        // if (this.dataModel.recent[index].vm.tripTypeCode === 'MD') {
        //     path = '/flight-search-result-multi/';
        // }

        // path += queryString;
        // const extras = {
        //     relativeTo: this.route
        // };

        // // 페이지 이동
        // this.router.navigate([path], extras);
    }
}
