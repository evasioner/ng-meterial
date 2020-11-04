import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as flightSearchResultCome from 'src/app/store/flight-search-result-come-page/flight-search-result-come/flight-search-result-come.reducer';






/**
 * Key 설정
 */
export const flightSearchResultComeFeatureKey = 'flight-search-result-come';

/**
 * flightState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface flightMainSearchComeState {
    [flightSearchResultCome.flightSearchResultComesFeatureKey]: flightSearchResultCome.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [flightSearchResultComeFeatureKey]: flightMainSearchComeState;
}

/**
 * reducers wrap
 */
export function reducers(state: flightMainSearchComeState | undefined, action: Action) {
    return combineReducers({
        [flightSearchResultCome.flightSearchResultComesFeatureKey]: flightSearchResultCome.reducer


    })(state, action);
}


