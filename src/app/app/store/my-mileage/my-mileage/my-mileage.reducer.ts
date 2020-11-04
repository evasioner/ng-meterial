import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { MyMileage } from './my-mileage.model';
import * as MyMileageActions from './my-mileage.actions';

export const myMileagesFeatureKey = 'myMileages';

export interface State extends EntityState<MyMileage> {
  // additional entities state properties
}

export const adapter: EntityAdapter<MyMileage> = createEntityAdapter<MyMileage>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const myMileageReducer = createReducer(
  initialState,
  on(MyMileageActions.addMyMileage,
    (state, action) => adapter.addOne(action.myMileage, state)
  ),
  on(MyMileageActions.upsertMyMileage,
    (state, action) => adapter.upsertOne(action.myMileage, state)
  ),
  on(MyMileageActions.addMyMileages,
    (state, action) => adapter.addMany(action.myMileages, state)
  ),
  on(MyMileageActions.upsertMyMileages,
    (state, action) => adapter.upsertMany(action.myMileages, state)
  ),
  on(MyMileageActions.updateMyMileage,
    (state, action) => adapter.updateOne(action.myMileage, state)
  ),
  on(MyMileageActions.updateMyMileages,
    (state, action) => adapter.updateMany(action.myMileages, state)
  ),
  on(MyMileageActions.deleteMyMileage,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(MyMileageActions.deleteMyMileages,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(MyMileageActions.loadMyMileages,
    (state, action) => adapter.addAll(action.myMileages, state)
  ),
  on(MyMileageActions.clearMyMileages,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return myMileageReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
