import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as myReservationList from 'src/app/store/my-reservation/my-reservation-list/my-reservation-list.reducer';


/**
 * Key 설정
 */
export const myReservationFeatureKey = 'my-reservation-list';

/**
 * reservationState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface reservationState {
    [myReservationList.myReservationListsFeatureKey]: myReservationList.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [myReservationFeatureKey]: reservationState;
}

/**
 * reducers wrap
 */
export function reducers(state: reservationState | undefined, action: Action) {
    return combineReducers({
        [myReservationList.myReservationListsFeatureKey]: myReservationList.reducer
    })(state, action);
}


