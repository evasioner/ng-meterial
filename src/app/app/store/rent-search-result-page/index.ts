import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
// import * as rentMainSearch from 'src/app/store/rent-main-page/rent-main-search/rent-main-search.reducer';
import * as rentSearchResultPage
    from 'src/app/store/rent-search-result-page/rent-search-result-page/rent-search-result-page.reducer';


/**
 * Key 설정
 */
export const rentSearchResultPageFeatureKey = 'rent-search-result-page';

/**
 * rentSearchResultState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface rentSearchResultState {
    [rentSearchResultPage.rentSearchResultPagesFeatureKey]: rentSearchResultPage.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [rentSearchResultPageFeatureKey]: rentSearchResultState;
}

/**
 * reducers wrap
 */
export function reducers(state: rentSearchResultState | undefined, action: Action) {
    return combineReducers({
        [rentSearchResultPage.rentSearchResultPagesFeatureKey]: rentSearchResultPage.reducer
    })(state, action);
}


