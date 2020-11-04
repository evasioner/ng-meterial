import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { take } from 'rxjs/operators';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';
import { BasePageComponent } from '../base-page/base-page.component';
import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-my-faq-list-page',
    templateUrl: './my-faq-list-page.component.html',
    styleUrls: ['./my-faq-list-page.component.scss']
})
export class MyFaqListPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    tabNo: any;
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private bsModalService: BsModalService,
        private route: ActivatedRoute,
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );

        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.selectTab(0);
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    () => {
                        this.headerInit();
                    }
                )
        );
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.closeAllModals();
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    headerInit() {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: 'FAQ',
            key: null
        };
    }

    selectTab(no) {
        this.tabNo = no;
    }


}
