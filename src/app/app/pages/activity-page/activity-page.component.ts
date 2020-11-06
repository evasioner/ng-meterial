import { Component, OnInit, ViewEncapsulation, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Meta, Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { HeaderTypes } from '../../common-source/enums/header-types.enum';
import { BasePageComponent } from '../base-page/base-page.component';
import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-activity-page',
    templateUrl: './activity-page.component.html',
    styleUrls: ['./activity-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ActivityPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
    headerType: any;
    headerConfig: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private readonly store: Store<any>,
        private readonly route: ActivatedRoute,
        private readonly http: HttpClient
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
