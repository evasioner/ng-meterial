import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';

import { PageCodes } from 'src/app/common-source/enums/page-codes.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-activity-main-page',
    templateUrl: './activity-main-page.component.html',
    styleUrls: ['./activity-main-page.component.scss']
})
export class ActivityMainPageComponent extends BasePageComponent implements OnInit {
    public headerConfig: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translate
        );


        this.initialize();
    }

    ngOnInit(): void {
        console.info('[ngOnInit > 액티비티 메인]');
        super.ngOnInit();
        console.info('isBrowser>>>', this.isBrowser);
    }

    private initialize() {
        this.headerInit();
    }

    private headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_ACTIVITY
        };
    }
}
