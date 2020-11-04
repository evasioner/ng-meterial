import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { FlightBookingInformationPage } from './flight-booking-information-page.model';
import * as FlightBookingInformationPageActions from './flight-booking-information-page.actions';

export const flightBookingInformationPagesFeatureKey = 'flightBookingInformationPages';

export interface State extends EntityState<FlightBookingInformationPage> {
  // additional entities state properties
}

export const adapter: EntityAdapter<FlightBookingInformationPage> = createEntityAdapter<FlightBookingInformationPage>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const flightBookingInformationPageReducer = createReducer(
  initialState,
  on(FlightBookingInformationPageActions.addFlightBookingInformationPage,
    (state, action) => adapter.addOne(action.flightBookingInformationPage, state)
  ),
  on(FlightBookingInformationPageActions.upsertFlightBookingInformationPage,
    (state, action) => adapter.upsertOne(action.flightBookingInformationPage, state)
  ),
  on(FlightBookingInformationPageActions.addFlightBookingInformationPages,
    (state, action) => adapter.addMany(action.flightBookingInformationPages, state)
  ),
  on(FlightBookingInformationPageActions.upsertFlightBookingInformationPages,
    (state, action) => adapter.upsertMany(action.flightBookingInformationPages, state)
  ),
  on(FlightBookingInformationPageActions.updateFlightBookingInformationPage,
    (state, action) => adapter.updateOne(action.flightBookingInformationPage, state)
  ),
  on(FlightBookingInformationPageActions.updateFlightBookingInformationPages,
    (state, action) => adapter.updateMany(action.flightBookingInformationPages, state)
  ),
  on(FlightBookingInformationPageActions.deleteFlightBookingInformationPage,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(FlightBookingInformationPageActions.deleteFlightBookingInformationPages,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(FlightBookingInformationPageActions.loadFlightBookingInformationPages,
    (state, action) => adapter.addAll(action.flightBookingInformationPages, state)
  ),
  on(FlightBookingInformationPageActions.clearFlightBookingInformationPages,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return flightBookingInformationPageReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
