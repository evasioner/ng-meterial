import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class ApiCommonService {

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
     * 목적지 검색
     */
    POST_DESTINATION($body?: any, $opt?: any) {
        return this.httpPost('/common/destination', $body, $opt);
    }

    /**
     * 주요 목적지 조회
     */
    POST_MAJOR_DESTINATION($body?, $opt?) {
        return this.httpPost('/common/major-destination', $body, $opt);
    }

    /**
     * 달력 조회
     */
    POST_CALENDAR($body?, $opt?) {
        return this.httpPost('/common/calendar', $body, $opt);
    }

    /**
     * 쿠폰 조회
     */
    POST_COUPON_LIST($body?, $opt?) {
        return this.httpPost('/common/coupon/list', $body, $opt);
    }

    /**
     * 쿠폰 다운로드
     */
    POST_COUPON_DOWN($body?, $opt?) {
        return this.httpPost('/common/coupon/down', $body, $opt);
    }

    /**
     * 이벤트 조회
     */
    POST_EVENT_LIST($body?, $opt?) {
        return this.httpPost('/common/event/list', $body, $opt);
    }

    /**
     * 이벤트 상세
     */
    POST_EVENT_DETAIL($body?, $opt?) {
        return this.httpPost('/common/event/detail', $body, $opt);
    }

    /**
     * 약관 조회
     */
    POST_TERMS($body?, $opt?) {
        return this.httpPost('/common/terms', $body, $opt);
    }

    /**
     * 공유하기 카카오
     */
    POST_SHARE_KAKAO($body?, $opt?) {
        return this.httpPost('/common/share/kakao', $body, $opt);
    }

    /**
     * 공유하기 페이스북
     */
    POST_SHARE_FACEBOOK($body?, $opt?) {
        return this.httpPost('/common/share/facebook', $body, $opt);
    }

    /**
     * 이메일 발송
     */
    POST_EMAIL($body?, $opt?) {
        return this.httpPost('/common/email', $body, $opt);
    }

    /**
     * 파일 업로드
     */
    POST_FILE_UPLOAD($body?, $opt?) {
        return this.httpPost('/common/file/upload', $body, $opt);
    }

    /**
     * 파일 삭제
     */
    POST_FILE_DELETE($body?, $opt?) {
        return this.httpPost('/common/file/delete', $body, $opt);
    }

    /**
     * 알림톡 템플릿 조회
     */
    POST_ALIMTALK_TEMPLATE($body?, $opt?) {
        return this.httpPost('/common/alim-talk/template', $body, $opt);
    }

    /**
     * 알림톡 발송
     */
    POST_ALIMTALK_SEND($body?, $opt?) {
        return this.httpPost('/common/alim-talk/send', $body, $opt);
    }

    /**
     * 상담내용 입력
     */
    POST_CONSULTING($body?, $opt?) {
        return this.httpPost('/common/consulting', $body, $opt);
    }

    /**
     * 전화번호 고객등급 조회
     */
    POST_CUSTOMER_GRADE($body?, $opt?) {
        return this.httpPost('/common/customer/grade', $body, $opt);
    }

    /**
     * UMS 문자수신 차단
     */
    POST_UMS_BLOCK($body?, $opt?) {
        return this.httpPost('/common/ums/block', $body, $opt);
    }

    /**
     * 날씨정보 조회
     */
    POST_WEATHER($body?, $opt?) {
        return this.httpPost('/common/weather', $body, $opt);
    }

    /**
     * 짧은 URL 생성
     */
    POST_SHORTURL($body?, $opt?) {
        return this.httpPost('/common/shortUrl', $body, $opt);
    }

    /**
     * 휴대폰 인증
     */
    POST_PHONECERTIFY($body?, $opt?) {
        return this.httpPost('/common/phoneCertify', $body, $opt);
    }


    httpPost($url, $body?: any, $opt?: any) {
        const url = this.baseUrl + $url;
        const body = $body || {};
        const options = { ...this.httpOptions, ...$opt };

        return this.http.post(url, body, options);
    }
}
