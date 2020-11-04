import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as flightBookingInformation from 'src/app/store/flight-booking-information-page/flight-booking-information-page/flight-booking-information-page.reducer';






/**
 * Key 설정
 */
export const flightBookingInformationFeatureKey = 'flight-booking-information';

/**
 * flightState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface flightBookingInformationState {
    [flightBookingInformation.flightBookingInformationPagesFeatureKey]: flightBookingInformation.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [flightBookingInformationFeatureKey]: flightBookingInformationState;
}

/**
 * reducers wrap
 */
export function reducers(state: flightBookingInformationState | undefined, action: Action) {
    return combineReducers({
        [flightBookingInformation.flightBookingInformationPagesFeatureKey]: flightBookingInformation.reducer


    })(state, action);
}


