import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';
import * as rootReducers from 'src/app/store/store';
// import * as rentMainSearch from 'src/app/store/rent-main-page/rent-main-search/rent-main-search.reducer';
import * as myMileageListPage from 'src/app/store/my-mileage/my-mileage/my-mileage.reducer';




/**
 * Key 설정
 */
export const myMileageListPageFeatureKey = 'my-mileage-list-page';

/**
 * myMileageListPageState
 * - 컴포넌트 인터페이스 셋팅
 */
export interface myMileageListPageState {
    [myMileageListPage.myMileagesFeatureKey]: myMileageListPage.State;
}

/**
 * root state
 * root state interface 에 현재 state 추가
 */
export interface State extends rootReducers.State {
    [myMileageListPageFeatureKey]: myMileageListPageState;
}

/**
 * reducers wrap
 */
export function reducers(state: myMileageListPageState | undefined, action: Action) {
    return combineReducers({
        [myMileageListPage.myMileagesFeatureKey]: myMileageListPage.reducer
    })(state, action);
}


