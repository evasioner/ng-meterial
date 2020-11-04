import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiUserService {

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
     * 로그인
     */
    POST_USER_LOGIN($body?: any, $opt?: Object) {
        return this.httpPost('/user/login', $body, $opt);
    }

    /**
     * 사용자 정보
     */
    POST_USER_GETINFO($body?: any, $opt?: Object) {
        return this.httpPost('/user/get-info', $body, $opt);
    }


    httpPost($url, $body?: any, $opt?: Object) {
        const url = this.baseUrl + $url;
        const body = $body || {};
        const options = { ...this.httpOptions, ...$opt };

        return this.http.post(url, body, options);
    }
}
