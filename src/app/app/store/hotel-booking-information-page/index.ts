import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as hotelBookingInformation from 'src/app/store/hotel-booking-information-page/hotel-booking-information/hotel-booking-information.reducer';




/**
 * Key 설정
 */
export const hotelBookingInformationPageFeatureKey = 'hotel-booking-information-page';

/** 
 * hotelBookingInformationCompleteState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface hotelBookingInformationCompleteState {
    [hotelBookingInformation.hotelBookingInformationsFeatureKey]: hotelBookingInformation.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [hotelBookingInformationPageFeatureKey]: hotelBookingInformationCompleteState;
}

/**
 * reducers wrap
 */
export function reducers(state: hotelBookingInformationCompleteState | undefined, action: Action) {
    return combineReducers({
        [hotelBookingInformation.hotelBookingInformationsFeatureKey]: hotelBookingInformation.reducer
    })(state, action);
}