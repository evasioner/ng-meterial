import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { RentUtilService } from '../../common-source/services/rent-com-service/rent-util.service';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-rent-main-page',
    templateUrl: './rent-main-page.component.html',
    styleUrls: ['./rent-main-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RentMainPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    headerType: any;
    headerConfig: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        public rentUtilSvc: RentUtilService,
        private route: ActivatedRoute,
        private bsModalService: BsModalService
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
        console.info('[ngOnInit > 렌터카 메인 1]', this.route.snapshot);
        console.info('[ngOnInit > 렌터카 메인 1]', this.route.snapshot['_routerState'].url);
        super.ngOnInit();
        this.headerInit();
    }

    ngOnDestroy() {
        this.closeAllModals();
    }

    headerInit() {
        this.headerType = HeaderTypes.PAGE;
    }

    /**
     * 모든 bsModal 창 닫기
     */
    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }
}
