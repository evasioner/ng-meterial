import { ActionReducer } from '@ngrx/store';
import { localStorageSync, } from 'ngrx-store-localstorage';

import * as sessionstorage from 'sessionstorage';

/**
 * ngrx-store-localstorage
 * - 로컬스토리지 저장 항목 정의
 */
const localStorageSyncOption = {
    keys: [
        // {'storeCommon': ['commonLayouts']}
        { 'storeCommon': ['commonUserInfoes'] },
        { 'flight-common': ['flightSessionStorages'] },
        { 'hotel-common': ['hotelSessionStorages'] },
        { 'activity-common': ['activitySessionStorages'] }
    ],
    rehydrate: true,
    // storage: sessionstorage
};

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return localStorageSync(localStorageSyncOption)(reducer);
}
