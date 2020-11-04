import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Component({
    selector: 'app-cookie-service',
    templateUrl: './cookie-service.component.html',
    styleUrls: ['./cookie-service.component.scss']
})
export class CookieServiceComponent implements OnInit {
    cookieValue = 'UNKNOWN';

    testKey = 'TEST_KEY';

    @ViewChild('cookieSaveInput') cookieSaveInput: ElementRef;

    constructor(
        private cookieService: CookieService
    ) {
    }

    ngOnInit() {
    }

    setCookieValue() {
        console.info('[setCookieValue]');
        this.setCookie({
            key: this.testKey,
            val: this.cookieSaveInput.nativeElement.value
        });
    }

    getCookieValue() {
        this.cookieValue = this.getCookie(this.testKey);
    }

    delCookieValue() {
        this.delCookie(this.testKey);
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

}
