import { Injectable } from '@angular/core';

import { environment } from '@/environments/environment';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class HotelSearchRoomtypeService {

    constructor() { }

    makeHotelRoomListRq({ resolveData, hotelInfoTrd, roomList }) {
        console.info('[makeHotelRoomListRq]', resolveData);
        const con: any = {
            hotelCode: resolveData.hCode,
            checkInDate: resolveData.chkIn,
            checkOutDate: resolveData.chkOut,
            rooms: roomList,
            dynamicRateYn: false
            // , 쓸 수 있을거 같음.
            // filter: (resolveData.filter || null)
        };

        if (_.has(resolveData, 'regionCode'))
            con.regionCode = resolveData.regionCode;

        const result = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            transactionSetId: hotelInfoTrd,
            condition: con,
        };

        return result;
    }
}