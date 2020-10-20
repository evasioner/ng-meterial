import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivitySearchResultPageComponent } from './activity-search-result-page.component';

const routes: Routes = [
    {
        path: '',
        component: ActivitySearchResultPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivitySearchResultPageRouting { }
