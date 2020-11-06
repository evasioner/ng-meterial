import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

import * as moment from 'moment';
import 'moment/locale/ko';

@Component({
    selector: 'app-base-child',
    templateUrl: './base-child.component.html',
    styleUrls: ['./base-child.component.scss']
})
export class BaseChildComponent implements OnInit {
    /**
     * 서버 & 브라우져 상태.
     */
    isBrowser: boolean = false;
    isServer: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) this.isBrowser = true;
        if (isPlatformServer(this.platformId)) this.isServer = true;

        this.momentUpdateLocale();
    }

    /**
    * moment.js locale 설정
    */
    private momentUpdateLocale() {
        moment.updateLocale('ko', {
            weekdaysShort: ['일', '월', '화', '수', '목', '금', '토']
        });
    }
}