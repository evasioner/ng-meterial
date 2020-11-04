import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as qs from 'qs';
import * as _ from 'lodash';
import * as moment from 'moment';

import { StorageService } from '@/app/common-source/services/storage/storage.service';
import { HotelComService } from '@/app/common-source/services/hotel-com-service/hotel-com-service.service';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';


@Component({
    selector: 'app-all-recent-list',
    templateUrl: './all-recent-list.component.html',
    styleUrls: ['./all-recent-list.component.scss']
})
export class AllRecentListComponent extends BaseChildComponent implements OnInit {
    viewModel: any;
    dataModel: any;


    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private storageS: StorageService,
        private router: Router,
        private route: ActivatedRoute,
        private hotelComS: HotelComService,
    ) {
        super(platformId);

        this.initialize();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    private initialize(): void {
        const recentData: any = this.storageS.getItem('local', 'recent');

        this.dataModel = {
            activity: [],
            flight: [],
            rent: [],
            hotel: [],

        };
        this.viewModel = {
            recentList: {
                flight: [],
                rent: [],
                hotel: [],
                activity: [],
            }
        };

        Object.entries(recentData).map(
            ([key, value]: any) => {
                console.log(key, value);
                this.dataModel[key] = value;

                switch (key) {
                    case 'flight':
                        try {
                            if (value.length > 0) {
                                value.map(
                                    (item: any, key: number) => {

                                        if (_.has(item, 'rq')) {
                                            const newItem = {
                                                index: key,
                                                travelers: this.parseTraveler(item.vm.travelerStore) + item.vm.travelerStore.cabinClassNm,
                                                cabinClass: (item.vm.travelerStore.cabinClassTxt),
                                                tripType: item.vm.trip.tripTypeCode,
                                                dateRange: item.vm.trip.destination[0].dateRange,
                                                startName: item.vm.trip.destination[0].origin.name,
                                                startVal: item.vm.trip.destination[0].origin.val,
                                                endName: item.vm.trip.destination[1].origin.name,
                                                endVal: item.vm.trip.destination[1].origin.val,
                                                bookingName: '',
                                                trip: [],
                                                pickLocation: this.parseLocation(),
                                                locationAccept: item.locationAccept,
                                                locationReturn: item.locationReturn,
                                                vehicleName: item.vehicleName,
                                                photoUrls: item.photoUrls
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

                                            this.viewModel.recentList.flight.push(newItem);
                                        }


                                    }
                                );
                            }
                        } catch (error) {
                            console.log(error);
                            this.dataModel.recent = [];
                            this.viewModel.recentList = [];
                        }

                        break;

                    case 'rent':
                        try {
                            if (value.length > 0) {
                                value.map(
                                    (item: any, index: number) => {
                                        this.viewModel.recentList.rent.push(
                                            {
                                                index: key,
                                                dateRange: item.dateRange,
                                                pickLocation: this.parseLocation(),
                                                locationAccept: item.resolveData.locationAccept.name,
                                                locationReturn: item.resolveData.locationReturn.name,
                                                // vehicleName: item.vehicleName,
                                            }
                                        );
                                    }
                                );
                            }
                        } catch (error) {
                            console.log(error);
                            this.dataModel.recent = [];
                            this.viewModel.recentList = [];
                        }

                        break;

                    case 'hotel':
                        try {
                            if (value.length > 0) {
                                value.map(
                                    (item: any, index: number) => {
                                        this.viewModel.recentList.hotel.push(
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
                                );
                            }
                        } catch (error) {
                            console.log(error);
                            this.dataModel.recent = [];
                            this.viewModel.recentList = [];
                        }

                        break;

                    case 'activity':
                        try {
                            if (value.length > 0) {
                                value.map(
                                    (item: any, index: number) => {
                                        if (_.has(item, 'resolveData')) {
                                            this.viewModel.recentList.activity.push(
                                                {
                                                    index: key,
                                                    cityNameLn: item.cityNameLn,
                                                    // dateRange: item.dateRange,
                                                    vendorCompName: item.vendorCompName,
                                                    activityNameEn: item.activityNameEn,
                                                    includedDetail: item.includedDetail,
                                                    photoUrl: item.photoUrl
                                                    // travelers: this.parseTraveler(item.vm.travelerStore)
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        } catch (error) {
                            console.log(error);
                            this.dataModel.recent = [];
                            this.viewModel.recentList = [];
                        }

                        break;

                    case 'key':

                        break;
                }
            }
        );

        console.info('dataModel', this.dataModel);
        console.info('viewModel', this.viewModel);

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

    private parseLocation() {
        if (_.isEqual(this.dataModel.rent.locationAccept, this.dataModel.rent.locationReturn)) {
            return '대여/반납 장소가 같음';
        } else {
            return '대여/반납 장소가 다름';
        }
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
    public rentOnDeleteItem(event: any, vrIndex: number,): void {
        event && event.preventDefault();

        this.viewModel.recentList.rent.splice(vrIndex, 1);
        this.storageS.removeRecentData('local', this.dataModel.rent, 'rent', vrIndex);
    }
    public hotelOnDeleteItem(event: any, vrIndex: number): void {
        event && event.preventDefault();

        this.viewModel.recentList.hotel.splice(vrIndex, 1);
        this.storageS.removeRecentData('local', this.dataModel.hotel, 'hotel', vrIndex);
    }
    public flightOnDeleteItem(event: any, vrIndex: number): void {
        event && event.preventDefault();

        this.viewModel.recentList.flight.splice(vrIndex, 1);
        this.storageS.removeRecentData('local', this.dataModel.flight, 'flight', vrIndex);
    }
    public activityOnDeleteItem(event: any, vrIndex: number): void {
        event && event.preventDefault();

        this.viewModel.recentList.activity.splice(vrIndex, 1);
        this.storageS.removeRecentData('local', this.dataModel.activity, 'activity', vrIndex);
    }
    /**
     * onSearchResult
     * 아이템 검색 결과
     *
     * @param event dom 이벤트
     * @param index 삭제 대상 배열 번호
     */
    public flightOnSearchResult(event: any, drIndex: number): void {
        event && event.preventDefault();

        const request: any = {
            rq: this.dataModel.flight[drIndex].rq,
            vm: this.dataModel.flight[drIndex].vm,
            detailUpdate: this.dataModel.flight[drIndex].detailUpdate || undefined,
            alignUpdate: this.dataModel.flight[drIndex].alignUpdate || undefined
        };

        const incodingOpt = {
            encodeValuesOnly: true
        };

        //항공(가는편)으로 이동(왕복, 편도)
        const queryString = qs.stringify(request, incodingOpt);
        let path = '/flight-search-result-go/';

        //항공(다구간)으로 이동
        if (this.dataModel.flight[drIndex].vm.tripTypeCode === 'MD') {
            path = '/flight-search-result-multi/';
        }

        path += queryString;
        const extras = {
            relativeTo: this.route
        };

        // 페이지 이동
        this.router.navigate([path], extras);
    }
    public rentOnSearchResult(event: any, drIndex: number): void {
        event && event.preventDefault();

        const qsStr = qs.stringify(this.dataModel.rent[drIndex].resolveData);
        const path = '/rent-search-result/' + qsStr;
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    public hotelOnSearchResult(event: any, drIndex: number): void {
        event && event.preventDefault();

        this.hotelComS.goToHotelSearchRoomtype(this.dataModel.hotel[drIndex].rq);
    }
    public activityOnSearchResult(event: any, index: number): void {
        event && event.preventDefault();

        const qsStr = qs.stringify(this.dataModel.activity[index].resolveData);
        const path = '/activity-search-result-detail/' + qsStr;
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);

    }
}



