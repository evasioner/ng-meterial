import { Component, Inject, PLATFORM_ID, ViewEncapsulation, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';

import { PageCodes } from '../../common-source/enums/page-codes.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-rent-main-page',
    templateUrl: './rent-main-page.component.html',
    styleUrls: ['./rent-main-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RentMainPageComponent extends BasePageComponent implements OnInit {
    headerType: any;
    headerConfig: any;

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
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.className = 'bg';
        this.headerInit();
    }

    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_RENT
        };
    }
}
