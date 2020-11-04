import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyReservationQnaListPageRoutingModule } from './my-reservation-qna-list-page-routing.module';
import { MyReservationQnaListPageComponent } from './my-reservation-qna-list-page.component';
import { MyModalReservationQnaViewComponent } from './modal-components/my-modal-reservation-qna-view/my-modal-reservation-qna-view.component';
import { MyModalReservationQnaWriteComponent } from './modal-components/my-modal-reservation-qna-write/my-modal-reservation-qna-write.component';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';


@NgModule({
  declarations: [
    MyReservationQnaListPageComponent,
    MyModalReservationQnaViewComponent,
    MyModalReservationQnaWriteComponent
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    MyReservationQnaListPageRoutingModule
  ]
})
export class MyReservationQnaListPageModule { }
