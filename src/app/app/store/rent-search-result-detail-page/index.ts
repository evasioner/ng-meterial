import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as rentSearchResultDetailPage from 'src/app/store/rent-search-result-detail-page/rent-search-result-detail-page/rent-search-result-detail-page.reducer';




/**
 * Key 설정
 */
export const rentSearchResultDetailPageFeatureKey = 'rent-search-result-detail-page';

/**
 * rentSearchResultDetailState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface rentSearchResultDetailState {
    [rentSearchResultDetailPage.rentSearchResultDetailPagesFeatureKey]: rentSearchResultDetailPage.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [rentSearchResultDetailPageFeatureKey]: rentSearchResultDetailState;
}

/**
 * reducers wrap
 */
export function reducers(state: rentSearchResultDetailState | undefined, action: Action) {
    return combineReducers({
        [rentSearchResultDetailPage.rentSearchResultDetailPagesFeatureKey]: rentSearchResultDetailPage.reducer
    })(state, action);
}


