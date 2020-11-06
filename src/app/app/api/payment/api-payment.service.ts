import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiPaymentService {

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
     * 카드 결제
     */
    POST_PAYMENT_CARD_PAY($body?: any, $opt?: any) {
        return this.httpPost('/payment/card/pay', $body, $opt);
    }

    /**
     * 카드 결제 취소
     */
    POST_PAYMENT_CARD_CANCEL($body?: any, $opt?: any) {
        return this.httpPost('/payment/card/cancel', $body, $opt);
    }

    /**
     * 가상계좌 결제
     */
    POST_PAYMENT_BANK_PAY($body?: any, $opt?: any) {
        return this.httpPost('/payment/bank/pay', $body, $opt);
    }

    /**
     * 네이버페이 결제
     */
    POST_PAYMENT_NAVER_PAY($body?: any, $opt?: any) {
        return this.httpPost('/payment/naver/pay', $body, $opt);
    }

    /**
     * 네이버페이 결제취소
     */
    POST_PAYMENT_NAVER_CANCEL($body?: any, $opt?: any) {
        return this.httpPost('/payment/naver/cancel', $body, $opt);
    }

    /**
     * PUT_PAYMENT
     * 결제
     *
     * @param $body
     * @param $opt
     */
    PUT_PAYMENT($body?: any, $opt?: any) {
        return this.httpPut('/payment', $body, $opt);
    }

    /**
     * POST_INICIS_PAYMENT_KEY
     * 예약 키 먼저 생성
     *
     * @param body
     * @param opt?
     */
    POST_INICIS_PAYMENT_KEY(body: any, opt?: any) {
        return this.httpPost('/payment/inicis/key', body, opt);
    }

    httpPost($url, $body?: any, $opt?: any) {
        const url = this.baseUrl + $url;
        const body = $body || {};
        const options = { ...this.httpOptions, ...$opt };

        return this.http.post(url, body, options);
    }

    httpPut($url, $body?: any, $opt?: any) {
        const url = this.baseUrl + $url;
        const body = $body || {};
        const options = { ...this.httpOptions, ...$opt };

        return this.http.put(url, body, options);
    }
}
