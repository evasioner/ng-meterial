import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { MyModalCalendar } from './my-modal-calendar.model';
import * as MyModalCalendarActions from './my-modal-calendar.actions';

export const myModalCalendarsFeatureKey = 'myModalCalendars';

export interface State extends EntityState<MyModalCalendar> {
  // additional entities state properties
}

export const adapter: EntityAdapter<MyModalCalendar> = createEntityAdapter<MyModalCalendar>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const myModalCalendarReducer = createReducer(
  initialState,
  on(MyModalCalendarActions.addMyModalCalendar,
    (state, action) => adapter.addOne(action.myModalCalendar, state)
  ),
  on(MyModalCalendarActions.upsertMyModalCalendar,
    (state, action) => adapter.upsertOne(action.myModalCalendar, state)
  ),
  on(MyModalCalendarActions.addMyModalCalendars,
    (state, action) => adapter.addMany(action.myModalCalendars, state)
  ),
  on(MyModalCalendarActions.upsertMyModalCalendars,
    (state, action) => adapter.upsertMany(action.myModalCalendars, state)
  ),
  on(MyModalCalendarActions.updateMyModalCalendar,
    (state, action) => adapter.updateOne(action.myModalCalendar, state)
  ),
  on(MyModalCalendarActions.updateMyModalCalendars,
    (state, action) => adapter.updateMany(action.myModalCalendars, state)
  ),
  on(MyModalCalendarActions.deleteMyModalCalendar,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(MyModalCalendarActions.deleteMyModalCalendars,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(MyModalCalendarActions.loadMyModalCalendars,
    (state, action) => adapter.addAll(action.myModalCalendars, state)
  ),
  on(MyModalCalendarActions.clearMyModalCalendars,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return myModalCalendarReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
