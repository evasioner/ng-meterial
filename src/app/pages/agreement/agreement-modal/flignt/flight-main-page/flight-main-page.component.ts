import { Component, OnInit, ViewEncapsulation, PLATFORM_ID, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';

import { PageCodes } from '../../common-source/enums/page-codes.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-flight-main-page',
    templateUrl: './flight-main-page.component.html',
    styleUrls: ['./flight-main-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FlightMainPageComponent extends BasePageComponent implements OnInit {
    headerConfig: any;
    teamMembers: any;
    public recentList;
    searchEvt: any;

    viewModel: any;
    dataModel: any;

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
    }

    ngOnInit(): void {
        console.info('[ngOnInit > 항공 메인]');
        console.log(this.viewModel, 'viewModel');
        console.log(this.dataModel, 'dataModel');
        super.ngOnInit();
        this.headerInit();
        this.test(this.teamMembers);
        console.info('isBrowser>>>', this.isBrowser);
    }

    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_FLIGHT
        };
    }

    test(teamMembers: any) {
        this.recentList = teamMembers;
        console.log(this.viewModel, 'viewModel');
        console.log(this.dataModel, 'dataModel');

    }
}
