import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as flightSearchResultGo from 'src/app/store/flight-search-result-go-page/flight-search-result-go/flight-search-result-go.reducer';






/**
 * Key 설정
 */
export const flightSearchResultGoFeatureKey = 'flight-search-result-go';

/**
 * flightState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface flightMainSearchGoState {
    [flightSearchResultGo.flightSearchResultGoesFeatureKey]: flightSearchResultGo.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [flightSearchResultGoFeatureKey]: flightMainSearchGoState;
}

/**
 * reducers wrap
 */
export function reducers(state: flightMainSearchGoState | undefined, action: Action) {
    return combineReducers({
        [flightSearchResultGo.flightSearchResultGoesFeatureKey]: flightSearchResultGo.reducer


    })(state, action);
}


