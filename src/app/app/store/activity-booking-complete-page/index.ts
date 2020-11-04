import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as activityBookingComplete from 'src/app/store/activity-booking-complete-page/activity-booking-complete-page/activity-booking-complete-page.reducer';






/**
 * Key 설정
 */
export const activitBookingCompletePageKey = 'activity-booking-complete-page';
/**
 * activityCommonState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface activityCommonState {
    [activityBookingComplete.activityBookingCompletePagesFeatureKey]: activityBookingComplete.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [activitBookingCompletePageKey]: activityCommonState;
}

/**
 * reducers wrap
 */
export function reducers(state: activityCommonState | undefined, action: Action) {
    return combineReducers({
        [activityBookingComplete.activityBookingCompletePagesFeatureKey]: activityBookingComplete.reducer,

    })(state, action);
}


