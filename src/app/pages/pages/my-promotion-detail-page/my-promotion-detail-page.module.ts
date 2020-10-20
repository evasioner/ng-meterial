import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonSourceModule } from '@/app/common-source/common-source.module';
import { MyPromotionDetailPageComponent } from './my-promotion-detail-page.component';
import { MyPromotionDetailPageRoutingModule } from './my-promotion-detail-page-routing.module';


@NgModule({
    imports: [
        CommonModule,
        CommonSourceModule,
        MyPromotionDetailPageRoutingModule

    ],
    declarations: [MyPromotionDetailPageComponent]
})
export class MyPromotionDetailPageModule { }
