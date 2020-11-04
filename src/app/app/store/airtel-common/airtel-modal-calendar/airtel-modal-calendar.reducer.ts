import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { AirtelModalCalendar } from './airtel-modal-calendar.model';
import * as AirtelModalCalendarActions from './airtel-modal-calendar.actions';

export const airtelModalCalendarsFeatureKey = 'airtelModalCalendars';

export interface State extends EntityState<AirtelModalCalendar> {
  // additional entities state properties
}

export const adapter: EntityAdapter<AirtelModalCalendar> = createEntityAdapter<AirtelModalCalendar>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const airtelModalCalendarReducer = createReducer(
  initialState,
  on(AirtelModalCalendarActions.addAirtelModalCalendar,
    (state, action) => adapter.addOne(action.airtelModalCalendar, state)
  ),
  on(AirtelModalCalendarActions.upsertAirtelModalCalendar,
    (state, action) => adapter.upsertOne(action.airtelModalCalendar, state)
  ),
  on(AirtelModalCalendarActions.addAirtelModalCalendars,
    (state, action) => adapter.addMany(action.airtelModalCalendars, state)
  ),
  on(AirtelModalCalendarActions.upsertAirtelModalCalendars,
    (state, action) => adapter.upsertMany(action.airtelModalCalendars, state)
  ),
  on(AirtelModalCalendarActions.updateAirtelModalCalendar,
    (state, action) => adapter.updateOne(action.airtelModalCalendar, state)
  ),
  on(AirtelModalCalendarActions.updateAirtelModalCalendars,
    (state, action) => adapter.updateMany(action.airtelModalCalendars, state)
  ),
  on(AirtelModalCalendarActions.deleteAirtelModalCalendar,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(AirtelModalCalendarActions.deleteAirtelModalCalendars,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(AirtelModalCalendarActions.loadAirtelModalCalendars,
    (state, action) => adapter.addAll(action.airtelModalCalendars, state)
  ),
  on(AirtelModalCalendarActions.clearAirtelModalCalendars,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return airtelModalCalendarReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
