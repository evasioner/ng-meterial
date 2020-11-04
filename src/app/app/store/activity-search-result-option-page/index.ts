import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as activitySearchResultOption from './activity-search-result-option-page/activity-search-result-option-page.reducer';
import * as activityCalendar from './activity-calendar/activity-calendar.reducer';




/**
 * Key 설정
 */
export const activitySearchResultOptionPageFeatureKey = 'activity-search-result-option-page';



/**
 * activitySearchResulOptionState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface activitySearchResulOptionState {
    [activitySearchResultOption.activitySearchResultOptionPagesFeatureKey]: activitySearchResultOption.State;
    [activityCalendar.activityCalendarsFeatureKey]: activityCalendar.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [activitySearchResultOptionPageFeatureKey]: activitySearchResulOptionState;
}

/**
 * reducers wrap
 */
export function reducers(state: activitySearchResulOptionState | undefined, action: Action) {
    return combineReducers({
        [activitySearchResultOption.activitySearchResultOptionPagesFeatureKey]: activitySearchResultOption.reducer,
        [activityCalendar.activityCalendarsFeatureKey]: activityCalendar.reducer
    })(state, action);
}
