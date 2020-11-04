import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { RentSearchResultDetailPage } from './rent-search-result-detail-page.model';
import * as RentSearchResultDetailPageActions from './rent-search-result-detail-page.actions';

export const rentSearchResultDetailPagesFeatureKey = 'rentSearchResultDetailPages';

export interface State extends EntityState<RentSearchResultDetailPage> {
  // additional entities state properties
}

export const adapter: EntityAdapter<RentSearchResultDetailPage> = createEntityAdapter<RentSearchResultDetailPage>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const rentSearchResultDetailPageReducer = createReducer(
  initialState,
  on(RentSearchResultDetailPageActions.addRentSearchResultDetailPage,
    (state, action) => adapter.addOne(action.rentSearchResultDetailPage, state)
  ),
  on(RentSearchResultDetailPageActions.upsertRentSearchResultDetailPage,
    (state, action) => adapter.upsertOne(action.rentSearchResultDetailPage, state)
  ),
  on(RentSearchResultDetailPageActions.addRentSearchResultDetailPages,
    (state, action) => adapter.addMany(action.rentSearchResultDetailPages, state)
  ),
  on(RentSearchResultDetailPageActions.upsertRentSearchResultDetailPages,
    (state, action) => adapter.upsertMany(action.rentSearchResultDetailPages, state)
  ),
  on(RentSearchResultDetailPageActions.updateRentSearchResultDetailPage,
    (state, action) => adapter.updateOne(action.rentSearchResultDetailPage, state)
  ),
  on(RentSearchResultDetailPageActions.updateRentSearchResultDetailPages,
    (state, action) => adapter.updateMany(action.rentSearchResultDetailPages, state)
  ),
  on(RentSearchResultDetailPageActions.deleteRentSearchResultDetailPage,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(RentSearchResultDetailPageActions.deleteRentSearchResultDetailPages,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(RentSearchResultDetailPageActions.loadRentSearchResultDetailPages,
    (state, action) => adapter.addAll(action.rentSearchResultDetailPages, state)
  ),
  on(RentSearchResultDetailPageActions.clearRentSearchResultDetailPages,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return rentSearchResultDetailPageReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
