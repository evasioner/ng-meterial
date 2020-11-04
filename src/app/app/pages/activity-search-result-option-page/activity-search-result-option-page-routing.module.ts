import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivitySearchResultOptionPageComponent } from './activity-search-result-option-page.component';

const routes: Routes = [
    {
        path: '',
        component: ActivitySearchResultOptionPageComponent
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivitySearchResultOptionPageRoutingModule { }
