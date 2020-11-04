import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import * as commonLayoutSelectors from '../../../store/common/common-layout/common-layout.selectors';

import { upsertCommonLayout } from '../../../store/common/common-layout/common-layout.actions';

@Injectable({
    providedIn: 'root'
})
export class CommonLayoutSideMenuService implements OnDestroy {
    isMyModalMain: boolean;
    isMyModalMain$: Observable<any>;
    storeId: string = 'my-menu-layout';
    private subscriptionList: Subscription[];

    constructor(
        private store: Store<any>
    ) {
        this.subscriptionList = [];
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

    observableInit() {
        console.info('[CommonLayoutSideMenuService > observableInit]');
        this.isMyModalMain$ = this.store
            .pipe(select(commonLayoutSelectors.getSelectId([this.storeId])));
    }

    subscribeInit() {
        console.info('[CommonLayoutSideMenuService > subscribeInit]');
        this.subscriptionList.push(
            this.isMyModalMain$
                .subscribe(
                    (ev: any) => {
                        console.info('[CommonLayoutSideMenuService > subscribeInit]', ev);
                        if (ev) {
                            this.isMyModalMain = ev.isMyModalMain;

                        } else {
                            this.isMyModalMain = false;
                            this.commonLayoutUpsertOne({
                                id: this.storeId,
                                isMyModalMain: false
                            });
                        }
                    }
                )
        );
    }

    /**
     * 메뉴 상태 toggle
     *
     */
    setToggleIsMyModalMain() {
        console.info('[setToggleIsMyModalMain before]', this.isMyModalMain);
        this.isMyModalMain = (this.isMyModalMain) ? false : true;
        this.commonLayoutUpsertOne({
            id: this.storeId,
            isMyModalMain: this.isMyModalMain
        });
        console.info('[setToggleIsMyModalMain after]', this.isMyModalMain);
        this.setHtmlBodyClass();
    }

    setClose() {
        this.isMyModalMain = false;
        this.commonLayoutUpsertOne({
            id: this.storeId,
            isMyModalMain: this.isMyModalMain
        });
        this.setHtmlBodyClass();
    }

    setOpen() {
        this.isMyModalMain = true;
        this.commonLayoutUpsertOne({
            id: this.storeId,
            isMyModalMain: this.isMyModalMain
        });
        this.setHtmlBodyClass();
    }

    /**
     * 메뉴 상태 출력
     */
    getIsMyModalMain() {
        console.info('[getIsMyModalMain]', this.isMyModalMain);
        this.setHtmlBodyClass();
        return this.isMyModalMain;
    }

    /**
     *
     * setHtmlBodyClass
     */
    setHtmlBodyClass() {
        if (this.isMyModalMain) {
            const bodyEl = document.getElementsByTagName('body')[0];
            bodyEl.classList.add('overflow-none');
        } else {
            const bodyEl = document.getElementsByTagName('body')[0];
            bodyEl.classList.remove('overflow-none');
        }
    }

    commonLayoutUpsertOne($obj) {
        this.store.dispatch(
            upsertCommonLayout({ commonLayout: $obj })
        );
    }
}
