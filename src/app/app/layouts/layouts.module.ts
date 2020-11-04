import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PageLayoutComponent } from './page-layout/page-layout.component';
import { SystemErrorBaseComponent } from '../layouts/page-layout/modal-components/system-error-base/system-error-base.component';
import { ModalMypageMainComponent } from '../layouts/page-layout/modal-components/modal-mypage-main/modal-mypage-main.component';


@NgModule({
    declarations: [
        PageLayoutComponent,
        SystemErrorBaseComponent,
        ModalMypageMainComponent
    ],
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class LayoutsModule {
}
