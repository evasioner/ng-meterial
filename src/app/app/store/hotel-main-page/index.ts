import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as hotelMainSearch from 'src/app/store/hotel-main-page/hotel-main-search/hotel-main-search.reducer';


/**
 * Key 설정
 */
export const hotelMainSearchFeatureKey = 'hotel-main-search';

/**
 * hotelState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface hotelMainSearchState {
    [hotelMainSearch.hotelMainSearchesFeatureKey]: hotelMainSearch.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [hotelMainSearchFeatureKey]: hotelMainSearchState;
}

/**
 * reducers wrap
 */
export function reducers(state: hotelMainSearchState | undefined, action: Action) {
    return combineReducers({
        [hotelMainSearch.hotelMainSearchesFeatureKey]: hotelMainSearch.reducer,
    })(state, action);
}


