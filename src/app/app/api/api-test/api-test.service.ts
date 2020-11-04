import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiTestService {
    private header: any = {};
    private headers: any = {};
    // private host: string = "http://172.16.50.1:8090";
    private host: string = 'http://localhost:9999';

    constructor(private http: HttpClient) {
        this.headers['Content-Type'] = 'application/json';
        // this.headers['userToken'] = '22n2n2';
        this.headers['Access-Control-Allow-Credentials'] = true;
        this.header.headers = this.headers;
    }

    GET_TEST_MOCK() {
        console.info('[GET_TEST_MOCK]');
        // const url = 'https://jsonplaceholder.typicode.com/posts/1';
        const url = 'http://localhost:9999/car';
        return this.http.get(url);
    }

    /* common --------------------------------------- */

    // 달력
    GET_CALENDAR(condition: any) {
        console.log(condition);
        this.headers['Content-Type'] = 'application/json';
        return this.http.post(this.host + '/common/calendar', condition, this.header);
    }

    // 목적지 검색
    GET_DESTINATION(condition: any) {
        console.log(condition);
        return this.http.post(this.host + '/common/destination', condition, this.header);
    }

    // 주요 목적지
    GET_MAJOR_DESTINATION(condition: any) {
        console.log(condition);
        return this.http.post(this.host + '/common/majorDestination', condition, this.header);
    }

    // 약관조회
    GET_TERM(condition: any) {
        console.log(condition);
        return this.http.post(this.host + '/common/term', condition, this.header);
    }

    /*  --------------------------------------- common */
    /* flight ---------------------------------------- */

    // 스케줄 상세, 정렬, 상세조건, 카드 목록 => ?항공검색
    GET_FLIGHT_LIST(condition: any) {
        console.log(condition);
        // this.headers['Content-Type'] = "application/json";
        // this.headers['userToken'] = '22n2n2';
        return this.http.post(this.host + '/flight/list/itinerary', condition, this.headers);
    }

    // 항공 세그 홀드
    GET_SEGHOLE(condition: any) {
        console.log(condition);
        // this.headers['Content-Type'] = "application/json";
        // this.headers['userToken'] = '22n2n2';
        return this.http.post(this.host + '/flight/segHole', condition, this.headers);
    }

    /* --------------------------------------- flight */
    /* hotel ---------------------------------------- */

    // 호텔 검색후 리스트
    GET_HOTEL_LIST(condition: any) {
        console.log(condition);
        // this.headers['Content-Type'] = "application/json";
        // this.headers['userToken'] = '22n2n2';
        return this.http.post(this.host + '/hotel/list', condition, this.headers);
    }

    // 호텔 상세
    GET_HOTEL_INFORMATION(condition: any) {
        console.log(condition);
        // this.headers['Content-Type'] = "application/json";
        // this.headers['userToken'] = '22n2n2';
        return this.http.post(this.host + '/hotel/information', condition, this.headers);
    }

    // 호텔 객실 검색 리스트
    GET_HOTEL_ROOM_LIST(condition: any) {
        console.log(condition);
        // this.headers['Content-Type'] = "application/json";
        // this.headers['userToken'] = '22n2n2';
        return this.http.post(this.host + '/hotel/room/list', condition, this.headers);
    }

    // 호텔 객실 상세 정보
    GET_HOTEL_ROOM_INFORMATION(condition: any) {
        console.log(condition);
        // this.headers['Content-Type'] = "application/json";
        // this.headers['userToken'] = '22n2n2';
        return this.http.post(this.host + '/hotel/room/information', condition, this.headers);
    }

    // 호텔 현재 상태 조회(몇명이 예약하고 보고 있는지...)
    GET_HOTEL_STATS(condition: any) {
        console.log(condition);
        // this.headers['Content-Type'] = "application/json";
        // this.headers['userToken'] = '22n2n2';
        return this.http.post(this.host + '/hotel/stats', condition, this.headers);
    }

    // 호텔 위시에 추가
    GET_HOTEL_BASKET(condition: any) {
        console.log(condition);
        // this.headers['Content-Type'] = "application/json";
        // this.headers['userToken'] = '22n2n2';
        return this.http.post(this.host + '/hotel/basket', condition, this.headers);
    }

    // 호텔 룸 서비스 요금
    GET_HOTEL_ROOM_CONDITION(condition: any) {
        console.log(condition);
        // this.headers['Content-Type'] = "application/json";
        // this.headers['userToken'] = '22n2n2';
        return this.http.post(this.host + '/hotel/room/condition', condition, this.headers);
    }

    /* ---------------------------------------- hotel */
    /* booking -------------------------------------- */

    // 호텔 예약 결과.
    GET_BOOKING(condition: any) {
        console.log(condition);
        // this.headers['Content-Type'] = "application/json";
        // this.headers['userToken'] = '22n2n2';
        return this.http.post(this.host + '/booking', condition, this.headers);
    }

    // 호텔 취소 결과
    GET_BOOKING_CANCEL(condition: any) {
        console.log(condition);
        // this.headers['Content-Type'] = "application/json";
        // this.headers['userToken'] = '22n2n2';
        return this.http.post(this.host + '/booking/cancel', condition, this.headers);
    }

    /* -------------------------------------- booking */
}
