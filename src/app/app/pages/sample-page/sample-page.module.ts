import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamplePageComponent } from './sample-page.component';
import { NgxDeviceDetectorComponent } from './components/ngx-device-detector/ngx-device-detector.component';
import { RouterModule } from '@angular/router';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { FormsModule } from '@angular/forms';
import { NgxMomentComponent } from './components/ngx-moment/ngx-moment.component';
import { NgxPipesComponent } from './components/ngx-pipes/ngx-pipes.component';
import { MomentModule } from 'ngx-moment';
import { NgPipesModule } from 'ngx-pipes';
import { AgmComponent } from './components/agm/agm.component';
import { AgmCoreModule } from '@agm/core';

import { environment } from '@/environments/environment';
import { ParamBase64Component } from './components/param-base64/param-base64.component';
import { CookieServiceComponent } from './components/cookie-service/cookie-service.component';
import { LoginTestComponent } from './components/login-test/login-test.component';
import { LoginAfterComponent } from './components/login-after/login-after.component';
import { LogoutAfterComponent } from './components/logout-after/logout-after.component';
import { NgxBootstrapSliderComponent } from './components/ngx-bootstrap-slider/ngx-bootstrap-slider.component';
import { CommonSourceModule } from '../../common-source/common-source.module';
import { TestSliderComponent } from './components/ngx-bootstrap-slider/test-slider/test-slider.component';
import { QueryStringComponent } from './components/query-string/query-string/query-string.component';
//AIzaSyAT5oV2Y65IXIVtTRJ_jvPpCj6RoU8gQBQ // 김보현 주임
//AIzaSyAd1RjuaFhKI4q6muL3AkyBw5CMNflQikg // 강하림 대리

@NgModule({
    declarations: [
        SamplePageComponent,
        NgxDeviceDetectorComponent,
        NgxMomentComponent,
        NgxPipesComponent,
        AgmComponent,
        ParamBase64Component,
        CookieServiceComponent,
        LoginTestComponent,
        LoginAfterComponent,
        LogoutAfterComponent,
        NgxBootstrapSliderComponent,
        TestSliderComponent,
        QueryStringComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        DeviceDetectorModule.forRoot(),
        MomentModule,
        NgPipesModule,
        AgmCoreModule.forRoot({
            apiKey: environment.GOOGLE_MAP.API_KEY,
            language: 'ko',
            region: 'KR'
        }),
        CommonSourceModule

    ],
    providers: [

    ]
})
export class SamplePageModule {
}

