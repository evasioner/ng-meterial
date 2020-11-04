import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { AirtelModalDestination } from './airtel-modal-destination.model';

export const loadAirtelModalDestinations = createAction(
    '[AirtelModalDestination/API] Load AirtelModalDestinations',
    props<{ airtelModalDestinations: AirtelModalDestination[] }>()
);

export const addAirtelModalDestination = createAction(
    '[AirtelModalDestination/API] Add AirtelModalDestination',
    props<{ airtelModalDestination: AirtelModalDestination }>()
);

export const upsertAirtelModalDestination = createAction(
    '[AirtelModalDestination/API] Upsert AirtelModalDestination',
    props<{ airtelModalDestination: AirtelModalDestination }>()
);

export const addAirtelModalDestinations = createAction(
    '[AirtelModalDestination/API] Add AirtelModalDestinations',
    props<{ airtelModalDestinations: AirtelModalDestination[] }>()
);

export const upsertAirtelModalDestinations = createAction(
    '[AirtelModalDestination/API] Upsert AirtelModalDestinations',
    props<{ airtelModalDestinations: AirtelModalDestination[] }>()
);

export const updateAirtelModalDestination = createAction(
    '[AirtelModalDestination/API] Update AirtelModalDestination',
    props<{ airtelModalDestination: Update<AirtelModalDestination> }>()
);

export const updateAirtelModalDestinations = createAction(
    '[AirtelModalDestination/API] Update AirtelModalDestinations',
    props<{ airtelModalDestinations: Update<AirtelModalDestination>[] }>()
);

export const deleteAirtelModalDestination = createAction(
    '[AirtelModalDestination/API] Delete AirtelModalDestination',
    props<{ id: string }>()
);

export const deleteAirtelModalDestinations = createAction(
    '[AirtelModalDestination/API] Delete AirtelModalDestinations',
    props<{ ids: string[] }>()
);

export const clearAirtelModalDestinations = createAction(
    '[AirtelModalDestination/API] Clear AirtelModalDestinations'
);
