import { Component, OnInit, Inject, PLATFORM_ID, ViewChild, OnDestroy } from '@angular/core';
import { BasePageComponent } from '../base-page/base-page.component';
import { Title, Meta } from '@angular/platform-browser';
import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { TranslateService } from '@ngx-translate/core';
import { HeaderTypes } from '../../common-source/enums/header-types.enum';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NoticeListComponent } from './components/notice-list/notice-list.component';

@Component({
    selector: 'app-my-notice-list-page',
    templateUrl: './my-notice-list-page.component.html',
    styleUrls: ['./my-notice-list-page.component.scss']
})
export class MyNoticeListPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    element: any;
    $element: any;
    tabNo: any = 0;
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;

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

    @ViewChild(NoticeListComponent, { static: false }) nlcom: NoticeListComponent;

    ngOnInit(): void {
        super.ngOnInit();
        // this.selectTab(0);
        const headerTitle = `공지 사항`;
        const headerClass = `modal-header`;
        this.headerInit(headerTitle, headerClass);
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

    hisBack() {
        history.back();
    }

    headerInit($headerTitle, $headerClass) {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: $headerTitle,
            key: $headerClass
        };
    }

    selectTab(no) {
        this.tabNo = no;
    }


}

