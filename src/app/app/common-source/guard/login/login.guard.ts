import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';

import { upsertCommonUserInfo, deleteCommonUserInfo } from '../../../store/common/common-user-info/common-user-info.actions';

import { UtilUrlService } from '../../services/util-url/util-url.service';
import { RentUtilService } from '../../services/rent-com-service/rent-util.service';
import { JwtService } from '../../services/jwt/jwt.service';
import { ApiBookingService } from '../../../api/booking/api-booking.service';
import { ApiAlertService } from '../../services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {
    isLogin: boolean = false;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private store: Store<any>,
        public rentUtilSvc: RentUtilService,
        public jwtService: JwtService,
        public utilUrlService: UtilUrlService,
        public apiBookingService: ApiBookingService,
        private alertService: ApiAlertService
    ) { }

    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.info('[next]', next);
        console.info('[state]', state.url);

        this.checkedLogin();

        if (this.isLogin) {
            this.jwtService.loginInit();
            const userInfoRes = await this.jwtService.getUserInfo();
            if (userInfoRes.succeedYn) {
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
                    .catch((err: any) => {
                        this.alertService.showApiAlert(err);
                    });

                console.info('[travelerRes]', travelerRes);

                const commonUserInfo: any = {
                    id: 'commonUserInfo',
                    userInfo: userInfoRes['result'],
                    traveler: travelerRes['result'].travelers
                };
                this.upsertOne(commonUserInfo);

                return true;
            } else {
                console.info('[로그아웃]');
                this.jwtService.logoutInit();
                this.deleteOne('commonUserInfo');
                this.goToLogin(state.url);
            }
        }
        else {
            this.goToLogin(state.url);
        }
        // return false;
        //return this.router.parseUrl("/admin/login");
    }

    /**
     * 로그인 체크
     */
    checkedLogin() {
        const res = this.jwtService.checkedLogin();
        this.isLogin = res;
    }

    /**
     * 로그인 페이지 이동
     */
    goToLogin($stateUrl) {
        const routeURL = $stateUrl;
        const returnUrl = this.utilUrlService.getOrigin();
        const res = this.jwtService.getLoginUrl(returnUrl + routeURL);
        // console.info('[routeURL]', routeURL);
        // console.info('[returnUrl]', returnUrl);
        this.document.location.href = res;
    }

    upsertOne($obj) {
        this.store.dispatch(upsertCommonUserInfo({
            commonUserInfo: $obj
        }));
    }

    deleteOne($id) {
        this.store.dispatch(deleteCommonUserInfo($id));
    }

}
