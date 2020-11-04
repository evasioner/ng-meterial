import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { MyModalDestination } from './my-modal-destination.model';
import * as MyModalDestinationActions from './my-modal-destination.actions';

export const myModalDestinationsFeatureKey = 'myModalDestinations';

export interface State extends EntityState<MyModalDestination> {
  // additional entities state properties
}

export const adapter: EntityAdapter<MyModalDestination> = createEntityAdapter<MyModalDestination>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const myModalDestinationReducer = createReducer(
  initialState,
  on(MyModalDestinationActions.addMyModalDestination,
    (state, action) => adapter.addOne(action.myModalDestination, state)
  ),
  on(MyModalDestinationActions.upsertMyModalDestination,
    (state, action) => adapter.upsertOne(action.myModalDestination, state)
  ),
  on(MyModalDestinationActions.addMyModalDestinations,
    (state, action) => adapter.addMany(action.myModalDestinations, state)
  ),
  on(MyModalDestinationActions.upsertMyModalDestinations,
    (state, action) => adapter.upsertMany(action.myModalDestinations, state)
  ),
  on(MyModalDestinationActions.updateMyModalDestination,
    (state, action) => adapter.updateOne(action.myModalDestination, state)
  ),
  on(MyModalDestinationActions.updateMyModalDestinations,
    (state, action) => adapter.updateMany(action.myModalDestinations, state)
  ),
  on(MyModalDestinationActions.deleteMyModalDestination,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(MyModalDestinationActions.deleteMyModalDestinations,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(MyModalDestinationActions.loadMyModalDestinations,
    (state, action) => adapter.addAll(action.myModalDestinations, state)
  ),
  on(MyModalDestinationActions.clearMyModalDestinations,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return myModalDestinationReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
