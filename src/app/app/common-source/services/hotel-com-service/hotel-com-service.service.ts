import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as qs from 'qs';

import { HotelModalTravelerOptionComponent } from '../../modal-components/hotel-modal-traveler-option/hotel-modal-traveler-option.component';
import { CommonModalAlertComponent } from '../../modal-components/common-modal-alert/common-modal-alert.component';

@Injectable({
    providedIn: 'root'
})
export class HotelComService {

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private bsModalService: BsModalService
    ) { }


    /**
     * 호텔 룸타입  선택 페이지 이동
     * @param $rq
     */
    goToHotelSearchRoomtype($rq) {
        console.info('go to HotelSearchRoomtype');
        const qsStr = qs.stringify($rq);
        const path = '/hotel-search-roomtype/' + qsStr;
        // 페이지 이동후 생명주기 재실행
        this.router.navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate([path]));
    }

    openHotelTravelerOption($isType) {
        // 모달 전달 데이터
        const initialState = $isType;

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalService.show(HotelModalTravelerOptionComponent, { initialState, ...configInfo });
    }

    makeRoomCondition($travelerOpt) {
        const hotelTravelerOption = $travelerOpt;
        const travelerInfo = _.split(hotelTravelerOption, '@');
        const roomList: any = [];
        _.forEach(travelerInfo, (item) => {
            const pSplit = _.split(item, '^');
            const adultNum: number = _.toNumber(pSplit[0]);
            const childNum: number = _.toNumber(pSplit[1]);
            const childAges: any = [];

            if (childNum > 0) {
                const cAgeSplit = _.split(pSplit[2], ',');
                _.forEach(cAgeSplit, (item2) => {
                    childAges.push(_.toNumber(item2));
                });
            }

            roomList.push({
                adultCount: adultNum,
                childCount: childNum,
                childAges: childAges
            });

        });

        console.info('roomCondition', roomList);

        return roomList;
    }

    getTravelerInfo(travelerOpt: any, decodeBool: boolean) {
        console.info('getTravelerInfo', travelerOpt);
        const roomList: any = decodeBool ? this.makeRoomCondition(travelerOpt) : travelerOpt;
        const roomNum: number = roomList.length;
        let returntxt: string;
        let adultNum: number = 0;
        let childrenNum: number = 0;

        for (const roomItem of roomList) {
            adultNum += _.toNumber(roomItem.adultCount);
            childrenNum += roomItem.childAges.length;
        }

        returntxt = `객실${roomNum}, 성인${adultNum}`;
        returntxt += (childrenNum > 0) ? `, 아동${childrenNum}` : '';
        return returntxt;
    }

    /**
     * 호텔 모달 상세 검색
     * 선택된 항목 텍스트 생성
     * @param $detailOpt
     */
    getDetailOptInfo($detailOpt) {
        let detailInfo: string = '';
        console.info('[getDetailOptInfo]', $detailOpt);

        if ($detailOpt.priceRanges) {
            console.info('priceMin *****************');
            detailInfo += $detailOpt.priceRanges.min + '원 ~ ';
            detailInfo += $detailOpt.priceRanges.max + '원';
            if ($detailOpt.starRatings || $detailOpt.reviewRatings)
                detailInfo += ', ';
        }

        if ($detailOpt.reviewRatings) {
            console.info('reviewMin *****************');
            detailInfo += '평점 ' + $detailOpt.reviewRatings.min + '점 ~ ';
            detailInfo += $detailOpt.reviewRatings.max + '점';
            if ($detailOpt.starRatings)
                detailInfo += ', ';
        }

        // //호텔 성급
        if ($detailOpt.starRatings) {
            let star: any = '';
            const starLen: number = $detailOpt.starRatings.length;
            _.map($detailOpt.starRatings, ($item, index) => {
                console.info('$item ', $item);
                const num = _.toNumber($item).toFixed();
                star += num + '성급';

                if (starLen !== Number(index) + 1)
                    star += ', ';

                console.info('star ' + star);
            });

            detailInfo += star;
        }

        console.info('getDetailOptInfo', detailInfo);

        return detailInfo;
    }

    /**
     * 호텔 리스트 defaultPhotoUrl 화질 변경
     * @param $hotels
     */
    changeDefaultPhotoUrl($hotels) {
        const hotels = JSON.parse(JSON.stringify($hotels));
        hotels.forEach((item, index) => {
            console.info(index, ' : ', item.defaultPhotoUrl);
            let resultUrl = '';
            if (item.defaultPhotoUrl)
                resultUrl = this.replacePhotoUrl(item.defaultPhotoUrl);

            try {
                const imageElement = new Image();
                imageElement.src = resultUrl;
                imageElement.onload = () => {
                    item.defaultPhotoUrl = resultUrl;
                };
            } catch (e) {
                console.error(e);
            }

        });

        return hotels;
    }

    /**
     * 호텔 사진 화질 변경
     *  _z -> _y
     * @param url
     */

    replacePhotoUrl(url: string) {
        return url.replace('_z', '_y');
    }

    /**
     * object or Array
     * @param $val
     */

    isObjOrArr($val) {
        return _.isObject($val) || _.isArray($val) || false;
    }

    /**
     *
     * @param incodStr
     * @param decKey
     * @param decStep
     */
    deCodingStr(incodStr, decKey, decStep) {
        const decCoding = [];
        const decArr = _.split(incodStr, decStep);
        _.forEach(decArr, (dec1) => {
            if (decKey) {
                const dObj: any = {};
                dObj[decKey] = dec1;
                decCoding.push(dObj);
            } else {
                if (dec1)
                    decCoding.push(dec1);
            }
        });

        console.info('deCodingStr', decCoding);
        return decCoding;
    }


    /**
     *
     * @param $detailOpt
     */
    deCodingDetailOpt($detailOpt) {
        const detail = $detailOpt;
        const dObj: any = {};
        if (detail) {
            if (_.has(detail, 'price')) {
                const priceRanges: any = {};
                const deCodPrice = this.deCodingStr(detail.price, '', '@');
                priceRanges.min = Number(deCodPrice[0]);
                priceRanges.max = Number(deCodPrice[1]);
                console.info('메인에서 선택된  필터값 있음1', priceRanges);
                dObj.priceRanges = priceRanges;
            }

            if (_.has(detail, 'review')) {
                const reviewRatings: any = [];
                const deCodReview = this.deCodingStr(detail.review, '', '@');
                reviewRatings.min = Number(deCodReview[0]);
                reviewRatings.max = Number(deCodReview[1]);
                dObj.reviewRatings = reviewRatings;
            }

            if (_.has(detail, 'star')) {
                const deCodStar = this.deCodingStr(detail.star, '', '@');
                dObj.starRatings = deCodStar;
            }
        }

        return dObj;
    }

    /**
     * 도시/목적지 검색에서 선택한 항목에 따른
     * (regions, airports, pois, hotels 중 )
     * rq condition 에 들어갈 속성명 get
     * @param $type
     */
    getDestinationCodeName($type) {
        let returnName = '';
        switch ($type) {
            case 'major':
                returnName = 'regionCode';
                break;

            case 'regions':
                returnName = 'regionCode';
                break;

            case 'airports':
                returnName = 'regionCode';
                break;

            case 'pois':
                returnName = 'poiSeq';
                break;

            case 'hotels':
                returnName = 'hotelCode';
                break;
        }

        return returnName;
    }

    timerAlert($txt) {
        const initialState = {
            titleTxt: $txt,
            closeObj: {
                fun: () => {
                    this.router.navigateByUrl(`/`, { skipLocationChange: true }).then(
                        () => {
                            this.router.navigateByUrl(this.route.snapshot['_routerState'].url);
                        });
                }
            },
            okObj: {
                fun: () => {
                    this.router.navigateByUrl(`/`, { skipLocationChange: true }).then(
                        () => {
                            this.router.navigateByUrl(this.route.snapshot['_routerState'].url);
                        });
                }
            }
        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
    }

    /**
      * 24시간, 시간 단위 데이터
      * toDay 20시 ~ nextDay 04시
      */
    getCheckInTimeList() {
        let tempNum = 0;
        const timeCount = 24 * 1;
        const tempList = [];
        const tempList2 = [];

        for (let i = 0; i < timeCount; i++) {

            const temp = tempNum / 60;

            const hour24 = (() => {
                const hour24Str = String(temp).split('.')[0];
                return this.numberPad(hour24Str, 2);
            })();

            let hour12;
            const hour: any = parseInt(hour24, 10);
            if (hour == 0) { //24시 경우, 12 표기
                hour12 = hour;
            } else {
                hour12 = hour % 12;
            }

            const tempObj = {
                txt: '',
                rqTxt: '',
                time: `${hour24}:00`,
                val: ''
            };

            if (i <= 4) {

                let am = 'AM0';
                if (hour12 < 10)
                    am += '0';

                tempObj.txt = '익일 새벽';
                tempObj.rqTxt = 'Check-in next day';
                tempObj.val = am + hour12; //am 04:00 -> PM004 or am 12:00 -> AM000
                tempList.push(tempObj);
            }


            if (i >= 20) {
                let pm = 'PM0';
                if (hour12 < 10)
                    pm += '0';

                tempObj.txt = '체크인 당일 밤';
                tempObj.rqTxt = 'Check-in day';
                tempObj.val = pm + hour12; //pm 08:00 -> PM008 or pm 23:00 -> PM011
                tempList2.push(tempObj);
            }

            tempNum += 60;
        }
        const returnList = _.concat(tempList2, tempList);
        return returnList;

    }

    /**
     * 3 을 03 으로 표현
     * ex) numberPad(3, 2) > 03
     * @param n 데이터
     * @param width
     */
    numberPad($n, width) {
        const n = $n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
    }

    /**
     * 메인 검색 or 재검색 사용
     * 도시 검색에서 호텔 선택시
     * 호텔 룸타입 선택 페이지 이동
     * @param $vm
     */
    onDstinationHotelDtl($vm) {
        const rqInfo = {
            hCode: $vm.hotelCity.val,
            // cityGubun: this.vm.hotelCity.codeName,
            // cityName: this.vm.hotelCity.cityName,
            chkIn: $vm.checkDate.in,
            chkOut: $vm.checkDate.out,
            roomList: $vm.hotelTravelerOption.roomList
        };

        console.info('[데이터 rqInfo]', rqInfo);
        this.goToHotelSearchRoomtype(rqInfo);
    }

}
