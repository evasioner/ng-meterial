import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyPromotionListComponent } from './my-promotion-list.component';
import { MyPromotionListPageRoutingModule } from './my-promotion-list-page-routing.module';
import { CommonSourceModule } from '@/app/common-source/common-source.module';

@NgModule({
    imports: [
        CommonModule,
        CommonSourceModule,
        MyPromotionListPageRoutingModule
    ],
    declarations: [MyPromotionListComponent]
})
export class MyPromotionListModule { }
