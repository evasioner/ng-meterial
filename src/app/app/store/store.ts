import { InjectionToken } from '@angular/core';

import { Action, ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';

import * as fromRouter from '@ngrx/router-store';

import * as storeCommon from 'src/app/store/common/index';
import * as myCommon from 'src/app/store/my-common/index';
import * as rentCommon from 'src/app/store/rent-common/index';
import * as flightCommon from 'src/app/store/flight-common/index';
import * as hotelCommon from 'src/app/store/hotel-common/index';
import * as airtelCommon from 'src/app/store/airtel-common/index';
import * as activityCommon from 'src/app/store/activity-common/index';

import { localStorageSyncReducer } from './local-storage-sync-reducer';

import { environment } from '@/environments/environment';

/**
 * Root State Interface
 * router
 * auth
 * layout
 * page > 컴포넌트
 */
export interface State {
    router: fromRouter.RouterReducerState<any>;
}

/**
 * Root State Interface
 */
export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>(
    'ROOT_REDUCERS_TOKEN',
    {
        factory: () => ({
            [storeCommon.commonFeatureKey]: storeCommon.reducers,
            [myCommon.myCommonFeatureKey]: myCommon.reducers,
            [rentCommon.rentCommonFeatureKey]: rentCommon.reducers,
            [flightCommon.flightCommonFeatureKey]: flightCommon.reducers,
            [hotelCommon.hotelCommonFeatureKey]: hotelCommon.reducers,
            [airtelCommon.airtelCommonFeatureKey]: airtelCommon.reducers,
            [activityCommon.activityCommonFeatureKey]: activityCommon.reducers,
            router: fromRouter.routerReducer
        })
    }
);

/**
 * 로그 설정
 * @param reducer
 */
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
    return (state, action) => {
        const result = reducer(state, action);
        // console.groupCollapsed(action.type);
        // console.log('[LOG: PREV STATE]', state);
        // console.log('[LOG: ACTION]', action);
        // console.log('[LOG: NEXT STATE] ', result);
        // console.groupEnd();
        return result;
    };
}

/**
 * 개발 모드 에서만 로그 출력
 */
export const metaReducers: MetaReducer<State>[] = !environment.production
    ? [logger, localStorageSyncReducer]
    : [localStorageSyncReducer];
