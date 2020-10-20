import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonSourceModule } from '@/app/common-source/common-source.module';
import { AirtelMainPageRoutingModule } from './airtel-main-page-routing.module';

import { AirtelMainPageComponent } from './airtel-main-page.component';



@NgModule({
    declarations: [
        AirtelMainPageComponent
    ],
    imports: [
        CommonModule,
        AirtelMainPageRoutingModule,

        CommonSourceModule
    ]
})
export class AirtelMainPageModule { }
