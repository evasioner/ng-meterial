import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActivityBookingInformationPage } from './activity-booking-information-page.model';
import * as ActivityBookingInformationPageActions from './activity-booking-information-page.actions';

export const activityBookingInformationPagesFeatureKey = 'activityBookingInformationPages';

export interface State extends EntityState<ActivityBookingInformationPage> {
  // additional entities state properties
}

export const adapter: EntityAdapter<ActivityBookingInformationPage> = createEntityAdapter<ActivityBookingInformationPage>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const activityBookingInformationPageReducer = createReducer(
  initialState,
  on(ActivityBookingInformationPageActions.addActivityBookingInformationPage,
    (state, action) => adapter.addOne(action.activityBookingInformationPage, state)
  ),
  on(ActivityBookingInformationPageActions.upsertActivityBookingInformationPage,
    (state, action) => adapter.upsertOne(action.activityBookingInformationPage, state)
  ),
  on(ActivityBookingInformationPageActions.addActivityBookingInformationPages,
    (state, action) => adapter.addMany(action.activityBookingInformationPages, state)
  ),
  on(ActivityBookingInformationPageActions.upsertActivityBookingInformationPages,
    (state, action) => adapter.upsertMany(action.activityBookingInformationPages, state)
  ),
  on(ActivityBookingInformationPageActions.updateActivityBookingInformationPage,
    (state, action) => adapter.updateOne(action.activityBookingInformationPage, state)
  ),
  on(ActivityBookingInformationPageActions.updateActivityBookingInformationPages,
    (state, action) => adapter.updateMany(action.activityBookingInformationPages, state)
  ),
  on(ActivityBookingInformationPageActions.deleteActivityBookingInformationPage,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(ActivityBookingInformationPageActions.deleteActivityBookingInformationPages,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(ActivityBookingInformationPageActions.loadActivityBookingInformationPages,
    (state, action) => adapter.addAll(action.activityBookingInformationPages, state)
  ),
  on(ActivityBookingInformationPageActions.clearActivityBookingInformationPages,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return activityBookingInformationPageReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
