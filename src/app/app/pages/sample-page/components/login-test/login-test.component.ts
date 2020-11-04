import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { JwtService } from '../../../../common-source/services/jwt/jwt.service';
import { UtilUrlService } from '../../../../common-source/services/util-url/util-url.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { ApiUserService } from '../../../../api/user/api-user.service';

import { environment } from '@/environments/environment';

@Component({
    selector: 'app-login-test',
    templateUrl: './login-test.component.html',
    styleUrls: ['./login-test.component.scss']
})
export class LoginTestComponent implements OnInit {
    isLogin: boolean = false;
    loadingBool: boolean = false;

    vm: any = {
        returnUrl: this.utilUrlService.getOrigin() + `/sample/guide/login-test`,
        ybLoginUrl: null,
        cookieKey: environment.COOKIE.KEY,
        cookieVal: null
    };

    userInfo: any;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        public jwtService: JwtService,
        public utilUrlService: UtilUrlService,
        private apiUserService: ApiUserService,
        private alertService: ApiAlertService

    ) {
        this.vm.ybLoginUrl = this.jwtService.getLoginUrl(this.vm.returnUrl);
        this.vm.cookieVal = this.jwtService.getCookie(this.vm.cookieKey);
    }

    async ngOnInit() {
        this.checkedLogin(); // 로그인 체크

        if (this.isLogin) { // 로그인 시 초기화
            this.loginInit();
            this.userInfo = await this.getUserInfo();
        }
    }

    /**
     * 로그인 ok > 초기화
     */
    loginInit() {
        this.jwtService.loginInit();
    }

    /**
     * logoutInit() {}
     * 쿠키 삭제
     * 로컬 스토리지 삭제
     */
    logoutInit() {
        this.jwtService.logoutInit();
        this.isLogin = false;
    }

    /**
     * 로그인 체크
     */
    checkedLogin() {
        const res = this.jwtService.checkedLogin();
        this.isLogin = res;
    }

    /**
     * user/getInfo
     */
    async getUserInfo() {
        const rq: any = {
            condition: {
                stationTypeCode: environment.STATION_CODE
            }
        };

        const userInfo = await this.apiUserService.POST_USER_GETINFO(rq)
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
                this.logoutInit();
            });

        this.loadingBool = true;

        return userInfo;


    }



    /**
     * 로그인 페이지 이동
     */
    onGoToLogin() {
        const returnUrl = this.utilUrlService.getOrigin() + `/sample/guide/login-test`;
        const res = this.jwtService.getLoginUrl(returnUrl);
        this.document.location.href = res;
    }



}
