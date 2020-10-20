import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonSourceModule } from '@/app/common-source/common-source.module';
import { ConvenienceMainPageRoutingModule } from './convenience-main-page-routing.module';

import { ConvenienceMainPageComponent } from './convenience-main-page.component';


@NgModule({
    declarations: [
        ConvenienceMainPageComponent
    ],
    imports: [
        CommonModule,
        ConvenienceMainPageRoutingModule,

        CommonSourceModule
    ]
})
export class ConvenienceMainPageModule { }
