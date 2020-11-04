import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as activityMainSearch from './activity-main-search/activity-main-search.reducer';




/**
 * Key 설정
 */
export const activityPageFeatureKey = 'activity-page';



/**
 * activityState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface activityState {
    [activityMainSearch.activityMainSearchesFeatureKey]: activityMainSearch.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [activityPageFeatureKey]: activityState;
}

/**
 * reducers wrap
 */
export function reducers(state: activityState | undefined, action: Action) {
    return combineReducers({
        [activityMainSearch.activityMainSearchesFeatureKey]: activityMainSearch.reducer
    })(state, action);
}
