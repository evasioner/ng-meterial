import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { CommonUserInfo } from './common-user-info.model';

export const loadCommonUserInfos = createAction(
    '[CommonUserInfo/API] Load CommonUserInfos',
    props<{ commonUserInfos: CommonUserInfo[] }>()
);

export const addCommonUserInfo = createAction(
    '[CommonUserInfo/API] Add CommonUserInfo',
    props<{ commonUserInfo: CommonUserInfo }>()
);

export const upsertCommonUserInfo = createAction(
    '[CommonUserInfo/API] Upsert CommonUserInfo',
    props<{ commonUserInfo: CommonUserInfo }>()
);

export const addCommonUserInfos = createAction(
    '[CommonUserInfo/API] Add CommonUserInfos',
    props<{ commonUserInfos: CommonUserInfo[] }>()
);

export const upsertCommonUserInfos = createAction(
    '[CommonUserInfo/API] Upsert CommonUserInfos',
    props<{ commonUserInfos: CommonUserInfo[] }>()
);

export const updateCommonUserInfo = createAction(
    '[CommonUserInfo/API] Update CommonUserInfo',
    props<{ commonUserInfo: Update<CommonUserInfo> }>()
);

export const updateCommonUserInfos = createAction(
    '[CommonUserInfo/API] Update CommonUserInfos',
    props<{ commonUserInfos: Update<CommonUserInfo>[] }>()
);

export const deleteCommonUserInfo = createAction(
    '[CommonUserInfo/API] Delete CommonUserInfo',
    props<{ id: string }>()
);

export const deleteCommonUserInfos = createAction(
    '[CommonUserInfo/API] Delete CommonUserInfos',
    props<{ ids: string[] }>()
);

export const clearCommonUserInfos = createAction(
    '[CommonUserInfo/API] Clear CommonUserInfos'
);
