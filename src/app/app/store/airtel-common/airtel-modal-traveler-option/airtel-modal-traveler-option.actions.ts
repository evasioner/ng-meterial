import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { AirtelModalTravelerOption } from './airtel-modal-traveler-option.model';

export const loadAirtelModalTravelerOptions = createAction(
  '[AirtelModalTravelerOption/API] Load AirtelModalTravelerOptions', 
  props<{ airtelModalTravelerOptions: AirtelModalTravelerOption[] }>()
);

export const addAirtelModalTravelerOption = createAction(
  '[AirtelModalTravelerOption/API] Add AirtelModalTravelerOption',
  props<{ airtelModalTravelerOption: AirtelModalTravelerOption }>()
);

export const upsertAirtelModalTravelerOption = createAction(
  '[AirtelModalTravelerOption/API] Upsert AirtelModalTravelerOption',
  props<{ airtelModalTravelerOption: AirtelModalTravelerOption }>()
);

export const addAirtelModalTravelerOptions = createAction(
  '[AirtelModalTravelerOption/API] Add AirtelModalTravelerOptions',
  props<{ airtelModalTravelerOptions: AirtelModalTravelerOption[] }>()
);

export const upsertAirtelModalTravelerOptions = createAction(
  '[AirtelModalTravelerOption/API] Upsert AirtelModalTravelerOptions',
  props<{ airtelModalTravelerOptions: AirtelModalTravelerOption[] }>()
);

export const updateAirtelModalTravelerOption = createAction(
  '[AirtelModalTravelerOption/API] Update AirtelModalTravelerOption',
  props<{ airtelModalTravelerOption: Update<AirtelModalTravelerOption> }>()
);

export const updateAirtelModalTravelerOptions = createAction(
  '[AirtelModalTravelerOption/API] Update AirtelModalTravelerOptions',
  props<{ airtelModalTravelerOptions: Update<AirtelModalTravelerOption>[] }>()
);

export const deleteAirtelModalTravelerOption = createAction(
  '[AirtelModalTravelerOption/API] Delete AirtelModalTravelerOption',
  props<{ id: string }>()
);

export const deleteAirtelModalTravelerOptions = createAction(
  '[AirtelModalTravelerOption/API] Delete AirtelModalTravelerOptions',
  props<{ ids: string[] }>()
);

export const clearAirtelModalTravelerOptions = createAction(
  '[AirtelModalTravelerOption/API] Clear AirtelModalTravelerOptions'
);
