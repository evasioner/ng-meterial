import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as activityResultSearch from './activity-result-search/activity-result-search.reducer';




/**
 * Key 설정
 */
export const activitySearchResultPageFeatureKey = 'activity-search-result-page';



/**
 * activitySearchResulState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface activitySearchResulState {
    [activityResultSearch.activityResultSearchesFeatureKey]: activityResultSearch.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [activitySearchResultPageFeatureKey]: activitySearchResulState;
}

/**
 * reducers wrap
 */
export function reducers(state: activitySearchResulState | undefined, action: Action) {
    return combineReducers({
        [activityResultSearch.activityResultSearchesFeatureKey]: activityResultSearch.reducer
    })(state, action);
}
