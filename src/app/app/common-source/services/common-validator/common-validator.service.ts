import { Injectable } from '@angular/core';
import { FormControl, AbstractControl, ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

import * as moment from 'moment';
import * as _ from 'lodash';
import { UtilDateService } from '../util-date/util-date.service';

@Injectable({
    providedIn: 'root'
})
export class CommonValidatorService {

    constructor(
        private scrollToService: ScrollToService,
        private utilDateS: UtilDateService
    ) { }

    /**
     * 커스텀 밸리데이션
     * @param config pattern 값, error 메시지
     *
     * invalidPattern = true  confi
     */
    customPattern(config: any, invalidPattern?: boolean): ValidatorFn {
        return (control: FormControl) => {
            const regExp: RegExp = config.pattern;
            let errorBool: boolean;

            if (invalidPattern)
                errorBool = String(control.value).match(regExp) ? true : false;
            else
                errorBool = !String(control.value).match(regExp) ? true : false;

            // console.info('[control >]', control);
            // console.info('[match >]', String(control.value).match(regExp));
            if (control.value && errorBool) {
                return {
                    invalidMsg: config.msg
                };
            } else {
                return {};
            }
        };
    }

    /**
     * 생년월일 밸리데이션
     * @param config error 메시지, age error 메시지, tgDay 기준 날짜, tgAge 만 나이
     * @param ageCompare
     */
    ageFormValidator(config: any, ageCompare?: any): ValidatorFn {

        console.info('ageValidator', config);
        return (control: FormControl) => {
            let compare = 'equal';
            const regExp: RegExp = /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])*$/;

            if (ageCompare)
                compare = ageCompare;

            //생년월일 정규식 불일치
            if (control.value && !String(control.value).match(regExp)) {
                return {
                    invalidMsg: config.msg
                };
            }

            //tgDay, tgAge 기준으로 입력한 생년월일이 조건에 맞지 않으면 invalid
            if (control.value && String(control.value).match(regExp)) {
                //만 나이 구하기
                const age: number = this.utilDateS.getOld(config.tgDay, control.value);
                const ageBool: Boolean = this.ageCompare(compare, age, Number(config.tgAge));
                if (!ageBool) {
                    return {
                        invalidMsg: config.ageMsg
                    };
                }
            }

            return {};

        };
    }

    /**
     *
     * @param config msg: 정규식 불일치 메세지, tgDay: 비교 날짜, tgAge: 비교 나이, compare: 비교 종류 (ageCompare 에서 사용될 값), ageCon: 날짜조건
     * @param typeCode INF (유아) or CHD (아동)
     */
    filghAgeFormValidator(config: any, typeCode: any): ValidatorFn {

        console.info('filghAgeValidator', config);
        return (control: FormControl) => {
            const compare = config.compare;
            const regExp: RegExp = /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])*$/;

            //생년월일 정규식 불일치
            if (control.value && !String(control.value).match(regExp)) {
                return {
                    invalidMsg: config.msg
                };
            }

            //tgDay, tgAge 기준으로 입력한 생년월일이 조건에 맞지 않으면 invalid
            if (control.value && String(control.value).match(regExp)) {
                let ageTypeTxt: any;
                const age: number = this.utilDateS.getOld(config.tgDay, control.value);   //만 나이 구하기
                const ageBool: Boolean = this.ageCompare(compare, age, Number(config.tgAge));

                if (typeCode === 'INF') {
                    ageTypeTxt = '유아 가';
                } else if (typeCode === 'CHD') {
                    ageTypeTxt = '아동 이';
                }

                const ageMsg = `${config.dateTitle} 날짜(${config.tgDay})에 맞는 만 ${age}살 ${ageTypeTxt} 없습니다. 연령 기준 <${config.ageCon}> 에 맞게 다시 조회하시거나 다른 항공사의 항공편을 이용 바랍니다.`;
                console.info('filghAgeValidator ageMsg', ageMsg);
                if (!ageBool) {
                    return {
                        invalidMsg: ageMsg
                    };
                }
            }
            return {};

        };
    }

    /**
      * 인수일 기준 아래 기준 인 경우, Alert 출력
      * - 국내 : 만 21세 미만
      * - 해외 : 만 18세 미만
      */
    rentAgeValidator(formDateStr: any, driverBirthdayStr: any, countryCode: any) {
        const pickupDate = _.replace(formDateStr, new RegExp('-', 'g'), '');
        const driverBirthday = _.replace(driverBirthdayStr, new RegExp('-', 'g'), '');

        const driverAge: number = this.utilDateS.getOld(pickupDate, driverBirthday);
        const manAgeLimit: number = _.isEqual(countryCode, 'KR') ? 21 : 18;
        const ageBool: Boolean = this.ageCompare('under', driverAge, manAgeLimit);
        return ageBool;
    }

    /**
     * 연산자 선택하여 나이 비교
     * @param compare ['equal', 'unequal', 'under', 'over', 'below', 'above']
     * @param age
     * @param tgAge
     */
    ageCompare(compare: any, age: number, tgAge: number) {
        let returnBool: boolean = false;
        switch (compare) {
            case 'equal':   // 일치
                returnBool = (age === tgAge);
                break;
            case 'unequal': // 불일치
                returnBool = (age !== tgAge);
                break;
            case 'under':   //미만
                returnBool = (age < tgAge);
                break;
            case 'over':    //초과
                returnBool = (age > tgAge);
                break;
            case 'below':   //이하
                returnBool = (age <= tgAge);
                break;
            case 'above':   //이상
                returnBool = (age >= tgAge);
                break;
        }
        console.info('age : ', age, ' / tgAge :', tgAge, ' / compare : ', compare, ' / return : ', returnBool);
        return returnBool;
    }

    /**
     * 영문(대/소문자)만 입력 받기
     * - 영문이 아닌 경우 제거
     * @param val
     */
    onlyEnInput(val: any) {
        const regexp = new RegExp(/[^a-zA-Z]+/, 'g'); // 영문이 아닌
        let res = val;

        if (val && regexp.test(val)) { // 영문이 아닐시 제거
            res = _.replace(res, regexp, '');
        }

        return res;
    }

    /**
     * 한글만 입력 받기
     * - 한글이 아닌 경우 제거
     * @param val
     */
    onlyKoInput(val: any) {
        const regexp = new RegExp(/[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/, 'g'); // 한글이 아닌
        let res = val;

        if (val && regexp.test(val)) { // 한글이 아닐시 제거
            res = _.replace(res, regexp, '');
        }

        return res;
    }

    /**
     * 숫자만 입력 받기
     * - 숫자가 아닌 경우 제거
     * @param val
     */
    onlyNumInput(val: any) {
        const regexp = new RegExp(/[^0-9]+/, 'g'); // 숫자가 아닌
        let res = val;

        if (val && regexp.test(val)) { // 숫자 아닐시 제거
            res = _.replace(res, regexp, '');
        }

        return res;
    }


    /**
     * 예약자 정보 입력페이지 > 약관 동의
     * - 모든 동의 체크
     * @param control
     */
    validateAgreeList(control: AbstractControl) {
        const val = control.value;
        const res = _.every(val, Boolean);

        if (res) { // 유효성 성공
            return null;
        } else {
            return { // errors return
                agreeList: control.value
            };
        }
    }

    /**
     * 예약자 정보 입력 페이지
     * - 유효성 체크 실패 시, target 스크롤 이동
     * @param targetId
     */
    scrollToTarget(targetId) {
        const config: ScrollToConfigOptions = {
            target: targetId,
            duration: 150,
            offset: -100
        };

        this.scrollToService.scrollTo(config);
    }

    /**
     * form ValidationErrors key reurn
     * - 첫번째 에러 항목만 가져온다.
     * @param form
     * @returns any
     */
    getFirstErrorKeyValidation(form: FormGroup) {
        let flag = true;
        let returnKey: any;
        Object.keys(form.controls).forEach(key => {
            const errors: ValidationErrors = form.get(key).errors;
            if (flag && errors != null) {
                Object.keys(errors).forEach(keyError => {
                    if (flag && errors[keyError]) {
                        console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', errors[keyError]);
                        returnKey = key;
                        flag = false;
                    }
                });
            }
        });
        return returnKey;
    }

    /**
     *
     * @param startDate
     * @param endDate
     * @param unit
     * @param limt
     * @return
     */
    isErrorDiff(startDate: any, endDate: any, unit: string, limt: number): boolean {
        const unitArr = ['days', 'months', 'years'];
        let isError: boolean = false; //  diff function 실행되지 않거나 or diffNum 이 limt 보다 작을 경우 => true
        let diffNum: number;
        let newStart: string = '';
        let newEnd: string = '';

        if (!_.includes(unitArr, unit)) {
            console.info('isErrorDiff error : not running on diff function');
            return isError;
        }

        switch (unit) {
            case 'days':
                newStart = moment(startDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
                newEnd = moment(endDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
                break;

            case 'months':
                newStart = moment(startDate, 'YYYY-MM-DD').format('YYYY-MM');
                newEnd = moment(endDate, 'YYYY-MM-DD').format('YYYY-MM');
                break;

            case 'years':
                newStart = moment(startDate, 'YYYY-MM-DD').format('YYYY');
                newEnd = moment(endDate, 'YYYY-MM-DD').format('YYYY');
                break;
        }

        diffNum = this.utilDateS.diff(newStart, newEnd, unit);

        if (diffNum <= limt) {
            isError = true;
        }

        console.info(`isUnderDate  diff: ${diffNum} ${unit}, limt: ${limt} ${unit}, isUnder: ${isError}`);

        return isError;
    }
}