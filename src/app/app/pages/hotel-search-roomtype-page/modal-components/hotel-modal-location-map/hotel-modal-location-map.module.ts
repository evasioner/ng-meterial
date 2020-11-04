import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { environment } from '@/environments/environment';

import { HotelModalLocationMapComponent } from './hotel-modal-location-map.component';

@NgModule({
    declarations: [HotelModalLocationMapComponent],
    exports: [HotelModalLocationMapComponent],
    imports: [
        CommonModule,
        AgmCoreModule.forRoot({
            apiKey: environment.GOOGLE_MAP.API_KEY
        }),
    ]
})
export class HotelModalLocationMapModule { }
