import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as flightMainSearch from 'src/app/store/flight-main-page/flight-main-search/flight-main-search.reducer';






/**
 * Key 설정
 */
export const flightMainSearchFeatureKey = 'flight-main-search';

/**
 * flightState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface flightMainSearchState {
    [flightMainSearch.flightMainSearchesFeatureKey]: flightMainSearch.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [flightMainSearchFeatureKey]: flightMainSearchState;
}

/**
 * reducers wrap
 */
export function reducers(state: flightMainSearchState | undefined, action: Action) {
    return combineReducers({
        [flightMainSearch.flightMainSearchesFeatureKey]: flightMainSearch.reducer


    })(state, action);
}


