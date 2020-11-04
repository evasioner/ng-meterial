import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { debounceTime, filter, pairwise, take } from 'rxjs/operators';
import * as _ from 'lodash';
import { select, Store } from '@ngrx/store';
import { upsertCommonRoute } from '../../../store/common/common-route/common-route.actions';
import * as commonRouteSelectors from '../../../store/common/common-route/common-route.selectors';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RouterHistoryService implements OnDestroy {
    history = [];
    previousRoute$: any;
    private subscriptionList: Subscription[];

    constructor(
        private store: Store<any>,
        private router: Router
    ) {
        this.subscriptionList = [];
        console.info('[RouterHistoryService > constructor]', this.history);
        this.historyInit();
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
     * 히스토리 초기화
     * NgRx Store + 로컬스토리지
     * 데이터 있으면 초기화 한다.
     */
    historyInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    take(1),
                    select(commonRouteSelectors.getSelectId('router-history'))
                )
                .subscribe(
                    (rv: any) => {
                        console.info('[historyInit > rv]', rv);
                        if (rv) {
                            this.history = [...this.history, ...rv['history']];
                            console.info('[historyInit]', this.history);
                        }
                    },
                    err => {
                        console.info('[historyInit > err]', err);
                    }
                )
        );
    }

    /**
     * 이전, 현재 url 가져오기
     * NavigationEnd 라우팅 이벤트
     * debounceTime 일정시간동안 반복적인 값은 버림
     * pairwise 이전 이후 데이터 출력
     */
    observableInit() {
        this.previousRoute$ = this.router.events.pipe(
            filter(e => e instanceof NavigationEnd),
            debounceTime(500),
            pairwise()
        );
    }

    subscribeInit() {
        this.subscriptionList.push(
            this.previousRoute$
                .subscribe(
                    (ev: any) => {
                        console.info('[previousRoute$]', ev);

                        const previousUrlTg = ev[0].url;
                        const curUrlTg = ev[1].url;
                        const previousUrlList = _.split(previousUrlTg, '/');
                        const curUrlList = _.split(curUrlTg, '/');

                        this.history = [...this.history, previousUrlTg];

                        this.commonRouteUpsertOne({
                            id: 'router-history',
                            history: this.history
                        });

                        console.info('[previousRoute$ > previousUrlList]', previousUrlList);
                        console.info('[previousRoute$ > curUrlList]', curUrlList);

                        // if (curUrlList[1] === previousUrlList[1]) {
                        //     console.info('[이전과 동일한 페이지]');
                        // } else {
                        //     console.info('[이전과 다른 페이지 > 뒤로가기 업데이트]');
                        // }
                    }
                )
        );
    }

    commonRouteUpsertOne($obj) {
        this.store.dispatch(upsertCommonRoute({
            commonRoute: $obj
        }));
    }

    public getHistory(): string[] {
        return this.history;
    }

    // public getPreviousUrl(): string {
    //     return this.history[this.history.length - 2] || '/index';
    // }


}
