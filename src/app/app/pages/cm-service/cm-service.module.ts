import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmServiceComponent } from './cm-service.component';

// @ts-ignore

import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { CmServiceRoutes } from './cm-service.routing';


@NgModule({
    declarations: [
        CmServiceComponent
    ],
    imports: [
        CommonModule,
        CommonSourceModule,
        CmServiceRoutes
    ]
})
export class CmServiceModule { }
