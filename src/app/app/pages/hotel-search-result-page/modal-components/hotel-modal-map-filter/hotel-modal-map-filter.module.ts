import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgmCoreModule } from '@agm/core';
import { AgmOverlays } from 'agm-overlays';

import { CommonSourceModule } from 'src/app/common-source/common-source.module';


import { environment } from '@/environments/environment';
import { RouterModule } from '@angular/router';
import { HotelModalMapFilterComponent } from './hotel-modal-map-filter.component';

@NgModule({
    declarations: [HotelModalMapFilterComponent],
    exports: [HotelModalMapFilterComponent],
    imports: [
        RouterModule,
        CommonModule,
        CommonSourceModule,

        FormsModule,
        ReactiveFormsModule,
        AgmOverlays,
        AgmCoreModule.forRoot({
            apiKey: environment.GOOGLE_MAP.API_KEY,
            language: 'ko',
            region: 'KR'
        })
    ]
})
export class HotelModalMapFilterModule { }
