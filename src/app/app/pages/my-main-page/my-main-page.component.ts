import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { TranslateService } from '@ngx-translate/core';
import { RentUtilService } from 'src/app/common-source/services/rent-com-service/rent-util.service';
import { BasePageComponent } from '../base-page/base-page.component';
import { HeaderTypes } from 'src/app/common-source/enums/header-types.enum';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-my-main-page',
    templateUrl: './my-main-page.component.html',
    styleUrls: ['./my-main-page.component.scss']
})
export class MyMainPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        public rentUtilSvc: RentUtilService,
        private bsModalService: BsModalService,
    ) {
        super(platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.headerInit();
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.closeAllModals();
    }

    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }
    headerInit() {
        this.headerType = HeaderTypes.PAGE;
    }
}
