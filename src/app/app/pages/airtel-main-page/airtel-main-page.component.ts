import { Component, OnInit, PLATFORM_ID, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { TranslateService } from '@ngx-translate/core';
import { BasePageComponent } from '../base-page/base-page.component';
import { HeaderTypes } from 'src/app/common-source/enums/header-types.enum';

@Component({
    selector: 'app-airtel-main-page',
    templateUrl: './airtel-main-page.component.html',
    styleUrls: ['./airtel-main-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AirtelMainPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    headerType: any;
    headerConfig: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        titleService: Title,
        metaTagService: Meta,
        seoCanonicalService: SeoCanonicalService,
        translate: TranslateService
    ) {
        super(platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translate);
    }

    ngOnInit() {
        console.info('[ngOnInit > 항공 메인]');
        super.ngOnInit();
        this.headerInit();

    }

    ngOnDestroy() {

    }

    private headerInit(): void {
        this.headerType = HeaderTypes.PAGE;
    }
}

