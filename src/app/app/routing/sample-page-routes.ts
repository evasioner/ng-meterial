import { Routes } from '@angular/router';
import { SamplePageComponent } from '../pages/sample-page/sample-page.component';
import { NgxDeviceDetectorComponent } from '../pages/sample-page/components/ngx-device-detector/ngx-device-detector.component';
import { NgxMomentComponent } from '../pages/sample-page/components/ngx-moment/ngx-moment.component';
import { NgxPipesComponent } from '../pages/sample-page/components/ngx-pipes/ngx-pipes.component';
import { AgmComponent } from '../pages/sample-page/components/agm/agm.component';
import { ParamBase64Component } from '../pages/sample-page/components/param-base64/param-base64.component';
import { CookieServiceComponent } from '../pages/sample-page/components/cookie-service/cookie-service.component';
import { LoginTestComponent } from '../pages/sample-page/components/login-test/login-test.component';
import { LoginAfterComponent } from '../pages/sample-page/components/login-after/login-after.component';
import { LogoutAfterComponent } from '../pages/sample-page/components/logout-after/logout-after.component';
import { NgxBootstrapSliderComponent } from "../pages/sample-page/components/ngx-bootstrap-slider/ngx-bootstrap-slider.component";
import { QueryStringComponent } from "../pages/sample-page/components/query-string/query-string/query-string.component";

/**
 * 페이지 라우트
 */
export const samplePageRoutes: Routes = [
    {
        path: 'guide',
        component: SamplePageComponent,
        children: [
            {
                path: 'ngx-device-detector',
                component: NgxDeviceDetectorComponent
            },
            {
                path: 'ngx-moment',
                component: NgxMomentComponent
            },
            {
                path: 'ngx-pipes',
                component: NgxPipesComponent
            },
            {
                path: 'agm',
                component: AgmComponent
            },
            {
                path: 'param-base64',
                component: ParamBase64Component
            },
            {
                path: 'cookie-service',
                component: CookieServiceComponent
            },
            {
                path: 'login-test',
                component: LoginTestComponent
            },
            {
                path: 'login-after',
                component: LoginAfterComponent
            },
            {
                path: 'logout-after',
                component: LogoutAfterComponent
            },
            {
                path: 'ngx-bootstrap-slider',
                component: NgxBootstrapSliderComponent
            },
            {
                path: 'query-string',
                component: QueryStringComponent
            }
        ]
    }

];
