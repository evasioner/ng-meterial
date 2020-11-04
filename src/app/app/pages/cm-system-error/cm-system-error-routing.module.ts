import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CmSystemErrorComponent } from './cm-system-error.component';

const routes: Routes = [
    {
        path: '',
        component: CmSystemErrorComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CmSystemErrorRoutingModule { }
