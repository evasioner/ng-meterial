import { Injectable } from '@angular/core';

import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    recentMaxLength: number;
    recentCityLength: number;
    constructor() {
        this.recentMaxLength = 10;
        this.recentCityLength = 3;
    }

    /**
     * setItem
     * 세션 또는 로컬 스토리지에 저장
     *
     * @param target 'session' = sessionStorage, 'local' = localStorage
     * @param key 저장 key
     * @param data 저장할 데이터
     *
     * @returns boolean
     */
    public setItem(target: string = 'session', key: string, data: any): boolean {
        try {
            let storageData = this.getItem(target, key);
            storageData = { ...storageData, ...data };
            const stringData = JSON.stringify(storageData);
            window[`${target}Storage`].setItem(key, stringData);

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * getItem
     * 세션 또는 로컬 스토리지에 꺼내기
     *
     * @param target 'session' = sessionStorage, 'local' = localStorage
     * @param key 저장 key
     *
     * @returns object
     */
    public getItem(target: string = 'session', key: string): any {
        try {
            const stringData = window[`${target}Storage`].getItem(key);
            return { ...JSON.parse(stringData) };
        } catch (error) {
            return {};
        }
    }

    /**
     * removeItem
     * 세션 또는 로컬 스토리지에 키 아이템 삭제
     *
     * @param target 'session' = sessionStorage, 'local' = localStorage
     * @param key 저장 key
     *
     * @returns boolean 성공, 실패
     */
    public removeItem(target: string = 'session', key: string): boolean {
        try {
            window[`${target}Storage`].removetItem(key);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * clear
     * 세션 또는 로컬 스토리지 삭제
     *
     * @param target 'session' = sessionStorage, 'local' = localStorage
     * @param key 저장 key
     *
     * @returns boolean 성공, 실패
     */
    public clear(target: string = 'session') {
        try {
            window[`${target}Storage`].clear();
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * makeRecentData
     * recent 저장 데이터 만들기
     *
     * @param target 'session' = sessionStorage, 'local' = localStorage
     * @param data 데이터
     * @param key 저장 위치 배열
     * @param recentKey cities일 경우 저장 위치
     */
    public makeRecentData(target: string, data: any, key: string, recentKey?: string): void {
        if (_.isEmpty(data)) {
            return;
        }

        const storageData = this.getItem(target, 'recent');
        if (!_.has(storageData, key)) {
            storageData[key] = recentKey ? {} : [];
        }
        storageData[key].constructor === 'Array' && storageData[key].legnth >= this.recentMaxLength && storageData[key].shift();
        switch (key) {
            case 'flight':
                storageData[key].forEach(
                    (item: any): any => {
                        if (!_.has(item, 'alignUpdate')) {
                            item.alignUpdate = undefined;
                        }

                        if (!_.has(item, 'detailUpdate')) {
                            item.detailUpdate = undefined;
                        }
                    }
                );
                break;

            case 'activity':
                break;

            case 'airtel':

                break;

            case 'rent':
                storageData[key].forEach(
                    (item: any): any => {
                        if (!_.has(item, 'alignUpdate')) {
                            item.alignUpdate = undefined;
                        }

                        if (!_.has(item, 'detailUpdate')) {
                            item.detailUpdate = undefined;
                        }
                    }
                );
                break;

            case 'hotel':

                break;
            default:
                if (!_.has(storageData[key], recentKey)) {
                    storageData[key][recentKey] = [];
                } else {
                    //중복된 값 걸러 내기
                    storageData[key][recentKey] = this.storeageFiltering(storageData[key][recentKey], data);
                }

                // 도시검색 > 최근검색 은 최대 3개 노출, storageData 3개 이면 마지막 data 제거
                storageData[key][recentKey].length >= this.recentCityLength && storageData[key][recentKey].shift();

                break;
        }

        if (recentKey) { // 도시 검색 > 최근검색 클릭시
            storageData[key][recentKey].push(data);
        } else {
            //중복된 값 걸러 내기
            const storage = _.cloneDeep(storageData[key]);
            storageData[key] = this.storeageFiltering(storage, data);
            //storageData 에 추가
            storageData[key].push(data);
        }

        this.setItem(target, 'recent', storageData);
    }

    storeageFiltering(storageArr: Array<any>, dataObj: any) {
        const returnObj = _.filter(storageArr, (o) => {
            return !_.isEqual(o, dataObj);
        });

        return returnObj;
    }

    /**
     * removeRecentData
     *
     * @param target 'session' = sessionStorage, 'local' = localStorage
     * @param data 데이터
     * @param key 저장 위치 배열
     * @param index 삭제할 데이터 번호
     */
    public removeRecentData(target: string, data: any, key: string, index: number): void {
        const storageData = this.getItem(target, 'recent');
        data.splice(index, 1);
        storageData[key] = data;
        this.setItem(target, 'recent', storageData);
    }
}
