import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as commonUserInfoSelectors from '../../../store/common/common-user-info/common-user-info.selectors';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class CommonUserInfoService {

    constructor(
        private store: Store<any>
    ) { }

    /**
     * 유저 정보 가져오기
     */
    getUserInfoSvc() {

        let vm$: Observable<any>;

        // 데이터 선택
        vm$ = this.store
            .pipe(select(commonUserInfoSelectors.selectComponentStateVm));

        let vmInfo;

        // 데이터 전송
        vm$
            .subscribe(
                (ev) => {
                    vmInfo = _.cloneDeep(ev);
                }
            )
            .unsubscribe();

        // 리턴
        return vmInfo;
    }






}
