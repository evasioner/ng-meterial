import { Injectable } from '@angular/core';

import * as _ from "lodash";
import * as moment from "moment";

import { environment } from '@/environments/environment';

import { HotelComService } from 'src/app/common-source/services/hotel-com-service/hotel-com-service.service';

@Injectable({
    providedIn: 'root'
})
export class HotelSearchResultService {

    constructor(
        private comService: HotelComService,
    ) { }

    makeHotelListRq($routeData) {
        console.info("makeHotelListRq > routeData" + $routeData);
        const checkInDate = `${moment($routeData.chkIn).format('YYYY-MM-DD')}`;
        const checkOutDate = `${moment($routeData.chkOut).format('YYYY-MM-DD')}`;

        // ---------[객실 정보]
        const roomInfo = $routeData.roomList;
        const roomList = this.comService.makeRoomCondition(roomInfo);
        // ---------[end 객실 정보]


        const rq: any = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                rooms: roomList,
                dynamicRateYn: false,
                limits: [0, 10],
                sortOrder: "Recommend",
                filter: {}
            }
        };


        const detail = $routeData.detail;
        if (detail) {
            if (_.has(detail, "price")) {
                const amount: any = {};
                const deCodePrice = this.comService.deCodingStr(detail.price, '', '@');
                amount.lowestAmount = Number(deCodePrice[0]);
                amount.highestAmount = Number(deCodePrice[1]);
                rq.condition.filter.amount = amount;
            }

            if (_.has(detail, "review")) {
                const deCodeReview = this.comService.deCodingStr(detail.review, '', '@');
                rq.condition.filter.reviewRatings = {
                    lowestRating: Number(deCodeReview[0]),
                    highestRating: Number(deCodeReview[1])
                };
            }

            if (_.has(detail, "star")) {
                const deCodeStar = this.comService.deCodingStr(detail.star, '', '@');
                rq.condition.filter.starRatings = deCodeStar;
            }
        }

        const codeName = this.comService.getDestinationCodeName($routeData.cityGubun);
        if (codeName === "poiSeq")
            rq.condition[codeName] = Number($routeData.city);
        else
            rq.condition[codeName] = $routeData.city;

        if (_.has($routeData, "filter")) {

            //호텔 성급
            if (_.has($routeData.filter, "starRatings")) {
                const deCodeStar = this.comService.deCodingStr($routeData.filter.starRatings, '', '@');
                rq.condition.filter.starRatings = deCodeStar;
            }

            //가격대
            if (_.has($routeData.filter, "amount")) {
                const amount: any = {};
                const deCodePrice = this.comService.deCodingStr($routeData.filter.amount, '', '@');
                amount.lowestAmount = Number(deCodePrice[0]);
                amount.highestAmount = Number(deCodePrice[1]);
                rq.condition.filter.amount = amount;
            }

            //숙소유형
            if (_.has($routeData.filter, "hotelTypes")) {
                const deCodeHotelType = this.comService.deCodingStr($routeData.filter.hotelTypes, '', '@');
                rq.condition.filter.hotelTypes = _.map(deCodeHotelType, ($item) => {
                    return { 'code': $item };
                });
            }

            // poi
            if (_.has($routeData.filter, "poi")) {
                const poi: any = {};
                //인근지역
                if (_.has($routeData.filter.poi, "attractions")) {
                    const deCodeAttraction = this.comService.deCodingStr($routeData.filter.poi.attractions, '', '@');
                    poi.attractions = _.map(deCodeAttraction, ($item) => {
                        const item = Number($item);
                        return { 'code': item };
                    });
                }

                if (!_.isEmpty(poi))
                    rq.condition.filter.poi = poi;
            }

            //이용자 평점
            if (_.has($routeData.filter, "reviewRatings")) {
                const deCodeReview = this.comService.deCodingStr($routeData.filter.reviewRatings, '', '@');
                rq.condition.filter.reviewRatings = {
                    lowestRating: Number(deCodeReview[0]),
                    highestRating: Number(deCodeReview[1])
                };
            }

            //호텔 체인
            if (_.has($routeData.filter, "chains")) {
                const chains: any = [];
                const chainDecode = this.comService.deCodingStr($routeData.filter.chains, '', '@');
                _.forEach(chainDecode, (item) => {
                    const split = _.split(item, '^');
                    const code = split[0];
                    const brands: any = [];
                    const brandSplit = _.split(split[1], ',');
                    _.forEach(brandSplit, (item2) => {
                        brands.push({ code: item2 });
                    });

                    chains.push({
                        code: code,
                        brands: brands
                    });

                });
                rq.condition.filter.chains = chains;
            }

            // others
            if (_.has($routeData.filter, "others")) {
                const others: any = {};

                //호텔명
                if (_.has($routeData.filter.others, "hotelName")) {
                    others.hotelName = $routeData.filter.others.hotelName;
                }

                //조식포함
                if (_.has($routeData.filter.others, "freeBreakfast")) {
                    const freeDecode = this.comService.deCodingStr($routeData.filter.others.freeBreakfast, '', '@');
                    if (freeDecode.length === 1) {
                        let freeBool: boolean;
                        if (freeDecode[0] == 'true') {
                            freeBool = Boolean(true);
                        } else if (freeDecode[0] == 'false') {
                            freeBool = Boolean(false);
                        }
                        others.freeBreakfast = freeBool;
                    }
                }

                if (!_.isEmpty(others)) {
                    rq.condition.filter.others = others;
                }
            }
        }

        if (_.has($routeData, "sortOrder")) {
            rq.condition.sortOrder = $routeData.sortOrder;
        }

        if (_.has($routeData, "hotelSearchTrd")) {
            rq.transactionSetId = $routeData.hotelSearchTrd;
        }

        if (Object.keys(rq.condition.filter).length === 0) {
            delete rq.condition.filter;
        }


        console.log("bppp;", rq);
        return rq;
    }
}

