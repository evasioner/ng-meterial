import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { RentBookingInformationPage } from './rent-booking-information-page.model';
import * as RentBookingInformationPageActions from './rent-booking-information-page.actions';

export const rentBookingInformationPagesFeatureKey = 'rentBookingInformationPages';

export interface State extends EntityState<RentBookingInformationPage> {
  // additional entities state properties
}

export const adapter: EntityAdapter<RentBookingInformationPage> = createEntityAdapter<RentBookingInformationPage>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const rentBookingInformationPageReducer = createReducer(
  initialState,
  on(RentBookingInformationPageActions.addRentBookingInformationPage,
    (state, action) => adapter.addOne(action.rentBookingInformationPage, state)
  ),
  on(RentBookingInformationPageActions.upsertRentBookingInformationPage,
    (state, action) => adapter.upsertOne(action.rentBookingInformationPage, state)
  ),
  on(RentBookingInformationPageActions.addRentBookingInformationPages,
    (state, action) => adapter.addMany(action.rentBookingInformationPages, state)
  ),
  on(RentBookingInformationPageActions.upsertRentBookingInformationPages,
    (state, action) => adapter.upsertMany(action.rentBookingInformationPages, state)
  ),
  on(RentBookingInformationPageActions.updateRentBookingInformationPage,
    (state, action) => adapter.updateOne(action.rentBookingInformationPage, state)
  ),
  on(RentBookingInformationPageActions.updateRentBookingInformationPages,
    (state, action) => adapter.updateMany(action.rentBookingInformationPages, state)
  ),
  on(RentBookingInformationPageActions.deleteRentBookingInformationPage,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(RentBookingInformationPageActions.deleteRentBookingInformationPages,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(RentBookingInformationPageActions.loadRentBookingInformationPages,
    (state, action) => adapter.addAll(action.rentBookingInformationPages, state)
  ),
  on(RentBookingInformationPageActions.clearRentBookingInformationPages,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return rentBookingInformationPageReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
