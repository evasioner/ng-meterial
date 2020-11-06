import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { take } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import 'moment/locale/ko';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';

import { UrlModelList, UrlModel } from './models/url-model';

import { PageCodes } from '../../common-source/enums/page-codes.enum';
import { HeaderTypes } from '../../common-source/enums/header-types.enum';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-base-page',
    templateUrl: './base-page.component.html',
    styleUrls: ['./base-page.component.scss']
})
export class BasePageComponent implements OnInit, OnDestroy {
    /**
     * 헤더 설정
     */
    pageCode: PageCodes;
    headerType: HeaderTypes;
    headerConfig: any;

    /**
     * 서버 & 브라우져 상태.
     */
    isBrowser: boolean = false;
    isServer: boolean = false;
    private baseSubscription: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService
    ) {
        this.baseSubscription = [];
        this.translateInit();
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) this.isBrowser = true;
        if (isPlatformServer(this.platformId)) this.isServer = true;

        this.metaInit();
        this.seoCanonicalService.setCanonicalURL();
        this.momentUpdateLocale();
    }


    ngOnDestroy() {
        this.baseSubscription && this.baseSubscription.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    basePageInit($obj: any) {
        this.pageCode = $obj.headerInit.pageCode;
        this.headerType = $obj.headerInit.headerType;
        this.headerConfig = $obj.headerInit.headerConfig;

        this.baseSetTitle();
    }

    baseSetTitle() {
        this.baseSubscription.push(
            this.translateService.getTranslation(this.translateService.getDefaultLang())
                .pipe(take(1))
                .subscribe(
                    (ev: any) => {
                        this.titleService.setTitle(ev.BASE.BROWSER_TITLE);
                    }
                )
        );
    }

    /**
     * 메타 태그 초기화
     *
     */
    metaInit() {
        console.info('[metaInit]');
        let contentText: string = '여행을 가볍게 노랑풍선! ';
        let keywordText: string = '노랑풍선';
        UrlModelList.map(
            (item: UrlModel) => {
                if (_.startsWith(window.location.pathname, item.target)) {
                    contentText += item.text;
                    keywordText += `,${item.text}`;
                }
            }
        );

        this.metaTagService.addTags([
            { name: 'date', content: moment().format('YYYY-MM-DD'), scheme: 'YYYY-MM-DD' },
            { name: 'org:description', content: contentText },
            { name: 'twitter:description', content: contentText },
            { name: 'keywords', content: keywordText },
            { name: 'description', content: contentText }
        ]);
    }

    /**
     * 다국어 초기화
     *
     */
    translateInit() {
        this.translateService.addLangs(['ko', 'en']);
        this.translateService.setDefaultLang('ko');
    }

    /**
     * moment.js locale 설정
     */
    momentUpdateLocale() {
        moment.updateLocale('ko', {
            weekdaysShort: ['일', '월', '화', '수', '목', '금', '토']
        });
    }
}
