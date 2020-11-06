import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiMypageService {

    baseUrl: String;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json;charset=UTF8'
        })
    };

    constructor(private http: HttpClient) {
        this.baseUrl = environment.API_URL;
    }

    // 예약리스트
    POST_BOOKING_LIST($body?: any, $opt?: any) {
        console.info('body>>>', $body);
        return this.httpPost('/booking/list', $body, $opt);
    }

    // 항공 예약 상세
    POST_BOOKING_FLIGHT_DETAIL($body?: any, $opt?: any) {
        return this.httpPost('/booking/flight/detail', $body, $opt);
    }

    // 호텔 예약 상세
    POST_BOOKING_HOTEL_DETAIL($body?: any, $opt?: any) {
        return this.httpPost('/booking/hotel/detail', $body, $opt);
    }

    // 렌터카 예약 상세
    POST_BOOKING_RENT_DETAIL($body?: any, $opt?: any) {
        return this.httpPost('/booking/rent/detail', $body, $opt);
    }

    POST_BOOKING_ACTIVITY_DETAIL($body?: any, $opt?: any) {
        return this.httpPost('/booking/activity/detail', $body, $opt);
    }

    // FAQ 리스트
    POST_MYPAGE_FAQ($body?: any, $opt?: any) {
        return this.httpPost('/my-page/faq', $body, $opt);
    }

    // FAQ 상세
    POST_MYPAGE_FAQ_DETAIL($body?: any, $opt?: any) {
        return this.httpPost('/my-page/faq/detail', $body, $opt);
    }

    // 공지사항 리스트
    POST_MYPAGE_NOTICE($body?: any, $opt?: any) {
        return this.httpPost('/my-page/notice', $body, $opt);
    }

    // 공지사항 상세
    POST_MYPAGE_NOTICE_DETAIL($body?: any, $opt?: any) {
        return this.httpPost('/my-page/notice/detail', $body, $opt);
    }

    POST_BASKET_LIST($body?: any, $opt?: any) {
        console.info('body>>>', $body);
        return this.httpPost('/basket/list', $body, $opt);
    }

    // 이용후기
    POST_REVIEW_LIST($body?: any, $opt?: any) {
        return this.httpPost('/my-page/review/list', $body, $opt);
    }

    // QNA
    POST_QNA($body?: any, $opt?: any) {
        return this.httpPost('/my-page/qna', $body, $opt);
    }

    // QNA_PUT
    PUT_QNA($body?: any, $opt?: any) {
        return this.httpPut('/my-page/qna', $body, $opt);
    }

    // CONSULTING
    POST_CONSULTING($body?: any, $opt?: any) {
        return this.httpPost('/my-page/consulting', $body, $opt);
    }

    // CONSULTING_PUT
    PUT_CONSULTING($body?: any, $opt?: any) {
        return this.httpPut('/my-page/consulting', $body, $opt);
    }

    httpPut($url, $body?: any, $opt?: any) {
        const url = this.baseUrl + $url;
        const body = $body || {};
        const options = { ...this.httpOptions, ...$opt };

        return this.http.put(url, body, options);
    }

    httpPost($url, $body?: any, $opt?: any) {
        const url = this.baseUrl + $url;
        const body = $body || {};
        const options = { ...this.httpOptions, ...$opt };

        return this.http.post(url, body, options);
    }
}
