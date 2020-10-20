import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivitySearchResultDetailPageComponent } from './activity-search-result-detail-page.component';

const routes: Routes = [
    {
        path: '',
        component: ActivitySearchResultDetailPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivitySearchResultDetailPageRouting { }
