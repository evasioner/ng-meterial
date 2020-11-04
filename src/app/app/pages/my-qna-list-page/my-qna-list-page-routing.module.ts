import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyQnaListPageComponent } from './my-qna-list-page.component';
import { ReservationQnaComponent } from './components/reservation-qna/reservation-qna.component';
import { ProductQnaComponent } from './components/product-qna/product-qna.component';
import { MyModalQnaViewComponent } from './modal-components/my-modal-qna-view/my-modal-qna-view.component';
import { MyModalQnaWriteComponent } from './modal-components/my-modal-qna-write/my-modal-qna-write.component';


const routes: Routes = [
  {
    path: '',
    component: MyQnaListPageComponent,
    children: [
      // 마이페이지 고객문의 예약문의
      {
          path: 'reservation-qna',
          component: ReservationQnaComponent,
      },
      // 마이페이지 고객문의 상품문의
      {
          path: 'product-qna',
          component: ProductQnaComponent,
      },
      // 마이페이지 고객문의 상세페이지
      {
          path: 'modal-qna-view/:id',
          component: MyModalQnaViewComponent,
      },
      // 마이페이지 고객문의 작성페이지
      {
          path: 'modal-qna-write',
          component: MyModalQnaWriteComponent,
      },
  
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyQnaListPageRoutingModule { }
