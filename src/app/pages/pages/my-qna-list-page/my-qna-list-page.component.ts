import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { BasePageComponent } from '../base-page/base-page.component';
import { Title, Meta } from '@angular/platform-browser';
import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { HeaderTypes } from '../../common-source/enums/header-types.enum';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-my-qna-list-page',
    templateUrl: './my-qna-list-page.component.html',
    styleUrls: ['./my-qna-list-page.component.scss']
})
export class MyQnaListPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    tabNo: any;
    headerType: any;
    headerConfig: any;

    rxAlive: boolean = true;
    loadingBool: boolean = false;
    resolveData: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private bsModalService: BsModalService,
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
        super.ngOnInit();
        this.selectTab(0);
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

    /**
     * 헤더 초기화
     */
    headerInit() {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: '고객문의',
            key: null
        };
    }

    selectTab(no) {
        this.tabNo = no;
    }
}
