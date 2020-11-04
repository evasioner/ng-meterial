import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonSourceModule } from '@/app/common-source/common-source.module';
import { AirtelTravelerInformationPageRoutingModule } from './airtel-traveler-information-page-routing.module';

import { AirtelTravelerInformationPageComponent } from './airtel-traveler-information-page.component';

@NgModule({
    declarations: [AirtelTravelerInformationPageComponent],
    imports: [
        CommonModule,
        AirtelTravelerInformationPageRoutingModule,
        CommonSourceModule
    ]
})
export class AirtelTravelerInformationPageModule { }
