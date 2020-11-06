import { Component, OnInit, ViewEncapsulation, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';
import { BasePageComponent } from '../base-page/base-page.component';
import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-travel-convenience-main-page',
    templateUrl: './travel-convenience-main-page.component.html',
    styleUrls: ['./travel-convenience-main-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TravelConvenienceMainPageComponent extends BasePageComponent implements OnInit, AfterViewInit {

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


    ngAfterViewInit() {
        if (this.isBrowser) {
            window.scrollTo(0, 0);
        }
    }

    headerInit() {
        this.headerType = HeaderTypes.PAGE;
        this.headerConfig = null;
    }
}
