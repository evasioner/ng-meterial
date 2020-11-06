import { Component, Inject, Input, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { RentUtilService } from '../../services/rent-com-service/rent-util.service';
import { CommonLayoutSideMenuService } from '../../services/common-layout-side-menu/common-layout-side-menu.service';

import { HeaderTypes } from '../../enums/header-types.enum';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-rent-header',
    templateUrl: './rent-header.component.html'
})
export class RentHeaderComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Input() headerType: HeaderTypes;
    @Input() headerConfig: any = null;

    vm = {
        title: ''
    };

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public translateService: TranslateService,
        public rentUtilSvc: RentUtilService,
        private location: Location,
        public commonLayoutSideMenuService: CommonLayoutSideMenuService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super(platformId);
        this.subscriptionList = [];
    }

    ngOnInit() {
        super.ngOnInit();
        this.headerTitleInit();
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    /**
     * 헤더 타이틀 초기화
     */
    headerTitleInit() {
        this.subscriptionList.push(
            this.translateService.getTranslation(
                this.translateService.getDefaultLang()
            )
                .pipe(take(1))
                .subscribe(
                    (ev) => {
                        this.vm.title = ev.HEADER.TITLE;
                    }
                )
        );
    }

    /**
     * onMainClick
     * 메인 메뉴로 이동
     *
     * @param event 돔 이벤트
     */
    public onMainClick(event: any): void {
        event && event.preventDefault();

        this.router.navigate(['/main'], { relativeTo: this.route });
    }

    /**
     * onMenuClick
     * 메뉴 표시
     *
     * @param event 돔 이벤트
     */
    public onMenuClick(event: any): void {
        event && event.preventDefault();

        this.commonLayoutSideMenuService.setOpen();
    }

    /**
     * onBackClick
     * 뒤로가기
     *
     * @param event 돔 이벤트
     */
    public onBackClick(event: any): void {
        event && event.preventDefault();

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.location.back();
    }
}
