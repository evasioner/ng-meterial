import { Component, OnInit, PLATFORM_ID, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { TranslateService } from '@ngx-translate/core';
import { BasePageComponent } from '../base-page/base-page.component';
import { HeaderTypes } from 'src/app/common-source/enums/header-types.enum';

@Component({
    selector: 'app-cm-service',
    templateUrl: './cm-service.component.html',
    styleUrls: ['./cm-service.component.scss']
})
export class CmServiceComponent extends BasePageComponent implements OnInit, OnDestroy {

    headerType: any;
    headerConfig: any;
    goDetailShow: Boolean = false;
    goDetailShow2: Boolean = false;
    goDetailShow3: Boolean = false;
    goDetailShow4: Boolean = false;
    goDetailShow5: Boolean = false;
    goDetailShow6: Boolean = false;
    goDetailShow7: Boolean = false;


    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
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
    onGoDetailShow() {
        this.goDetailShow = !this.goDetailShow;
    }
    onGoDetailShow2() {
        this.goDetailShow2 = !this.goDetailShow2;
    }
    onGoDetailShow3() {
        this.goDetailShow3 = !this.goDetailShow3;
    }
    onGoDetailShow4() {
        this.goDetailShow4 = !this.goDetailShow4;
    }
    onGoDetailShow5() {
        this.goDetailShow5 = !this.goDetailShow5;
    }
    onGoDetailShow6() {
        this.goDetailShow6 = !this.goDetailShow6;
    }
    onGoDetailShow7() {
        this.goDetailShow7 = !this.goDetailShow7;
    }
}
