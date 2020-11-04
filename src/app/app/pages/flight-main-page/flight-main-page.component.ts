import { Component, OnInit, PLATFORM_ID, Inject, ViewEncapsulation } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';

import { HeaderTypes } from 'src/app/common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-flight-main-page',
    templateUrl: './flight-main-page.component.html',
    styleUrls: ['./flight-main-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FlightMainPageComponent extends BasePageComponent implements OnInit {
    headerType: any;
    headerConfig: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
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

    ngOnInit(): void {
        super.ngOnInit();
        this.headerInit();
    }

    headerInit() {
        this.headerType = HeaderTypes.PAGE;
    }
}
