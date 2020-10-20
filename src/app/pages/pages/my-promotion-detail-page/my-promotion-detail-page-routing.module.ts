import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyPromotionDetailPageComponent } from './my-promotion-detail-page.component'

const routes: Routes = [
    {
        path: '',
        component: MyPromotionDetailPageComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class MyPromotionDetailPageRoutingModule { }