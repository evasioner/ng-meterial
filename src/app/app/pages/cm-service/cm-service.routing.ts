import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CmServiceComponent } from './cm-service.component';

const routes: Routes = [
    {
        path: '',
        component: CmServiceComponent
    }
];

@NgModule({

    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CmServiceRoutes { }
