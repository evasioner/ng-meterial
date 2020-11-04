import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as activityCitySearch from './activity-city-search/activity-city-search.reducer';



/**
 * Key 설정
 */
export const activityCityIntroPageFeatureKey = 'activity-city-intro-page';


/**
 * activitySearchResulDetailState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface activityCityIntroState {
    [activityCitySearch.activityCitySearchesFeatureKey]: activityCitySearch.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [activityCityIntroPageFeatureKey]: activityCityIntroState;
}

/**
 * reducers wrap
 */
export function reducers(state: activityCityIntroState | undefined, action: Action) {
    return combineReducers({
        [activityCitySearch.activityCitySearchesFeatureKey]: activityCitySearch.reducer
    })(state, action);
}
