import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

export interface State {
    router: fromRouter.RouterReducerState<any>;
}

export const selectRouter = createFeatureSelector<State, fromRouter.RouterReducerState<any>>('router');

/**
 1. selectCurrentRoute : 현재 경로를 선택하십시오
 2. selectQueryParams : 현재 경로 쿼리 매개 변수를 선택하십시오.
 3. selectQueryParam : 쿼리 매개 변수를 선택하는 공장 기능
 4. selectRouteParams : 현재 경로 매개 변수를 선택하십시오
 5. selectRouteParam : 노선 매개 변수를 선택하는 공장 기능
 6. selectRouteData : 현재 경로 데이터를 선택하십시오
 7. selectUrl : 현재 URL을 선택하십시오
 */
const {
    selectCurrentRoute,   // select the current route
    selectQueryParams,    // select the current route query params
    selectQueryParam,     // factory function to select a query param
    selectRouteParams,    // select the current route params
    selectRouteParam,     // factory function to select a route param
    selectRouteData,      // select the current route data
    selectUrl,            // select the current url

} = fromRouter.getSelectors(selectRouter);

// export const selectSelectedCarId = selectQueryParam('carId');
export const selectCurrentRouteVal = selectCurrentRoute;
export const selectUrlVal = selectUrl;
export const selectRouterAll = {
    selectCurrentRoute,
    selectQueryParams,
    selectQueryParam,
    selectRouteParams,
    selectRouteParam,
    selectRouteData,
    selectUrl
};


// export const selectCar = createSelector(
//     selectCarEntities,
//     selectSelectedCarId,
//     (cars, carId) => cars[carId]
// );
//
// export const selectCarsByColor = createSelector(
//     selectCarEntities,
//     selectQueryParams,
//     (cars, params) => cars.filter(c => c.color === params['color'])
// );
