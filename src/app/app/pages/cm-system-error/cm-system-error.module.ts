import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmSystemErrorRoutingModule } from './cm-system-error-routing.module';
import { CmSystemErrorComponent } from './cm-system-error.component';
import { CommonSourceModule } from '@/app/common-source/common-source.module';

@NgModule({
    declarations: [
        CmSystemErrorComponent
    ],
    imports: [
        CommonModule,
        CommonSourceModule,
        CmSystemErrorRoutingModule
    ]
})
export class CmSystemErrorModule { }
