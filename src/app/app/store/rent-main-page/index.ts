import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as rentMainSearch from 'src/app/store/rent-main-page/rent-main-search/rent-main-search.reducer';


/**
 * Key 설정
 */
export const rentMainPageFeatureKey = 'rent-main-page';

/**
 * rentState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface rentState {
    [rentMainSearch.rentMainSearchesFeatureKey]: rentMainSearch.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [rentMainPageFeatureKey]: rentState;
}

/**
 * reducers wrap
 */
export function reducers(state: rentState | undefined, action: Action) {
    return combineReducers({
        [rentMainSearch.rentMainSearchesFeatureKey]: rentMainSearch.reducer
    })(state, action);
}


