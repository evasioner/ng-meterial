import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyAgreementListPageComponent } from './my-agreement-list-page.component'

const routes: Routes = [
    {
        path: '',
        component: MyAgreementListPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyAgreementListPageRoutingModule { }