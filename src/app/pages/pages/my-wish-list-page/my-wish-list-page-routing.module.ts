import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyWishListPageComponent } from './my-wish-list-page.component';


const routes: Routes = [
    {
        path: '',
        component: MyWishListPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyWishListPageRoutingModule { }
