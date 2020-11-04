import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { UtilUrlService } from '../../services/util-url/util-url.service';
import { JwtService } from '../../services/jwt/jwt.service';

import { UtilMenu, UtilMenuList, YbNavList, YbSNSList } from './models/footer-model';
import { environment } from '@/environments/environment';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    public viewModel: any;

    constructor(
        private route: ActivatedRoute,
        private utilUrlService: UtilUrlService,
        private jwtService: JwtService,
        @Inject(DOCUMENT) private document: Document,
    ) {
        this.initialize();
    }

    private initialize() {
        this.viewModel = {
            detailShow: false,
            utilMenuList: UtilMenuList,
            ybSNSList: YbSNSList,
            ybNavList: YbNavList,
            ybUrl: environment.ybUrl
        };
    }

    private checkLogin() {
        this.viewModel.utilMenuList[1].view = this.jwtService.checkedLogin();
        this.viewModel.utilMenuList[0].view = !this.viewModel.utilMenuList[1].view;
    }

    public goSelectMenu(event: MouseEvent, item: UtilMenu) {
        event && event.preventDefault();

        if (item.clickEvent) {
            this[item.clickEvent].call(this);
        }
    }

    public onGoToLogin() {
        const curUrl = this.route.snapshot['_routerState'].url;
        const returnUrl = this.utilUrlService.getOrigin() + curUrl;
        console.info('[onGoToLogin > returnUrl]', returnUrl);
        const res = this.jwtService.getLoginUrl(returnUrl);
        this.document.location.href = res;
    }

}

