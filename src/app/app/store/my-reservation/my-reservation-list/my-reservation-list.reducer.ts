import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { MyReservationList } from './my-reservation-list.model';
import * as MyReservationListActions from './my-reservation-list.actions';

export const myReservationListsFeatureKey = 'myReservationLists';

export interface State extends EntityState<MyReservationList> {
  // additional entities state properties
}

export const adapter: EntityAdapter<MyReservationList> = createEntityAdapter<MyReservationList>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const myReservationListReducer = createReducer(
  initialState,
  on(MyReservationListActions.addMyReservationList,
    (state, action) => adapter.addOne(action.myReservationList, state)
  ),
  on(MyReservationListActions.upsertMyReservationList,
    (state, action) => adapter.upsertOne(action.myReservationList, state)
  ),
  on(MyReservationListActions.addMyReservationLists,
    (state, action) => adapter.addMany(action.myReservationLists, state)
  ),
  on(MyReservationListActions.upsertMyReservationLists,
    (state, action) => adapter.upsertMany(action.myReservationLists, state)
  ),
  on(MyReservationListActions.updateMyReservationList,
    (state, action) => adapter.updateOne(action.myReservationList, state)
  ),
  on(MyReservationListActions.updateMyReservationLists,
    (state, action) => adapter.updateMany(action.myReservationLists, state)
  ),
  on(MyReservationListActions.deleteMyReservationList,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(MyReservationListActions.deleteMyReservationLists,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(MyReservationListActions.loadMyReservationLists,
    (state, action) => adapter.addAll(action.myReservationLists, state)
  ),
  on(MyReservationListActions.clearMyReservationLists,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return myReservationListReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
