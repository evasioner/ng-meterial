import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { RentSearchResultPage } from './rent-search-result-page.model';
import * as RentSearchResultPageActions from './rent-search-result-page.actions';

export const rentSearchResultPagesFeatureKey = 'rentSearchResultPages';

export interface State extends EntityState<RentSearchResultPage> {
  // additional entities state properties
}

export const adapter: EntityAdapter<RentSearchResultPage> = createEntityAdapter<RentSearchResultPage>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const rentSearchResultPageReducer = createReducer(
  initialState,
  on(RentSearchResultPageActions.addRentSearchResultPage,
    (state, action) => adapter.addOne(action.rentSearchResultPage, state)
  ),
  on(RentSearchResultPageActions.upsertRentSearchResultPage,
    (state, action) => adapter.upsertOne(action.rentSearchResultPage, state)
  ),
  on(RentSearchResultPageActions.addRentSearchResultPages,
    (state, action) => adapter.addMany(action.rentSearchResultPages, state)
  ),
  on(RentSearchResultPageActions.upsertRentSearchResultPages,
    (state, action) => adapter.upsertMany(action.rentSearchResultPages, state)
  ),
  on(RentSearchResultPageActions.updateRentSearchResultPage,
    (state, action) => adapter.updateOne(action.rentSearchResultPage, state)
  ),
  on(RentSearchResultPageActions.updateRentSearchResultPages,
    (state, action) => adapter.updateMany(action.rentSearchResultPages, state)
  ),
  on(RentSearchResultPageActions.deleteRentSearchResultPage,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(RentSearchResultPageActions.deleteRentSearchResultPages,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(RentSearchResultPageActions.loadRentSearchResultPages,
    (state, action) => adapter.addAll(action.rentSearchResultPages, state)
  ),
  on(RentSearchResultPageActions.clearRentSearchResultPages,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return rentSearchResultPageReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
