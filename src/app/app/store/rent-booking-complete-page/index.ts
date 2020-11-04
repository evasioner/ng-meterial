import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
// import * as rentMainSearch from 'src/app/store/rent-main-page/rent-main-search/rent-main-search.reducer';




/**
 * Key 설정
 */
export const rentBookingCompletePageFeatureKey = 'rent-booking-complete-page';

/**
 * rentBookingCompleteState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface rentBookingCompleteState {
    // [rentMainSearch.rentMainSearchesFeatureKey]: rentMainSearch.State
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [rentBookingCompletePageFeatureKey]: rentBookingCompleteState;
}

/**
 * reducers wrap
 */
export function reducers(state: rentBookingCompleteState | undefined, action: Action) {
    return combineReducers({
        // [rentMainSearch.rentMainSearchesFeatureKey]: rentMainSearch.reducer
    })(state, action);
}


