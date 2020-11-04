import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as airtelResultMainSearch from 'src/app/store/airtel-search-result-page/main-search/airtel-result-main-search.reducer';
import * as airtelSearchRoomtype from 'src/app/store/airtel-search-result-page/search-roomtype/airtel-search-roomtype.reducer';




/**
 * Key 설정
 */
export const pageFeatureKey = 'airtel-search-result-page';

/**
 * State
 * - 컴포넌트 인터페이스 셋팅
 */
export interface airtelState {
    [airtelResultMainSearch.airtelResultMainSearchesFeatureKey]: airtelResultMainSearch.State;
    [airtelSearchRoomtype.airtelSearchRoomtypeFeatureKey]: airtelSearchRoomtype.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [pageFeatureKey]: airtelState;
}

/**
 * reducers wrap
 */
export function reducers(state: airtelState | undefined, action: Action) {
    return combineReducers({
        [airtelResultMainSearch.airtelResultMainSearchesFeatureKey]: airtelResultMainSearch.reducer,
        [airtelSearchRoomtype.airtelSearchRoomtypeFeatureKey]: airtelSearchRoomtype.reducer,
    })(state, action);
}
