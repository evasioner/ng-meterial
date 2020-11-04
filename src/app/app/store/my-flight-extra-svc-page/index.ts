import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as myFlightExtraSvcPage from 'src/app/store/my-flight-extra-svc-page/my-flight-extra-svc-page/my-flight-extra-svc-page.reducer';




/**
 * Key 설정
 */
export const myFlightExtraSvcPagesFeatureKey = 'my-flight-extra-svc-page';

/**
 * myFlightExtraSvcState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface myFlightExtraSvcState {
    [myFlightExtraSvcPage.myFlightExtraSvcPagesFeatureKey]: myFlightExtraSvcPage.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [myFlightExtraSvcPagesFeatureKey]: myFlightExtraSvcState;
}

/**
 * reducers wrap
 */
export function reducers(state: myFlightExtraSvcState | undefined, action: Action) {
    return combineReducers({
        [myFlightExtraSvcPage.myFlightExtraSvcPagesFeatureKey]: myFlightExtraSvcPage.reducer
    })(state, action);
}


