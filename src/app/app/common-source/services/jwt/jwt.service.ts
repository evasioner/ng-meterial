import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Store } from '@ngrx/store';

import { deleteCommonUserInfo, upsertCommonUserInfo } from '../../../store/common/common-user-info/common-user-info.actions';

import { CookieService } from 'ngx-cookie-service';

import { environment } from '@/environments/environment';

import { JwtHelperService } from '@auth0/angular-jwt';

import { ApiUserService } from '../../../api/user/api-user.service';
import { UtilUrlService } from '../util-url/util-url.service';
import { ApiBookingService } from '../../../api/booking/api-booking.service';
import { ApiAlertService } from '../api-alert/api-alert.service';


@Injectable({
    providedIn: 'root'
})
export class JwtService {
    constructor(
        @Inject(DOCUMENT) private document: Document,
        public jwtHelper: JwtHelperService,
        private cookieService: CookieService,
        private apiUserService: ApiUserService,
        public utilUrlService: UtilUrlService,
        private store: Store<any>,
        private apiBookingService: ApiBookingService,
        private alertService: ApiAlertService
    ) { }

    async loginGuardInit($goUrl): Promise<boolean> {
        console.info('[loginGuardInit]', $goUrl);
        // const curUrl = this.route.snapshot['_routerState'].url;
        const curUrl = $goUrl;
        let isLogin = this.checkedLogin();

        if (isLogin) {
            console.info('[isLogin 1]', isLogin);
            this.loginInit();
            const userInfoRes = await this.getUserInfo();
            if (userInfoRes.succeedYn) {
                isLogin = true;
                console.info('[로그인]');
                /**
                 * 로그인을 완료후 여행자 정보를 가져온다.
                 */
                const travelerReq = {
                    stationTypeCode: environment.STATION_CODE,
                    currency: 'KRW',
                    language: 'KO',
                    condition: {
                        userNo: userInfoRes.result.user.userNo
                    }
                };
                const travelerRes = await this.apiBookingService.POST_BOOKING_TRAVELER(travelerReq)
                    .toPromise()
                    .then((res: any) => {
                        if (res.succeedYn) {
                            return res;
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    })
                    .catch((err) => {
                        this.alertService.showApiAlert(err);
                    });

                console.info('[travelerRes]', travelerRes);

                const commonUserInfo: any = {
                    id: 'commonUserInfo',
                    userInfo: userInfoRes['result'],
                    traveler: travelerRes['result'].travelers
                };

                this.store.dispatch(upsertCommonUserInfo({
                    commonUserInfo: commonUserInfo
                }));
            } else {
                isLogin = false;
                console.info('[로그아웃]');
                this.logoutInit();
                this.store.dispatch(deleteCommonUserInfo({ id: 'commonUserInfo' }));
                this.goToLogin(curUrl);
            }
        } else {
            console.info('[isLogin 2]', isLogin);
            this.goToLogin(curUrl);
        }

        return isLogin;
    }  // end 로그인 가드

    goToLogin($stateUrl) {
        const routeURL = $stateUrl;
        const returnUrl = this.utilUrlService.getOrigin();
        const res = this.getLoginUrl(returnUrl + routeURL);
        console.info('[routeURL]', routeURL);
        console.info('[returnUrl]', returnUrl);
        console.info('[res]', res);
        this.document.location.href = res;
    }

    /**
     * get 로그인 쿠키
     */
    getLoginCookie() {
        return this.cookieService.get(environment.COOKIE.KEY);
    }

    /**
     * 로그인 체크
     */
    checkedLogin() {
        const isCookie = this.cookieService.check(environment.COOKIE.KEY);
        console.info('[checkedLogin > isCookie]', isCookie);

        if (!isCookie) {
            localStorage.removeItem(environment.JWT_OPTION.TOKEN_KEY);
        }
        return isCookie;
    }

    /**
     * 로그인
     */
    loginInit() {
        const loginCookie = this.getLoginCookie();
        localStorage.setItem(environment.JWT_OPTION.TOKEN_KEY, loginCookie);
    }

    /**
     * 로그아웃
     */
    logoutInit() {
        const cookieKey = environment.COOKIE.KEY;
        const cookiePath = environment.COOKIE.PATH;
        const cookieDomain = environment.COOKIE.DOMAIN;
        this.cookieService.delete(cookieKey, cookiePath, cookieDomain);
        localStorage.removeItem(environment.JWT_OPTION.TOKEN_KEY);
    }

    /**
     * 로그인 경로 출력
     * @param $channelCode
     * - 000 : 패키지-데스크탑
     * - 001 : 패키지-모바일
     * - 002 : 호텔
     * - 003 : 항공 : 기본
     * - 004 : 온박
     * - 005 : 챗봇
     * @param $typeCode
     * - LGIN : 기본값
     * - RSVN : 예약하기
     * @param $returnUrl
     * - ex) http://t.ybtour.co.kr:4200/sample/guide/login-after
     */
    getLoginUrl($returnUrl) {
        const loginUrl = environment.YB_LOGIN.URL;
        const channelCode = `?channelCode=${environment.YB_LOGIN.channelCode}`;
        const typeCode = `&typeCode=${environment.YB_LOGIN.typeCode}`;
        const returnUrl = `&returnUrl=${encodeURIComponent($returnUrl)}`;
        const res = loginUrl + channelCode + typeCode + returnUrl;
        return res;
    }

    /**
     * user/getInfo
     */
    async getUserInfo() {
        const rq: any = {
            language: 'KO',
            condition: {
                stationTypeCode: environment.STATION_CODE
            }
        };

        const userInfo = await this.apiUserService.POST_USER_GETINFO(rq)
            .toPromise()
            .then((res: any) => {
                if (res.succeedYn) {
                    console.info('[user/getInfo]', res);
                    return res;
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err: any) => {
                this.alertService.showApiAlert(err);
            });

        return userInfo;
    }

    /**
     * 쿠키 저장
     * @param $obj
     */
    setCookie($obj) {
        this.cookieService.set($obj.key, $obj.val, null, null, null, true, 'Lax');
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
}
