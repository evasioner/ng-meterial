import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActivityBookingCompletePage } from './activity-booking-complete-page.model';
import * as ActivityBookingCompletePageActions from './activity-booking-complete-page.actions';

export const activityBookingCompletePagesFeatureKey = 'activityBookingCompletePages';

export interface State extends EntityState<ActivityBookingCompletePage> {
  // additional entities state properties
}

export const adapter: EntityAdapter<ActivityBookingCompletePage> = createEntityAdapter<ActivityBookingCompletePage>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const activityBookingCompletePageReducer = createReducer(
  initialState,
  on(ActivityBookingCompletePageActions.addActivityBookingCompletePage,
    (state, action) => adapter.addOne(action.activityBookingCompletePage, state)
  ),
  on(ActivityBookingCompletePageActions.upsertActivityBookingCompletePage,
    (state, action) => adapter.upsertOne(action.activityBookingCompletePage, state)
  ),
  on(ActivityBookingCompletePageActions.addActivityBookingCompletePages,
    (state, action) => adapter.addMany(action.activityBookingCompletePages, state)
  ),
  on(ActivityBookingCompletePageActions.upsertActivityBookingCompletePages,
    (state, action) => adapter.upsertMany(action.activityBookingCompletePages, state)
  ),
  on(ActivityBookingCompletePageActions.updateActivityBookingCompletePage,
    (state, action) => adapter.updateOne(action.activityBookingCompletePage, state)
  ),
  on(ActivityBookingCompletePageActions.updateActivityBookingCompletePages,
    (state, action) => adapter.updateMany(action.activityBookingCompletePages, state)
  ),
  on(ActivityBookingCompletePageActions.deleteActivityBookingCompletePage,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(ActivityBookingCompletePageActions.deleteActivityBookingCompletePages,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(ActivityBookingCompletePageActions.loadActivityBookingCompletePages,
    (state, action) => adapter.addAll(action.activityBookingCompletePages, state)
  ),
  on(ActivityBookingCompletePageActions.clearActivityBookingCompletePages,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return activityBookingCompletePageReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
