import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '@/environments/environment';

@Component({
    selector: 'app-logout-after',
    templateUrl: './logout-after.component.html',
    styleUrls: ['./logout-after.component.scss']
})
export class LogoutAfterComponent implements OnInit {
    constructor(
        private cookieService: CookieService) {

    }
    ngOnInit() {
        // 로컬스토리지 토큰 삭제
        localStorage.removeItem(environment.JWT_OPTION.TOKEN_KEY);

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


}
