import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { upsertCommonUserInfo } from '../../../../store/common/common-user-info/common-user-info.actions';

import { CookieService } from 'ngx-cookie-service';

import * as _ from 'lodash';

import { ApiUserService } from '../../../../api/user/api-user.service';
import { CommonUserInfoService } from 'src/app/common-source/services/common-user-info/common-user-info.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

@Component({
    selector: 'app-login-after',
    templateUrl: './login-after.component.html',
    styleUrls: ['./login-after.component.scss']
})
export class LoginAfterComponent implements OnInit {

    userInfo: any;
    ybLoginKey: any = environment.COOKIE.KEY; // 노랑풍선 쿠키 key
    ybLoginBool: boolean; // 노랑풍선 쿠키 존재여부
    ybCookie: any; // 노랑풍선 쿠키 정보

    storeUserInfo: any;

    /**
     * 1. 쿠키 존재여부 확인 : _YBSSTK
     * 2. 쿠키 추출 : _YBSSTK
     * 3. api 호출 해서 api 쿠키 추출 :
     * 4. 로컬스토리지 저장 후 @auth0/angular-jwt 라이브러리 연동
     */

    constructor(
        private store: Store<any>,
        private cookieService: CookieService,
        private apiUserService: ApiUserService,
        private commonUserInfoService: CommonUserInfoService,
        private alertService: ApiAlertService
    ) { }

    ngOnInit() {
        // 쿠키체크
        this.ybLoginTokenCheck();

        if (this.ybLoginBool) {
            // 로그인 된경우
            this.ybCookieExtract();
            this.getUserInfo();
        } else {
            // 로그인 안된 경우
            this.ybNotCookie();
        }
    }

    /**
     * 노랑풍선 로그인 쿠키 체크
     */
    ybLoginTokenCheck() {
        this.ybLoginBool = this.checkCookie(this.ybLoginKey);
        console.info('[노랑풍선 로그인 쿠키 체크]', this.ybLoginBool);
    }

    /**
     * 노랑풍선 로그인 쿠키 추출
     */
    ybCookieExtract() {
        this.ybCookie = this.getCookie(this.ybLoginKey);
        // 쿠키저장
        localStorage.setItem(environment.JWT_OPTION.TOKEN_KEY, this.ybCookie);

    }

    ybNotCookie() {
        console.error('노랑풍선 쿠키 존재하지 않는다.');
    }


    async getUserInfo() {

        const rq: any = {
            condition: {
                stationTypeCode: environment.STATION_CODE
            }
        };

        this.userInfo = await this.apiUserService.POST_USER_GETINFO(rq)
            .toPromise()
            .then((res: any) => {
                console.info('[user/getInfo]', res);
                if (res.succeedYn) {
                    return res['result'];
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err);
            });

        /**
         * 유저 정보 스토어에 저장
         */
        console.info('[userInfo]', this.userInfo);
        // const commonUserInfo: any = {
        //   id: 'commonUserInfo',
        //   user: this.userInfo.user,
        //   company: this.userInfo.company,
        //   salseCountry: this.userInfo.salseCountry,
        //   menuGroups: this.userInfo.menuGroups
        // };
        //
        // this.upsertOne(commonUserInfo);


    } // end apiLogin



    /**
     * 스토어에서 정보 가져오기
     *
     */
    getUserInfoSvc() {
        return this.commonUserInfoService.getUserInfoSvc();
    }



    upsertOne($obj) {
        this.store.dispatch(upsertCommonUserInfo({
            commonUserInfo: $obj
        }));
    }

    /**
     * 쿠키 저장
     * @param $obj
     */
    setCookie($obj) {
        this.cookieService.set($obj.key, $obj.val);
    }

    /**
     * 쿠키 불러오기
     * @param $str
     */
    getCookie($str) {
        return this.cookieService.get($str);
    }

    /**
     * 쿠키 삭제
     * @param $str
     */
    delCookie($str): void {
        this.cookieService.delete($str);
    }

    /**
     * 쿠키 체크
     * @param $str
     */
    checkCookie($str): boolean {
        return this.cookieService.check($str);
    }

    onStoreUserInfoClick() {
        this.storeUserInfo = this.getUserInfoSvc();
        console.info('[스토어에서 userInfo 가져오기]', this.storeUserInfo);
    }


}
