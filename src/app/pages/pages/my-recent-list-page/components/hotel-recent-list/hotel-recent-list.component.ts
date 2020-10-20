import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';

import * as _ from 'lodash';

import { TranslateService } from '@ngx-translate/core';

import { StorageService } from '@app/common-source/services/storage/storage.service';
import { HotelComService } from '@app/common-source/services/hotel-com-service/hotel-com-service.service';

import { BaseChildComponent } from '@app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-hotel-recent-list',
    templateUrl: './hotel-recent-list.component.html',
    styleUrls: ['./hotel-recent-list.component.scss']
})
export class HotelRecentListComponent extends BaseChildComponent implements OnInit {
    viewModel: any;
    dataModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private storageS: StorageService,
        private hotelComS: HotelComService,
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
            recent: this.storageS.getItem('local', 'recent').hotel || []
        };
        this.viewModel = {
            recentList: []
        };

        if (!_.isEmpty(this.dataModel.recent) && this.dataModel.recent.length > 0) {
            this.dataModel.recent.filter(
                (item: any, key: any): any => {
                    if (_.has(item, ['rq', 'hCode'])) {
                        this.viewModel.recentList.push(
                            {
                                index: key,
                                hotelName: item.hotelName,
                                photoUrl: item.photoUrl,
                                dateRange: item.dateRange,
                                travelerInfo: item.travelerInfo
                                // roomList: this.parseRoomList(item.roomData)
                            }
                        );
                    }
                }
            );

            if (this.viewModel.recentList.length > 1)
                this.viewModel.recentList = _.orderBy(this.viewModel.recentList, ['index'], ['desc']);

            console.info('hotel recentList', this.viewModel.recentList);

        }
    }

    private parseRoomList(item: any) {
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

