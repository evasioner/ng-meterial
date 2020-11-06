import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as qs from 'qs';
import * as _ from 'lodash';
import * as moment from 'moment';

import { StorageService } from '@/app/common-source/services/storage/storage.service';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';


@Component({
    selector: 'app-flight-recent-list',
    templateUrl: './flight-recent-list.component.html',
    styleUrls: ['./flight-recent-list.component.scss']
})
export class FlightRecentListComponent extends BaseChildComponent implements OnInit {
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

    private initialize(): void {
        this.dataModel = {
            recent: this.storageS.getItem('local', 'recent').flight || []
        };
        this.viewModel = {
            recentList: []
        };

        try {
            if (!_.isEmpty(this.dataModel.recent) && this.dataModel.recent.length > 0) {
                this.dataModel.recent.map(
                    (item: any, key: any): any => {
                        if (_.has(item, 'rq')) {
                            const newItem = {
                                index: key,
                                bookingName: '',
                                travelers: (item.vm.travelerStore.cabinClassTxt),
                                cabinClass: (item.vm.travelerStore.cabinClassNm),
                                tripType: item.vm.trip.tripTypeCode,
                                dateRange: item.vm.trip.destination[0].dateRange,
                                trip: item.vm.trip
                            };

                            item.vm.trip.destination.map(
                                (subItem: any, subIndex: number): any => {
                                    switch (item.vm.tripTypeCode) {
                                        case 'OW':
                                            if (subIndex === 0) {
                                                newItem.tripType = '편도';
                                                newItem.dateRange = moment(subItem.date, 'YYYY-MM-DD').format('MM.DD (ddd)');
                                                newItem.trip = [
                                                    `${subItem.origin.val} ${subItem.origin.name}`,
                                                    { className: 'icon sm departure' },
                                                    `${subItem.dest.val} ${subItem.dest.name}`
                                                ];
                                            }
                                            break;

                                        case 'RT':
                                            if (subIndex === 0) {
                                                newItem.tripType = '왕복';
                                                newItem.dateRange = subItem.dateRange;
                                                newItem.trip = [
                                                    `${subItem.origin.val} ${subItem.origin.name}`,
                                                    { className: 'icon sm roundtrip3' },
                                                    `${subItem.dest.val} ${subItem.dest.name}`
                                                ];
                                            }
                                            break;

                                        case 'MD':
                                            if (subIndex === 0) {
                                                newItem.tripType = '다구간';
                                                newItem.dateRange = `${moment(subItem.date, 'YYYY-MM-DD').format('MM.DD (ddd)')} - `;
                                                newItem.trip = [
                                                    `${subItem.origin.val} ${subItem.origin.name}`,
                                                    { className: 'icon sm departure' },
                                                ];
                                            } else if (subIndex === (item.vm.trip.destination.length - 1)) {
                                                newItem.dateRange += `${moment(subItem.date, 'YYYY-MM-DD').format('MM.DD (ddd)')}`;
                                                newItem.trip.push(
                                                    `${subItem.dest.val} ${subItem.dest.name}`
                                                );
                                            } else {
                                                newItem.trip.push(
                                                    `${subItem.dest.val} ${subItem.dest.name}`
                                                );
                                                newItem.trip.push(
                                                    { className: 'icon sm departure' }
                                                );
                                            }
                                            break;
                                    }
                                }
                            );

                            this.viewModel.recentList.push(newItem);
                        }
                    }
                );
                if (this.viewModel.recentList.length > 1)
                    this.viewModel.recentList = _.orderBy(this.viewModel.recentList, ['index'], ['desc']);

                console.info('flight recentList', this.viewModel.recentList);
            }
        } catch (error) {
            console.log(error);
            this.dataModel.recent = [];
            this.viewModel.recentList = [];
        }

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
        * @param vrIndex viewModel.recentList 삭제 대상 배열 번호
        * @param drIndex dataModel.recent     삭제 대상 배열 번호
        */
    public onDeleteItem(event: any, vrIndex: number, drIndex: number): void {
        event && event.preventDefault();

        this.viewModel.recentList.splice(vrIndex, 1);
        this.storageS.removeRecentData('local', this.dataModel.recent, 'flight', drIndex);
    }

    /**
     * onSearchResult
     * 아이템 검색 결과
     *
     * @param event dom 이벤트
     * @param index 삭제 대상 배열 번호
     */
    public onSearchResult(event: any, drIndex: number): void {
        event && event.preventDefault();

        const request: any = {
            rq: this.dataModel.recent[drIndex].rq,
            vm: this.dataModel.recent[drIndex].vm,
            detailUpdate: this.dataModel.recent[drIndex].detailUpdate || undefined,
            alignUpdate: this.dataModel.recent[drIndex].alignUpdate || undefined
        };

        const incodingOpt = {
            encodeValuesOnly: true
        };

        //항공(가는편)으로 이동(왕복, 편도)
        const queryString = qs.stringify(request, incodingOpt);
        let path = '/flight-search-result-go/';

        //항공(다구간)으로 이동
        if (this.dataModel.recent[drIndex].vm.tripTypeCode === 'MD') {
            path = '/flight-search-result-multi/';
        }

        path += queryString;
        const extras = {
            relativeTo: this.route
        };

        // 페이지 이동
        this.router.navigate([path], extras);
    }
}



