import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as activitySearchResultDetail from './activity-search-result-detail-page/activity-search-result-detail-page.reducer';




/**
 * Key 설정
 */
export const activitySearchResultDetailPageFeatureKey = 'activity-search-result-detail-page';



/**
 * activitySearchResulDetailState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface activitySearchResulDetailState {
    [activitySearchResultDetail.activitySearchResultDetailPagesFeatureKey]: activitySearchResultDetail.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [activitySearchResultDetailPageFeatureKey]: activitySearchResulDetailState;
}

/**
 * reducers wrap
 */
export function reducers(state: activitySearchResulDetailState | undefined, action: Action) {
    return combineReducers({
        [activitySearchResultDetail.activitySearchResultDetailPagesFeatureKey]: activitySearchResultDetail.reducer
    })(state, action);
}
