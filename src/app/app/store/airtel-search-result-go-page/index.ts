import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as airtelSearchResultGo from 'src/app/store/airtel-search-result-go-page/airtel-search-result-go/airtel-search-result-go.reducer';






/**
 * Key 설정
 */
export const airtelSearchResultGoFeatureKey = 'airtel-search-result-go';

/**
 * airtelState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface airtelMainSearchGoState {
    [airtelSearchResultGo.airtelSearchResultGoesFeatureKey]: airtelSearchResultGo.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [airtelSearchResultGoFeatureKey]: airtelMainSearchGoState;
}

/**
 * reducers wrap
 */
export function reducers(state: airtelMainSearchGoState | undefined, action: Action) {
    return combineReducers({
        [airtelSearchResultGo.airtelSearchResultGoesFeatureKey]: airtelSearchResultGo.reducer


    })(state, action);
}


