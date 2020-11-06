import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommonPaymentCompletePageComponent } from './common-payment-complete-page.component';

const routes: Routes = [
    {
        path: '',
        component: CommonPaymentCompletePageComponent
    },
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class CommonPaymentCompletePageRouting { }
