import { Component, Inject, OnInit, Optional, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RESPONSE, REQUEST } from '@nguniversal/express-engine/tokens';
import { Request, Response } from 'express';

import { TranslateService } from '@ngx-translate/core';

import { BasePageComponent } from '../base-page/base-page.component';
import { SeoCanonicalService } from '@/app/common-source/services/seo-canonical/seo-canonical.service';

@Component({
    selector: 'app-common-payment-complete-page',
    templateUrl: './common-payment-complete-page.component.html',
    styleUrls: ['./common-payment-complete-page.component.scss']
})
export class CommonPaymentCompletePageComponent extends BasePageComponent implements OnInit {

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        @Optional() @Inject(REQUEST) private request: Request,
        @Optional() @Inject(RESPONSE) private response: Response
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

        if (this.isServer) {
            console.log(this.request);
            console.log(this.response);
        }
    }
}
