import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as hotelSearchResult from 'src/app/store/hotel-search-result-page/hotel-search-result/hotel-search-result.reducer';



/**
 * Key 설정
 */
export const hotelSearchResultPageFeatureKey = 'hotel-search-result-page';

/** 
 * hotelSearchResultCompleteState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface hotelSearchResultState {
    [hotelSearchResult.hotelSearchResultsFeatureKey]: hotelSearchResult.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [hotelSearchResultPageFeatureKey]: hotelSearchResultState;
}

/**
 * reducers wrap
 */
export function reducers(state: hotelSearchResultState | undefined, action: Action) {
    return combineReducers({
        [hotelSearchResult.hotelSearchResultsFeatureKey]: hotelSearchResult.reducer,
    })(state, action);
}


