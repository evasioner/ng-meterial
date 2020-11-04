import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as myModalCalendar from 'src/app/store/my-common/my-modal-calendar/my-modal-calendar.reducer';






/**
 * Key 설정
 */
export const myCommonFeatureKey = 'my-common';

/**
 * rentState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface myCommonState {
    [myModalCalendar.myModalCalendarsFeatureKey]: myModalCalendar.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [myCommonFeatureKey]: myCommonState;
}

/**
 * reducers wrap
 */
export function reducers(state: myCommonState | undefined, action: Action) {
    return combineReducers({
        [myModalCalendar.myModalCalendarsFeatureKey]: myModalCalendar.reducer,

    })(state, action);
}


