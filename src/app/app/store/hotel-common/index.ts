import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as hotelModalCalendar from 'src/app/store/hotel-common/hotel-modal-calendar/hotel-modal-calendar.reducer';
import * as hotelModalDestination from 'src/app/store/hotel-common/hotel-modal-destination/hotel-modal-destination.reducer';
import * as hotelModalTravelerOption from 'src/app/store/hotel-common/hotel-modal-traveler-option/hotel-modal-traveler-option.reducer';
import * as hotelModalDetailOption from 'src/app/store/hotel-common/hotel-modal-detail-option/hotel-modal-detail-option.reducer';
import * as hotelSessionStorage from 'src/app/store/hotel-common/hotel-session-storage/hotel-session-storage.reducer';






/**
 * Key 설정
 */
export const hotelCommonFeatureKey = 'hotel-common';

/**
 * rentState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface hotelCommonState {
    [hotelModalCalendar.hotelModalCalendarsFeatureKey]: hotelModalCalendar.State;
    [hotelModalDestination.hotelModalDestinationsFeatureKey]: hotelModalDestination.State;
    [hotelModalTravelerOption.hotelModalTravelerOptionsFeatureKey]: hotelModalTravelerOption.State;
    [hotelModalDetailOption.hotelModalDetailOptionsFeatureKey]: hotelModalDestination.State;
    [hotelSessionStorage.hotelSessionStoragesFeatureKey]: hotelSessionStorage.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [hotelCommonFeatureKey]: hotelCommonState;
}

/**
 * reducers wrap
 */
export function reducers(state: hotelCommonState | undefined, action: Action) {
    return combineReducers({
        [hotelModalCalendar.hotelModalCalendarsFeatureKey]: hotelModalCalendar.reducer,
        [hotelModalDestination.hotelModalDestinationsFeatureKey]: hotelModalDestination.reducer,
        [hotelModalTravelerOption.hotelModalTravelerOptionsFeatureKey]: hotelModalTravelerOption.reducer,
        [hotelModalDetailOption.hotelModalDetailOptionsFeatureKey]: hotelModalDetailOption.reducer,
        [hotelSessionStorage.hotelSessionStoragesFeatureKey]: hotelSessionStorage.reducer,
    })(state, action);
}


