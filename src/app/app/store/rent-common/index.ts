import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as rentModalCalendar from 'src/app/store/rent-common/rent-modal-calendar/rent-modal-calendar.reducer';
import * as rentModalDestination from 'src/app/store/rent-common/rent-modal-destination/rent-modal-destination.reducer';






/**
 * Key 설정
 */
export const rentCommonFeatureKey = 'rent-common';

/**
 * rentState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface rentCommonState {
    [rentModalCalendar.rentModalCalendarsFeatureKey]: rentModalCalendar.State;
    [rentModalDestination.rentModalDestinationsFeatureKey]: rentModalDestination.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [rentCommonFeatureKey]: rentCommonState;
}

/**
 * reducers wrap
 */
export function reducers(state: rentCommonState | undefined, action: Action) {
    return combineReducers({
        [rentModalCalendar.rentModalCalendarsFeatureKey]: rentModalCalendar.reducer,
        [rentModalDestination.rentModalDestinationsFeatureKey]: rentModalDestination.reducer

    })(state, action);
}


