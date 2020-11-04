import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as commonLayoutSelectors from '../../store/common/common-layout/common-layout.selectors';
import { upsertCommonLayout } from '../../store/common/common-layout/common-layout.actions';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalMypageMainComponent } from './modal-components/modal-mypage-main/modal-mypage-main.component';

@Component({
    selector: 'app-page-layout',
    templateUrl: './page-layout.component.html',
    styleUrls: ['./page-layout.component.scss']
})
export class PageLayoutComponent implements OnDestroy {
    isMyModalMain: boolean;
    isMyModalMain$: Observable<any>;
    storeId: string = 'my-menu-layout';
    bsModalRef: BsModalRef;
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

    @ViewChild(ModalMypageMainComponent) myMain: ModalMypageMainComponent;

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

    commonLayoutUpsertOne($obj) {
        this.store.dispatch(upsertCommonLayout({
            commonLayout: $obj
        }));
    }


}
