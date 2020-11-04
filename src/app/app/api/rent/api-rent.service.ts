import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiRentService {

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
     * 추천 렌터카 조회
     */
    POST_RENT_RECOMMEND($body?: any, $opt?: Object) {
        return this.httpPost('/rent/recommend', $body, $opt);
    }

    /**
     * 렌터카 검색
     */
    POST_RENT_LIST($body?: any, $opt?: Object) {
        return this.httpPost('/rent/list', $body, $opt);
    }

    /**
     * 렌터카 상세
     */
    POST_RENT_RENTRULE($body?: any, $opt?: Object) {
        return this.httpPost('/rent/rent-rule', $body, $opt);
    }

    /**
     * 렌터카 옵션 검색
     */
    POST_RENT_OPTION($body?: any, $opt?: Object) {
        return this.httpPost('/rent/option', $body, $opt);
    }

    /**
     * 렌터카 현재 상황 조회
     */
    POST_RENT_STATS($body?: any, $opt?: Object) {
        return this.httpPost('/rent/stats', $body, $opt);
    }

    /**
     * 렌터카 운임규정 조회
     */
    POST_RENT_CONDITION($body?: any, $opt?: Object) {
        return this.httpPost('/rent/condition', $body, $opt);
    }

    /**
     * 렌터카 위시에 추가
     */
    POST_RENT_BASKET($body?: any, $opt?: Object) {
        return this.httpPost('/rent/basket', $body, $opt);
    }

    /**
     * 렌터카 멤버쉽 입력
     */
    POST_RENT_MEMEBERSHIP($body?: any, $opt?: Object) {
        return this.httpPost('/rent/memebership', $body, $opt);
    }

    /**
     * 렌터카 취소하기
     */
    POST_RENT_CANCEL($body?: any, $opt?: Object) {
        return this.httpPost('/booking/rent/cancel', $body, $opt);
    }


    httpPost($url, $body?: any, $opt?: Object) {
        const url = this.baseUrl + $url;
        const body = $body || {};
        const options = { ...this.httpOptions, ...$opt };

        return this.http.post(url, body, options);
    }
}
