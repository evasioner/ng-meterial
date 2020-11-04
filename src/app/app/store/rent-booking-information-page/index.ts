import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
// import * as rentMainSearch from 'src/app/store/rent-main-page/rent-main-search/rent-main-search.reducer';
import * as rentBookingInformationPage from 'src/app/store/rent-booking-information-page/rent-booking-information-page/rent-booking-information-page.reducer';




/**
 * Key 설정
 */
export const rentBookingInformationPageFeatureKey = 'rent-booking-information-page';

/**
 * rentBookingInformationState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface rentBookingInformationState {
    [rentBookingInformationPage.rentBookingInformationPagesFeatureKey]: rentBookingInformationPage.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [rentBookingInformationPageFeatureKey]: rentBookingInformationState;
}

/**
 * reducers wrap
 */
export function reducers(state: rentBookingInformationState | undefined, action: Action) {
    return combineReducers({
        [rentBookingInformationPage.rentBookingInformationPagesFeatureKey]: rentBookingInformationPage.reducer
    })(state, action);
}


