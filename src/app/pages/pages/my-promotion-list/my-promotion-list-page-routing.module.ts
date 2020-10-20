import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyPromotionListComponent } from './my-promotion-list.component';

const routes: Routes = [
    {
        path: '',
        component: MyPromotionListComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class MyPromotionListPageRoutingModule { }