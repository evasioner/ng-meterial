import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
import * as hotelSearchRoomtype from 'src/app/store/hotel-search-roomtype-page/hotel-search-roomtype/hotel-search-roomtype.reducer';




/**
 * Key 설정
 */
export const hotelSearchRoomtypePageFeatureKey = 'hotel-search-roomtype-page';

/** 
 * hotelSearchRoomtypeCompleteState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface hotelSearchRoomtypeCompleteState {
    [hotelSearchRoomtype.hotelSearchRoomtypesFeatureKey]: hotelSearchRoomtype.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [hotelSearchRoomtypePageFeatureKey]: hotelSearchRoomtypeCompleteState;
}

/**
 * reducers wrap
 */
export function reducers(state: hotelSearchRoomtypeCompleteState | undefined, action: Action) {
    return combineReducers({
        [hotelSearchRoomtype.hotelSearchRoomtypesFeatureKey]: hotelSearchRoomtype.reducer
    })(state, action);
}