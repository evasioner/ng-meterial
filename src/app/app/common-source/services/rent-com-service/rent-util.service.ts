import {Injectable} from '@angular/core';
import * as moment from "moment";


@Injectable({
    providedIn: 'root'
})
export class RentUtilService {

    constructor() {
    }

    /**
     * 24시간, 30분 단위 데이터
     */
    getSelectTimeList() {
        let tempNum = 0;
        const timeCount = 24 * 2;
        const tempList = [];

        for (let i = 0; i < timeCount; i++) {

            const temp = tempNum / 60;
            let hourStr;
            let minStr;

            const hour = (() => {
                hourStr = String(temp).split('.')[0];
                return this.numberPad(hourStr, 2);
            })();

            const min = (() => {
                minStr = String(temp).split('.')[1];
                if (minStr) {
                    return this.numberPad('30', 2);
                } else {
                    return this.numberPad(0, 2);
                }
            })();

            const tempObj = {
                val: `${hour}:${min}`
            };

            tempList.push(tempObj);

            tempNum += 30;
        }

        // console.info('[res 2]', tempList);
        return tempList;

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



}
