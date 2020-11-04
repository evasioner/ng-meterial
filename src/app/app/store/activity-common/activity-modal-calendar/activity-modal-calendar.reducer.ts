import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActivityModalCalendar } from './activity-modal-calendar.model';
import * as ActivityModalCalendarActions from './activity-modal-calendar.actions';

export const activityModalCalendarsFeatureKey = 'activityModalCalendars';

export interface State extends EntityState<ActivityModalCalendar> {
  // additional entities state properties
}

export const adapter: EntityAdapter<ActivityModalCalendar> = createEntityAdapter<ActivityModalCalendar>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const activityModalCalendarReducer = createReducer(
  initialState,
  on(ActivityModalCalendarActions.addActivityModalCalendar,
    (state, action) => adapter.addOne(action.activityModalCalendar, state)
  ),
  on(ActivityModalCalendarActions.upsertActivityModalCalendar,
    (state, action) => adapter.upsertOne(action.activityModalCalendar, state)
  ),
  on(ActivityModalCalendarActions.addActivityModalCalendars,
    (state, action) => adapter.addMany(action.activityModalCalendars, state)
  ),
  on(ActivityModalCalendarActions.upsertActivityModalCalendars,
    (state, action) => adapter.upsertMany(action.activityModalCalendars, state)
  ),
  on(ActivityModalCalendarActions.updateActivityModalCalendar,
    (state, action) => adapter.updateOne(action.activityModalCalendar, state)
  ),
  on(ActivityModalCalendarActions.updateActivityModalCalendars,
    (state, action) => adapter.updateMany(action.activityModalCalendars, state)
  ),
  on(ActivityModalCalendarActions.deleteActivityModalCalendar,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(ActivityModalCalendarActions.deleteActivityModalCalendars,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(ActivityModalCalendarActions.loadActivityModalCalendars,
    (state, action) => adapter.addAll(action.activityModalCalendars, state)
  ),
  on(ActivityModalCalendarActions.clearActivityModalCalendars,
    state => adapter.removeAll(state)
  )
);

export function reducer(state: State | undefined, action: Action) {
  return activityModalCalendarReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
