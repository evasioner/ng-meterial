import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';

import { TranslateService } from '@ngx-translate/core';

import { PageCodes } from '../../common-source/enums/page-codes.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-hotel-main-page',
    templateUrl: './hotel-main-page.component.html',
    styleUrls: ['./hotel-main-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HotelMainPageComponent extends BasePageComponent implements OnInit {
    headerType: any;
    headerConfig: any;
    startIndex = 0;
    lastIndex = 2;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
    }

    ngOnInit(): void {
        console.info('[ngOnInit > 호텔 메인]');
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.className = 'bg';
        this.headerInit();
    }

    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_HOTEL
        };
    }
}

