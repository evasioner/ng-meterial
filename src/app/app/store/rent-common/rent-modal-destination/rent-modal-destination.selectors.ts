import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as pageIndex from '../index';
import * as componentReducer from './rent-modal-destination.reducer';


/**
 * createFeatureSelector : 페이지 셀렉터
 */
export const selectPageState = createFeatureSelector<pageIndex.rentCommonState>(pageIndex.rentCommonFeatureKey);

/**
 * createSelector : 컴포넌트 셀렉터
 */
export const selectComponentState = createSelector(
    selectPageState,
    state => state[componentReducer.rentModalDestinationsFeatureKey]
);

/**
 * @ngrx/Entity selector
 */
export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = componentReducer.adapter.getSelectors(selectComponentState);

/**
 * component > vm
 */
export const selectComponentStateVm = createSelector(
    selectEntities,
    selectIds,
    (entities, ids) => entities[ids[0]]
);

export const getSelectId = ($id) => {

    return createSelector(
        selectEntities,
        selectIds,
        (entities, ids) => entities[$id]
    );

};