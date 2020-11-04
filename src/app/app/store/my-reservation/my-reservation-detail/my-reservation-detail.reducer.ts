import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { MyReservationDetail } from './my-reservation-detail.model';
import * as MyReservationDetailActions from './my-reservation-detail.actions';

export const myReservationDetailsFeatureKey = 'myReservationDetails';

export interface State extends EntityState<MyReservationDetail> {
  // additional entities state properties
}

export const adapter: EntityAdapter<MyReservationDetail> = createEntityAdapter<MyReservationDetail>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const myReservationDetailReducer = createReducer(
  initialState,
  on(MyReservationDetailActions.addMyReservationDetail,
    (state, action) => adapter.addOne(action.myReservationDetail, state)
  ),
  on(MyReservationDetailActions.upsertMyReservationDetail,
    (state, action) => adapter.upsertOne(action.myReservationDetail, state)
  ),
  on(MyReservationDetailActions.addMyReservationDetails,
    (state, action) => adapter.addMany(action.myReservationDetails, state)
  ),
  on(MyReservationDetailActions.upsertMyReservationDetails,
    (state, action) => adapter.upsertMany(action.myReservationDetails, state)
  ),
  on(MyReservationDetailActions.updateMyReservationDetail,
    (state, action) => adapter.updateOne(action.myReservationDetail, state)
  ),
  on(MyReservationDetailActions.updateMyReservationDetails,
    (state, action) => adapter.updateMany(action.myReservationDetails, state)
  ),
  on(MyReservationDetailActions.deleteMyReservationDetail,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(MyReservationDetailActions.deleteMyReservationDetails,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(MyReservationDetailActions.loadMyReservationDetails,
    (state, action) => adapter.addAll(action.myReservationDetails, state)
  ),
  on(MyReservationDetailActions.clearMyReservationDetails,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return myReservationDetailReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
