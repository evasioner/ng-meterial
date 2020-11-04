import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as activityModalCalendar from 'src/app/store/activity-common/activity-modal-calendar/activity-modal-calendar.reducer';
import * as activityModalDestination from 'src/app/store/activity-common/activity-modal-destination/activity-modal-destination.reducer';
import * as activitySessionStorage from 'src/app/store/activity-common/activity-session-storage/activity-session-storage.reducer';






/**
 * Key 설정
 */
export const activityCommonFeatureKey = 'activity-common';

/**
 * activityCommonState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface activityCommonState {
    [activityModalCalendar.activityModalCalendarsFeatureKey]: activityModalCalendar.State;
    [activityModalDestination.activityModalDestinationsFeatureKey]: activityModalDestination.State;
    [activitySessionStorage.activitySessionStoragesFeatureKey]: activitySessionStorage.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [activityCommonFeatureKey]: activityCommonState;
}

/**
 * reducers wrap
 */
export function reducers(state: activityCommonState | undefined, action: Action) {
    return combineReducers({
        [activityModalCalendar.activityModalCalendarsFeatureKey]: activityModalCalendar.reducer,
        [activityModalDestination.activityModalDestinationsFeatureKey]: activityModalDestination.reducer,
        [activitySessionStorage.activitySessionStoragesFeatureKey]: activitySessionStorage.reducer

    })(state, action);
}


