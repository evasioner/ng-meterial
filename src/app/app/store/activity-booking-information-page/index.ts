import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as activityBookingInformation from 'src/app/store/activity-booking-information-page/activity-booking-information-page/activity-booking-information-page.reducer';






/**
 * Key 설정
 */
export const activitBookingInformationPageKey = 'activity-booking-information-page';
/**
 * activityCommonState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface activityCommonState {
    [activityBookingInformation.activityBookingInformationPagesFeatureKey]: activityBookingInformation.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [activitBookingInformationPageKey]: activityCommonState;
}

/**
 * reducers wrap
 */
export function reducers(state: activityCommonState | undefined, action: Action) {
    return combineReducers({
        [activityBookingInformation.activityBookingInformationPagesFeatureKey]: activityBookingInformation.reducer,

    })(state, action);
}


