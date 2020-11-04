import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActivityCalendar } from './activity-calendar.model';
import * as ActivityCalendarActions from './activity-calendar.actions';

export const activityCalendarsFeatureKey = 'activityCalendars';

export interface State extends EntityState<ActivityCalendar> {
  // additional entities state properties
}

export const adapter: EntityAdapter<ActivityCalendar> = createEntityAdapter<ActivityCalendar>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const activityCalendarReducer = createReducer(
  initialState,
  on(ActivityCalendarActions.addActivityCalendar,
    (state, action) => adapter.addOne(action.activityCalendar, state)
  ),
  on(ActivityCalendarActions.upsertActivityCalendar,
    (state, action) => adapter.upsertOne(action.activityCalendar, state)
  ),
  on(ActivityCalendarActions.addActivityCalendars,
    (state, action) => adapter.addMany(action.activityCalendars, state)
  ),
  on(ActivityCalendarActions.upsertActivityCalendars,
    (state, action) => adapter.upsertMany(action.activityCalendars, state)
  ),
  on(ActivityCalendarActions.updateActivityCalendar,
    (state, action) => adapter.updateOne(action.activityCalendar, state)
  ),
  on(ActivityCalendarActions.updateActivityCalendars,
    (state, action) => adapter.updateMany(action.activityCalendars, state)
  ),
  on(ActivityCalendarActions.deleteActivityCalendar,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(ActivityCalendarActions.deleteActivityCalendars,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(ActivityCalendarActions.loadActivityCalendars,
    (state, action) => adapter.addAll(action.activityCalendars, state)
  ),
  on(ActivityCalendarActions.clearActivityCalendars,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return activityCalendarReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
