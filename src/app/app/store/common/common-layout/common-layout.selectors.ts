import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as pageIndex from '../index';
import * as componentReducer from './common-layout.reducer';

/**
 * createFeatureSelector : 페이지 셀렉터
 */
export const selectPageState = createFeatureSelector<pageIndex.commonState>(pageIndex.commonFeatureKey);

/**
 * createSelector : 컴포넌트 셀렉터
 */
export const selectComponentState = createSelector(
    selectPageState,
    state => state[componentReducer.commonLayoutsFeatureKey]
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
