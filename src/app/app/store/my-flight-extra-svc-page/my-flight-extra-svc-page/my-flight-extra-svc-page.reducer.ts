import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { MyFlightExtraSvcPage } from './my-flight-extra-svc-page.model';
import * as MyFlightExtraSvcPageActions from './my-flight-extra-svc-page.actions';

export const myFlightExtraSvcPagesFeatureKey = 'myFlightExtraSvcPages';

export interface State extends EntityState<MyFlightExtraSvcPage> {
  // additional entities state properties
}

export const adapter: EntityAdapter<MyFlightExtraSvcPage> = createEntityAdapter<MyFlightExtraSvcPage>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const myFlightExtraSvcPageReducer = createReducer(
  initialState,
  on(MyFlightExtraSvcPageActions.addMyFlightExtraSvcPage,
    (state, action) => adapter.addOne(action.myFlightExtraSvcPage, state)
  ),
  on(MyFlightExtraSvcPageActions.upsertMyFlightExtraSvcPage,
    (state, action) => adapter.upsertOne(action.myFlightExtraSvcPage, state)
  ),
  on(MyFlightExtraSvcPageActions.addMyFlightExtraSvcPages,
    (state, action) => adapter.addMany(action.myFlightExtraSvcPages, state)
  ),
  on(MyFlightExtraSvcPageActions.upsertMyFlightExtraSvcPages,
    (state, action) => adapter.upsertMany(action.myFlightExtraSvcPages, state)
  ),
  on(MyFlightExtraSvcPageActions.updateMyFlightExtraSvcPage,
    (state, action) => adapter.updateOne(action.myFlightExtraSvcPage, state)
  ),
  on(MyFlightExtraSvcPageActions.updateMyFlightExtraSvcPages,
    (state, action) => adapter.updateMany(action.myFlightExtraSvcPages, state)
  ),
  on(MyFlightExtraSvcPageActions.deleteMyFlightExtraSvcPage,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(MyFlightExtraSvcPageActions.deleteMyFlightExtraSvcPages,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(MyFlightExtraSvcPageActions.loadMyFlightExtraSvcPages,
    (state, action) => adapter.addAll(action.myFlightExtraSvcPages, state)
  ),
  on(MyFlightExtraSvcPageActions.clearMyFlightExtraSvcPages,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return myFlightExtraSvcPageReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
