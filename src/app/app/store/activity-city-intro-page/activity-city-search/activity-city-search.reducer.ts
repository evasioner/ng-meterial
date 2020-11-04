import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActivityCitySearch } from './activity-city-search.model';
import * as ActivityCitySearchActions from './activity-city-search.actions';

export const activityCitySearchesFeatureKey = 'activityCitySearches';

export interface State extends EntityState<ActivityCitySearch> {
    // additional entities state properties
}

export const adapter: EntityAdapter<ActivityCitySearch> = createEntityAdapter<ActivityCitySearch>();

export const initialState: State = adapter.getInitialState({
    // additional entity state properties
});

const activityCitySearchReducer = createReducer(
    initialState,
    on(ActivityCitySearchActions.addActivityCitySearch,
        (state, action) => adapter.addOne(action.activityCitySearch, state)
    ),
    on(ActivityCitySearchActions.upsertActivityCitySearch,
        (state, action) => adapter.upsertOne(action.activityCitySearch, state)
    ),
    on(ActivityCitySearchActions.addActivityCitySearchs,
        (state, action) => adapter.addMany(action.activityCitySearchs, state)
    ),
    on(ActivityCitySearchActions.upsertActivityCitySearchs,
        (state, action) => adapter.upsertMany(action.activityCitySearchs, state)
    ),
    on(ActivityCitySearchActions.updateActivityCitySearch,
        (state, action) => adapter.updateOne(action.activityCitySearch, state)
    ),
    on(ActivityCitySearchActions.updateActivityCitySearchs,
        (state, action) => adapter.updateMany(action.activityCitySearchs, state)
    ),
    on(ActivityCitySearchActions.deleteActivityCitySearch,
        (state, action) => adapter.removeOne(action.id, state)
    ),
    on(ActivityCitySearchActions.deleteActivityCitySearchs,
        (state, action) => adapter.removeMany(action.ids, state)
    ),
    on(ActivityCitySearchActions.loadActivityCitySearchs,
        (state, action) => adapter.addAll(action.activityCitySearchs, state)
    ),
    on(ActivityCitySearchActions.clearActivityCitySearchs,
        state => adapter.removeAll(state)
    ),
);

export function reducer(state: State | undefined, action: Action) {
    return activityCitySearchReducer(state, action);
}

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = adapter.getSelectors();
