import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class UtilDateService {

    constructor() { }

    toMoment(date: any) {
        return moment(date, 'YYYY-MM-DD');
    }

    /**
     * 만나이 구하기
     * @param $tgDay    | "YYYY-MM-DD or YYYYMMDD"
     * @param $birthday | "YYYY-MM-DD or YYYYMMDD"
     */
    getOld($tgDay: string, $birthday: string): number {
        const temp_tg = this.toMoment($tgDay);
        const temp_birthday = this.toMoment($birthday);

        // 기준 날짜의 연도에서 생년월일의 연도를 뺀 값을 age 변수에 저장
        const tgYear = Number(temp_tg.format('YYYY'));
        const birthYear = Number(temp_birthday.format('YYYY'));

        // 기준 날짜의 월과 생년월일의 월을 변수에 저장
        const tgMonth = Number(temp_tg.format('MM'));
        const birthMonth = Number(temp_birthday.format('MM'));

        // 기준 날짜의 date와 생생년월일의 date를 변수에 저장
        const tgDate = Number(temp_tg.format('DD'));
        const birthDate = Number(temp_birthday.format('DD'));

        console.info('$tgDay', $tgDay);
        console.info('[tgMonth]', tgMonth);
        console.info('[tgDate]', tgDate);
        console.info('$birthday', $birthday);
        console.info('[birthMonth]', birthMonth);
        console.info('[birthDate]', birthDate);

        const age = tgYear - birthYear;
        console.info('[age]', age);
        if (birthMonth < tgMonth) {
            return age;
        } else if (birthMonth > tgMonth) {
            console.info('age - 1', age - 1);
            return age - 1;
        } else {
            if (birthDate > tgDate) {
                console.info('age - 1', age - 1);
                return age - 1;
            } else {
                return age;
            }
        }

    }

    /**
     *
     * @param startDate
     * @param endDate
     * @param unit      // days || months || years
     */
    diff(startDate: string, endDate: string, unit: any): number {
        return moment(endDate).diff(moment(startDate), unit);
    }

}
