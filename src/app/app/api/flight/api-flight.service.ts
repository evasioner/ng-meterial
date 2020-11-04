import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiFlightService {

    baseUrl: String;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json;charset=UTF-8'
        })
    };

    constructor(private http: HttpClient) {
        this.baseUrl = environment.API_URL;
    }

    /**
     * 추천 항공 조회
     */
    POST_FLIGHT_RECOMMEND($body?: any, $opt?: Object) {
        return this.httpPost('/flight/recommend', $body, $opt);
    }

    /**
     * 항공 검색
     */
    POST_FLIGHT_LIST_ITINERARY($body?: any, $opt?: Object) {
        return this.httpPost('/flight/list/itinerary', $body, $opt);
    }

    /**
     * 항공 현재 상황 조회
     */
    POST_FLIGHT_STATS($body?: any, $opt?: Object) {
        return this.httpPost('/flight/stats', $body, $opt);
    }

    /**
     * 항공 운임규정 조회
     */
    POST_FLIGHT_FARERULE($body?: any, $opt?: Object) {
        return this.httpPost('/flight/fare-rule', $body, $opt);
    }

    /**
     * 항공 Seg Hold
     */
    POST_FLIGHT_SEGHOLD($body?: any, $opt?: Object) {
        return this.httpPost('/flight/seg-hold', $body, $opt);
    }

    /**
     * 항공 비행상세 조회
     */
    POST_FLIGHT_DETAIL($body?: any, $opt?: Object) {
        return this.httpPost('/booking/flight/detail', $body, $opt);
    }

    /**
     * 항공 부가서비스 조회
     */
    POST_FLIGHT_ANCILLARY($body?: any, $opt?: Object) {
        return this.httpPost('/flight/ancillary', $body, $opt);
    }

    /**
     * 항공 위시에 추가
     */
    POST_FLIGHT_BASKET($body?: any, $opt?: Object) {
        return this.httpPost('/flight/basket', $body, $opt);
    }

    /**
     * 항공 요금 알리미에 추가
     */
    POST_FLIGHT_ALERT($body?: any, $opt?: Object) {
        return this.httpPost('/flight/alert', $body, $opt);
    }

    /**
     * 항공 중복 체크
     */
    POST_FLIGHT_DUPE($body?: any, $opt?: Object) {
        return this.httpPost('/flight/dupe', $body, $opt);
    }

    /**
     * 항공 churning 체크
     */
    POST_FLIGHT_CHURNING($body?: any, $opt?: Object) {
        return this.httpPost('/flight/Churning', $body, $opt);
    }

    /**
     * 항공 프로모션 조회
     */
    POST_FLIGHT_PROMOTION($body?: any, $opt?: Object) {
        return this.httpPost('/flight/promotion', $body, $opt);
    }

    /**
     * 항공 페널티 체크
     */
    POST_FLIGHT_PENALTY($body?: any, $opt?: Object) {
        return this.httpPost('/flight/penalty', $body, $opt);
    }

    /**
     * 항공 취소하기
     */
    POST_FLIGHT_CANCEL($body?: any, $opt?: Object) {
        return this.httpPost('/booking/flight/cancel', $body, $opt);
    }

    /**
     * 항공 마일리지카드 입력
     */
    POST_FLIGHT_MEMEBERSHIP($body?: any, $opt?: Object) {
        return this.httpPost('/flight/memebership', $body, $opt);
    }

    /**
     * 항공 APIS 입력
     */
    POST_FLIGHT_APIS($body?: any, $opt?: Object) {
        return this.httpPost('/flights', $body, $opt);
    }

    /**
     * 항공 현지체류지 입력
     */
    POST_FLIGHT_LOCALSTAY($body?: any, $opt?: Object) {
        return this.httpPost('/flight/localStay', $body, $opt);
    }

    /**
     * 항공 발권하기
     */
    POST_FLIGHT_TICKETING($body?: any, $opt?: Object) {
        return this.httpPost('/flight/ticketing', $body, $opt);
    }

    /**
     * 항공 SeatMap 보기
     */
    POST_FLIGHT_SEAT_MAP($body?: any, $opt?: Object) {
        return this.httpPost('/flight/seat/map', $body, $opt);
    }

    /**
     * 항공 SeatMap 지정
     */
    POST_FLIGHT_SEAT_ASSIGN($body?: any, $opt?: Object) {
        return this.httpPost('/flight/seat/assign', $body, $opt);
    }

    PUT_FLIGHT_BASKET($body?: any, $opt?: Object) {
        return this.httpPut('/flight/basket', $body, $opt);
    }

    httpPost($url, $body?: any, $opt?: Object) {
        const url = this.baseUrl + $url;
        const body = $body || {};
        const options = { ...this.httpOptions, ...$opt };

        return this.http.post(url, body, options);
    }

    httpPut($url, $body?: any, $opt?: Object) {
        const url = this.baseUrl + $url;
        const body = $body || {};
        const options = { ...this.httpOptions, ...$opt };

        return this.http.put(url, body, options);
    }
}
