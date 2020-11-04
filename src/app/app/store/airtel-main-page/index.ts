import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as airtelMainSearch from 'src/app/store/airtel-main-page/airtel-main-search/airtel-main-search.reducer';






/**
 * Key 설정
 */
export const airtelMainSearchFeatureKey = 'airtel-main-search';

/**
 * flightState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface airtelMainSearchState {
    [airtelMainSearch.airtelMainSearchesFeatureKey]: airtelMainSearch.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [airtelMainSearchFeatureKey]: airtelMainSearchState;
}

/**
 * reducers wrap
 */
export function reducers(state: airtelMainSearchState | undefined, action: Action) {
    return combineReducers({
        [airtelMainSearch.airtelMainSearchesFeatureKey]: airtelMainSearch.reducer


    })(state, action);
}


