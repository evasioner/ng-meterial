import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';

import { MyFlightExtraSvcPageRoutingModule } from './my-flight-extra-svc-page-routing.module';
import { MyFlightExtraSvcPageComponent } from './my-flight-extra-svc-page.component';
import { MyModalFlightBagDropComponent } from './modal-components/my-modal-flight-bag-drop/my-modal-flight-bag-drop.component';
import { MyModalFlightMealComponent } from './modal-components/my-modal-flight-meal/my-modal-flight-meal.component';
import { MyModalSeatmapComponent } from './modal-components/my-modal-seatmap/my-modal-seatmap.component';
import { MyModalSeatmapResultComponent } from './modal-components/my-modal-seatmap-result/my-modal-seatmap-result.component';



@NgModule({
  declarations: [
    MyFlightExtraSvcPageComponent,
    MyModalFlightBagDropComponent,
    MyModalFlightMealComponent,
    MyModalSeatmapComponent,
    MyModalSeatmapResultComponent
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    MyFlightExtraSvcPageRoutingModule
  ]
})
export class MyFlightExtraSvcPageModule { }
