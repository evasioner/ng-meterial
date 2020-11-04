import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as flightModalCalendar from 'src/app/store/flight-common/flight-modal-calendar/flight-modal-calendar.reducer';
import * as flightModalDestination from 'src/app/store/flight-common/flight-modal-destination/flight-modal-destination.reducer';
import * as flightModalTravelerOption from 'src/app/store/flight-common/flight-modal-traveler-option/flight-modal-traveler-option.reducer';
import * as flightSearchResult from 'src/app/store/flight-common/flight-search-result/flight-search-result.reducer';
import * as flightSessionStorage from 'src/app/store/flight-common/flight-session-storage/flight-session-storage.reducer';




/**
 * Key 설정
 */
export const flightCommonFeatureKey = 'flight-common';

/**
 * rentState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface flightCommonState {
    [flightModalCalendar.flightModalCalendarsFeatureKey]: flightModalCalendar.State;
    [flightModalDestination.flightModalDestinationsFeatureKey]: flightModalDestination.State;
    [flightModalTravelerOption.flightModalTravelerOptionsFeatureKey]: flightModalTravelerOption.State;
    [flightSearchResult.flightSearchResultsFeatureKey]: flightSearchResult.State;
    [flightSessionStorage.flightSessionStoragesFeatureKey]: flightSessionStorage.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [flightCommonFeatureKey]: flightCommonState;
}

/**
 * reducers wrap
 */
export function reducers(state: flightCommonState | undefined, action: Action) {
    return combineReducers({
        [flightModalCalendar.flightModalCalendarsFeatureKey]: flightModalCalendar.reducer,
        [flightModalDestination.flightModalDestinationsFeatureKey]: flightModalDestination.reducer,
        [flightModalTravelerOption.flightModalTravelerOptionsFeatureKey]: flightModalTravelerOption.reducer,
        [flightSearchResult.flightSearchResultsFeatureKey]: flightSearchResult.reducer,
        [flightSessionStorage.flightSessionStoragesFeatureKey]: flightSessionStorage.reducer


    })(state, action);
}


