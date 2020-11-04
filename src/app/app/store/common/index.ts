import { Action, combineReducers } from '@ngrx/store';

import * as rootReducers from 'src/app/store/store';

import * as commonLayoutReducer from 'src/app/store/common/common-layout/common-layout.reducer';
import * as commonUserInfoReducer from 'src/app/store/common/common-user-info/common-user-info.reducer';
import * as commonRouteReducer from 'src/app/store/common/common-route/common-route.reducer';

/**
 * Key 설정
 */
export const commonFeatureKey = 'storeCommon';

/**
 * commonState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface commonState {
    [commonLayoutReducer.commonLayoutsFeatureKey]: commonLayoutReducer.State;
    [commonUserInfoReducer.commonUserInfoesFeatureKey]: commonUserInfoReducer.State;
    [commonRouteReducer.commonRoutesFeatureKey]: commonRouteReducer.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [commonFeatureKey]: commonState;
}

/**
 * reducers wrap
 */
export function reducers(state: commonState | undefined, action: Action) {
    return combineReducers({
        [commonLayoutReducer.commonLayoutsFeatureKey]: commonLayoutReducer.reducer,
        [commonUserInfoReducer.commonUserInfoesFeatureKey]: commonUserInfoReducer.reducer,
        [commonRouteReducer.commonRoutesFeatureKey]: commonRouteReducer.reducer

    })(state, action);
}
