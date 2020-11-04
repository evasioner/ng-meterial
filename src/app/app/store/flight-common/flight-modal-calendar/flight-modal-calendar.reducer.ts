import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { FlightModalCalendar } from './flight-modal-calendar.model';
import * as FlightModalCalendarActions from './flight-modal-calendar.actions';

export const flightModalCalendarsFeatureKey = 'flightModalCalendars';

export interface State extends EntityState<FlightModalCalendar> {
  // additional entities state properties
}

export const adapter: EntityAdapter<FlightModalCalendar> = createEntityAdapter<FlightModalCalendar>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const flightModalCalendarReducer = createReducer(
  initialState,
  on(FlightModalCalendarActions.addFlightModalCalendar,
    (state, action) => adapter.addOne(action.flightModalCalendar, state)
  ),
  on(FlightModalCalendarActions.upsertFlightModalCalendar,
    (state, action) => adapter.upsertOne(action.flightModalCalendar, state)
  ),
  on(FlightModalCalendarActions.addFlightModalCalendars,
    (state, action) => adapter.addMany(action.flightModalCalendars, state)
  ),
  on(FlightModalCalendarActions.upsertFlightModalCalendars,
    (state, action) => adapter.upsertMany(action.flightModalCalendars, state)
  ),
  on(FlightModalCalendarActions.updateFlightModalCalendar,
    (state, action) => adapter.updateOne(action.flightModalCalendar, state)
  ),
  on(FlightModalCalendarActions.updateFlightModalCalendars,
    (state, action) => adapter.updateMany(action.flightModalCalendars, state)
  ),
  on(FlightModalCalendarActions.deleteFlightModalCalendar,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(FlightModalCalendarActions.deleteFlightModalCalendars,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(FlightModalCalendarActions.loadFlightModalCalendars,
    (state, action) => adapter.addAll(action.flightModalCalendars, state)
  ),
  on(FlightModalCalendarActions.clearFlightModalCalendars,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return flightModalCalendarReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
