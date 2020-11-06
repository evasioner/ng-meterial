import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiActivityService {

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
     * 액티비티 뜨는 여행지
     */
    POST_ACTIVITY_DESTINATION($body?: any, $opt?: any) {
        return this.httpPost('/activity/destination', $body, $opt);
    }

    /**
     * 추천 액티비티 조회
     */
    POST_ACTIVITY_RECOMMEND($body?: any, $opt?: any) {
        return this.httpPost('/activity/recommend', $body, $opt);
    }

    /**
     * 액티비티 검색
     */
    POST_ACTIVITY_LIST($body?: any, $opt?: any) {
        return this.httpPost('/activity/list', $body, $opt);
    }

    /**
     * 액티비티 현재 상황 조회
     */
    POST_ACTIVITY_STATS($body?: any, $opt?: any) {
        return this.httpPost('/activity/stats', $body, $opt);
    }

    /**
     * 액티비티 옵션 목록
     */
    POST_ACTIVITY_OPTION($body?: any, $opt?: any) {
        return this.httpPost('/activity/option', $body, $opt);
    }

    /**
     * 액티비티 차지 컨디션
     */
    POST_ACTIVITY_CONDITION($body?: any, $opt?: any) {
        return this.httpPost('/activity/condition', $body, $opt);
    }

    /**
     * 액티비티 상세정보
     */
    POST_ACTIVITY_INFORMATION($body?: any, $opt?: any) {
        return this.httpPost('/activity/information', $body, $opt);
    }

    /**
     * 액티비티 리뷰 보기
     */
    POST_ACTIVITY_REVIEW_LIST($body?: any, $opt?: any) {
        return this.httpPost('/activity/review/list', $body, $opt);
    }

    /**
     * 액티비티 리뷰 쓰기
     */
    POST_ACTIVITY_REVIEW_WRITE($body?: any, $opt?: any) {
        return this.httpPost('/activity/review/write', $body, $opt);
    }

    /**
     * 액티비티 위시에 추가
     */
    POST_ACTIVITY_BASKET($body?: any, $opt?: any) {
        return this.httpPost('/activity/basket', $body, $opt);
    }

    /**
     * 액티비티 취소하기
     */
    POST_ACTIVITY_CANCEL($body?: any, $opt?: any) {
        return this.httpPost('/activity/cancel', $body, $opt);
    }


    /**
     * 액티비티 취소하기
     */
    POST_ACTIVITY_DETAIL($body?: any, $opt?: any) {
        return this.httpPost('/booking/activity/detail', $body, $opt);
    }

    /**
     * 액티비티 도시인트로
     */
    POST_ACTIVITY_CITY($body?: any, $opt?: any) {
        return this.httpPost('/activity/city', $body, $opt);
    }

    httpPost($url, $body?: any, $opt?: any) {
        const url = this.baseUrl + $url;
        const body = $body || {};
        const options = { ...this.httpOptions, ...$opt };

        return this.http.post(url, body, options);
    }
}
