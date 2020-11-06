import { Component, OnInit, Input, Inject, PLATFORM_ID, ViewEncapsulation, OnDestroy } from '@angular/core';
import { isPlatformBrowser, isPlatformServer, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { upsertCommonLayout } from '../../../store/common/common-layout/common-layout.actions';

import * as commonLayoutSelectors from '../../../store/common/common-layout/common-layout.selectors';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

import { CommonLayoutSideMenuService } from '../../services/common-layout-side-menu/common-layout-side-menu.service';

import { HeaderTypes } from '../../enums/header-types.enum';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-airtel-header',
    templateUrl: './airtel-header.component.html',
    styleUrls: ['./airtel-header.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class AirtelHeaderComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Input() headerType: HeaderTypes;
    @Input() headerConfig: any = null;

    isBrowser: boolean = false;
    isServer: boolean = false;

    alive: any = true;

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
        public commonLayoutSideMenuService: CommonLayoutSideMenuService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super(platformId);
        this.subscriptionList = [];
    }

    ngOnInit() {
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
                .pipe(takeWhile(() => this.alive))
                .subscribe(
                    (ev) => {
                        if (ev) {
                            this.vmUpdate(ev);
                            this.commonLayoutStoreUpdate();
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
            id: 'commonLayout',
            sideMenuBool: this.vm.sideMenuBool
        });
    }

    upsertOne($obj) {
        this.store.dispatch(upsertCommonLayout({
            commonLayout: $obj
        }));
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
