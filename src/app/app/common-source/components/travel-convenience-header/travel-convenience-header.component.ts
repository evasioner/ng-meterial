import { Component, Inject, Input, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser, isPlatformServer, Location } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { upsertCommonLayout } from '../../../store/common/common-layout/common-layout.actions';

import * as commonLayoutSelectors from '../../../store/common/common-layout/common-layout.selectors';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

import { CommonLayoutSideMenuService } from '../../services/common-layout-side-menu/common-layout-side-menu.service';

import { CommonStore } from '../../enums/common/common-store.enum';
import { ActivityCommon } from '@/app/common-source/enums/activity/activity-common.enum';

@Component({
    selector: 'app-travel-convenience-header',
    templateUrl: './travel-convenience-header.component.html',
    styleUrls: ['./travel-convenience-header.component.scss']
})
export class TravelConvenienceHeaderComponent implements OnInit, OnDestroy {
    @Input() headerType: String;
    @Input() headerConfig: any = null;

    isBrowser: boolean = false;
    isServer: boolean = false;

    vm = {
        title: '',
        sideMenuBool: false
    };

    vm$: Observable<any>;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private store: Store<any>,
        private translateService: TranslateService,
        private location: Location,
        private router: Router,
        public commonLayoutSideMenuService: CommonLayoutSideMenuService
    ) {
        this.subscriptionList = [];
    }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.isBrowser = true;
        }

        if (isPlatformServer(this.platformId)) {
            this.isServer = true;
        }

        this.headerTitleInit();
        this.observableInit();
        this.subscribeInit();
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
                this.translateService.getDefaultLang())
                .pipe(take(1))
                .subscribe(
                    (ev) => {
                        // console.log("[headerTitleInit] ev : ", ev);
                        this.vm.title = ev.HEADER.TITLE;

                        if (this.headerType !== 'page' && this.headerConfig != null) {
                            //  도시인트로, 검색결과 페이지는 헤더명이 동적으로 변경되야 함. 해당값은 title에 각 페이지에서 넣는다.
                            if (this.headerConfig.title == undefined || this.headerConfig.title == null) {
                                this.headerConfig.title = ev.HEADER.TITLE;
                            }
                        }
                    }
                )
        );
    }

    /**
     * 옵져버블 초기화
     */
    observableInit() {
        this.vm$ = this.store
            .pipe(select(commonLayoutSelectors.selectComponentStateVm));
    }

    /**
     * 서브스크라이브 초기화
     */
    subscribeInit() {
        this.subscriptionList.push(
            this.vm$
                .subscribe(
                    (ev) => {
                        if (ev) {
                            this.vmUpdate(ev);
                        }
                    }
                )
        );
    }

    /**
     * vm 데이터 업데이트
     */
    vmUpdate($commonLayout) {
        this.vm.sideMenuBool = $commonLayout.sideMenuBool;
    }

    commonLayoutStoreUpdate() {
        this.upsertOne({
            id: CommonStore.COMMON_LAYOUT,
            sideMenuBool: this.vm.sideMenuBool
        });
    }

    upsertOne(obj) {
        this.store.dispatch(
            upsertCommonLayout({ commonLayout: obj })
        );
    }

    /**
     * 메뉴클릭
     * @param e
     */
    onMenuClick(_e) {
        // console.info('[메뉴클릭]');
        this.commonLayoutSideMenuService.setOpen();
    }

    /**
     * 뒤로가기
     */
    onBackClick() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.location.back();
    }

    /**
     * 메인가기
     */
    onGoMainClick() {
        this.router.navigate([ActivityCommon.PAGE_TOTAL_MAIN]);
    }
}
