import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as airtelModalCalendar from 'src/app/store/airtel-common/airtel-modal-calendar/airtel-modal-calendar.reducer';
import * as airtelModalDestination from 'src/app/store/airtel-common/airtel-modal-destination/airtel-modal-destination.reducer';
import * as airtelModalTravelerOption from 'src/app/store/airtel-common/airtel-modal-traveler-option/airtel-modal-traveler-option.reducer';
import * as airtelSearchResult from 'src/app/store/airtel-common/airtel-search-result/airtel-search-result.reducer';





/**
 * Key 설정
 */
export const airtelCommonFeatureKey = 'airtel-common';

/**
 * rentState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface airtelCommonState {
    [airtelModalCalendar.airtelModalCalendarsFeatureKey]: airtelModalCalendar.State;
    [airtelModalDestination.airtelModalDestinationsFeatureKey]: airtelModalDestination.State;
    [airtelModalTravelerOption.airtelModalTravelerOptionsFeatureKey]: airtelModalTravelerOption.State;
    [airtelSearchResult.airtelSearchResultsFeatureKey]: airtelSearchResult.State;

}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [airtelCommonFeatureKey]: airtelCommonState;
}

/**
 * reducers wrap
 */
export function reducers(state: airtelCommonState | undefined, action: Action) {
    return combineReducers({
        [airtelModalCalendar.airtelModalCalendarsFeatureKey]: airtelModalCalendar.reducer,
        [airtelModalDestination.airtelModalDestinationsFeatureKey]: airtelModalDestination.reducer,
        [airtelModalTravelerOption.airtelModalTravelerOptionsFeatureKey]: airtelModalTravelerOption.reducer,
        [airtelSearchResult.airtelSearchResultsFeatureKey]: airtelSearchResult.reducer
    })(state, action);
}


