import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { RentModalCalendar } from './rent-modal-calendar.model';
import * as RentModalCalendarActions from './rent-modal-calendar.actions';

export const rentModalCalendarsFeatureKey = 'rentModalCalendars';

export interface State extends EntityState<RentModalCalendar> {
  // additional entities state properties
}

export const adapter: EntityAdapter<RentModalCalendar> = createEntityAdapter<RentModalCalendar>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const rentModalCalendarReducer = createReducer(
  initialState,
  on(RentModalCalendarActions.addRentModalCalendar,
    (state, action) => adapter.addOne(action.rentModalCalendar, state)
  ),
  on(RentModalCalendarActions.upsertRentModalCalendar,
    (state, action) => adapter.upsertOne(action.rentModalCalendar, state)
  ),
  on(RentModalCalendarActions.addRentModalCalendars,
    (state, action) => adapter.addMany(action.rentModalCalendars, state)
  ),
  on(RentModalCalendarActions.upsertRentModalCalendars,
    (state, action) => adapter.upsertMany(action.rentModalCalendars, state)
  ),
  on(RentModalCalendarActions.updateRentModalCalendar,
    (state, action) => adapter.updateOne(action.rentModalCalendar, state)
  ),
  on(RentModalCalendarActions.updateRentModalCalendars,
    (state, action) => adapter.updateMany(action.rentModalCalendars, state)
  ),
  on(RentModalCalendarActions.deleteRentModalCalendar,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(RentModalCalendarActions.deleteRentModalCalendars,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(RentModalCalendarActions.loadRentModalCalendars,
    (state, action) => adapter.addAll(action.rentModalCalendars, state)
  ),
  on(RentModalCalendarActions.clearRentModalCalendars,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return rentModalCalendarReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
