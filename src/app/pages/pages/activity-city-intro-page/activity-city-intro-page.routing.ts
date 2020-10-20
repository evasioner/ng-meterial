import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityCityIntroPageComponent } from './activity-city-intro-page.component';

const routes: Routes = [
    {
        path: '',
        component: ActivityCityIntroPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivityCityIntroPageRouting { }
