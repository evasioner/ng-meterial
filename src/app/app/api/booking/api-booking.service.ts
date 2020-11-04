import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiBookingService {

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
     * 항공, 호텔, 렌터카, 액티비티 예약하기 (통합 예약하기)
     */
    POST_BOOKING($body?: any, $opt?: Object) {
        return this.httpPost('/booking', $body, $opt);
    }

    /**
     * 항공, 호텔, 렌터카, 액티비티 Retrieve (통합 Retrieve)
     */
    POST_BOOKING_RETRIEVE($body?: any, $opt?: Object) {
        return this.httpPost('/booking/retrieve', $body, $opt);
    }

    /**
   * 항공 예약 취소하기
   */
    POST_BOOKING_FLIGHT_CANCEL($body?: any, $opt?: Object) {
        return this.httpPost('/booking/flight/cancel', $body, $opt);
    }

    /**
     * 호텔 예약 취소하기
     */
    POST_BOOKING_HOTEL_CANCEL($body?: any, $opt?: Object) {
        return this.httpPost('/booking/hotel/cancel', $body, $opt);
    }

    /**
     * 렌터카 예약 취소하기
     */
    POST_BOOKING_RENT_CANCEL($body?: any, $opt?: Object) {
        return this.httpPost('/booking/rent/cancel', $body, $opt);
    }

    POST_BOOKING_ACTIVITY_CANCEL($body?: any, $opt?: Object) {
        return this.httpPost('/booking/activity/cancel', $body, $opt);
    }

    /**
     * 항공, 호텔, 렌터카, 액티비티 이티켓보기 (통합 문서 보기(eTicket, voucher, confirmSheet))
     */
    POST_BOOKING_DOCUMENT($body?: any, $opt?: Object) {
        return this.httpPost('/booking/document', $body, $opt);
    }

    /**
     * 예약 목록
     */
    POST_BOOKING_LIST($body?: any, $opt?: Object) {
        return this.httpPost('/booking/list', $body, $opt);
    }

    /**
     * 예약 상세 내역
     */
    POST_BOOKING_DETAIL($body?: any, $opt?: Object) {
        return this.httpPost('/booking/detail', $body, $opt);
    }

    /**
     * 내 여행자 목록
     */
    POST_BOOKING_TRAVELER($body?: any, $opt?: Object) {
        return this.httpPost('/booking/traveler', $body, $opt);
    }

    POST_E_TICKET($body?: any, $opt?: Object) {
        return this.httpPost('/booking/flight/e-ticket', $body, $opt);
    }

    POST_BASKET_LIST($body?: any, $opt?: Object) {
        return this.httpPost('/booking/list', $body, $opt);
    }

    POST_HOTEL_INVOICE($body?: any, $opt?: Object) {
        return this.httpPost('/booking/hotel/invoice', $body, $opt);
    }
    POST_HOTEL_VOUCHER($body?: any, $opt?: Object) {
        return this.httpPost('/booking/hotel/voucher', $body, $opt);
    }
    POST_RENT_CONFIRMATION($body?: any, $opt?: Object) {
        return this.httpPost('/booking/rent/confirm_sheet', $body, $opt);
    }
    POST_RENT_INVOICE($body?: any, $opt?: Object) {
        return this.httpPost('/booking/rent/invoice', $body, $opt);
    }
    POST_ACTIVITY_VOUCHER($body?: any, $opt?: Object) {
        return this.httpPost('/booking/activity/invoice', $body, $opt);
    }

    /**
    * 항공 예약 완료 정보
    */
    POST_BOOKING_FLIGHT_SUMMARY($body?: any, $opt?: Object) {
        return this.httpPost('/booking/flight/summary', $body, $opt);
    }

    httpPost($url, $body?: any, $opt?: Object) {
        const url = this.baseUrl + $url;
        const body = $body || {};
        const options = { ...this.httpOptions, ...$opt };

        return this.http.post(url, body, options);
    }
}
