import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';

import * as _ from 'lodash';

import { StorageService } from '@/app/common-source/services/storage/storage.service';
import { HotelComService } from '@/app/common-source/services/hotel-com-service/hotel-com-service.service';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-hotel-new-search-list',
    templateUrl: './hotel-new-search-list.component.html',
    styleUrls: ['./hotel-new-search-list.component.scss']
})
export class HotelNewSearchListComponent extends BaseChildComponent implements OnInit {
    viewModel: any;
    dataModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private storageS: StorageService,
        private hotelComS: HotelComService,
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
            recent: this.storageS.getItem('local', 'recent').hotel || []
        };
        this.viewModel = {
            recentList: []
        };


        try {
            if (!_.isEmpty(this.dataModel.recent) && this.dataModel.recent.length > 0) {
                this.dataModel.recent.filter(
                    (item: any, key: any): any => {
                        if (_.has(item, ['rq', 'hCode'])) {
                            this.viewModel.recentList.push(
                                {
                                    index: key,
                                    hotelName: item.hotelName,
                                    dateRange: item.dateRange,
                                    roomList: this.parseRoomList(item.roomData)
                                }
                            );
                        }
                    }
                );

                if (this.viewModel.recentList.length > 1)
                    this.viewModel.recentList = _.orderBy(this.viewModel.recentList, ['index'], ['desc']);

                console.info('hotel recentList', this.viewModel.recentList);

            }
        } catch (error) {
            console.log(error);
            this.dataModel.recent = [];
            this.viewModel.recentList = [];
        }

    }

    private parseRoomList(item: any) {
        console.log(item);

        let adultCount = 0;
        let childCount = 0;

        item.map(
            (roomItem: any) => {
                if (roomItem.adultCount) {
                    adultCount += roomItem.adultCount;
                }

                if (roomItem.childCount) {
                    childCount += roomItem.childCount;
                }
            }
        );

        let roomList = '';
        if (adultCount) {
            roomList += `성인 ${adultCount}명, `;
        }

        if (childCount) {
            roomList += `아동 ${childCount}명, `;
        }

        roomList += `객실 ${item.length}개`;
        return roomList;
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
        this.storageS.removeRecentData('local', this.dataModel.recent, 'hotel', drIndex);
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

        this.hotelComS.goToHotelSearchRoomtype(this.dataModel.recent[drIndex].rq);
    }
}

