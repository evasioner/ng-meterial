import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { pageRoutes } from './page-routes';

import { PageLayoutComponent } from '../layouts/page-layout/page-layout.component';
import { IndexPageComponent } from '../pages/index-page/index-page.component';

/**
 * 레이아웃 라우트
 * PageLayoutComponent 개발 페이지 레이아웃
 */
const layoutRoutes: Routes = [
    // {
    //   path: '',
    //   redirectTo: '/page-guide',
    //   pathMatch: 'full'
    // },
    {
        path: '',
        component: PageLayoutComponent,
        children: pageRoutes
    },
    {
        path: 'main-list',
        component: IndexPageComponent
    },
    // {
    //   path: '**',
    //   component: NotFoundPageComponent,
    //   data: { title: 'Not found' },
    // },

];

@NgModule({
    imports: [
        RouterModule.forRoot(
            layoutRoutes,
            {
                initialNavigation: 'enabled',
                scrollPositionRestoration: 'top'
            }
        )
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
