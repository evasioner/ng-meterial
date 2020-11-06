import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';

import { HeaderTypes } from '@/app/common-source/enums/header-types.enum';

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

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        titleService: Title,
        metaTagService: Meta,
        seoCanonicalService: SeoCanonicalService,
        translate: TranslateService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translate
        );
    }

    ngOnInit() {
        super.ngOnInit();
        this.headerInit();
    }

    headerInit() {
        this.headerType = HeaderTypes.PAGE;
    }
}
