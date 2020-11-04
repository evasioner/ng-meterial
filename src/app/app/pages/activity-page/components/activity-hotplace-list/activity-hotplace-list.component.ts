import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@/environments/environment';
import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';
import { ActivityEnums } from '../../enums/activity-enums.enum';
import * as _ from 'lodash';
import * as qs from 'qs';

@Component({
    selector: 'app-activity-hotplace-list',
    templateUrl: './activity-hotplace-list.component.html',
    styleUrls: ['./activity-hotplace-list.component.scss']
})
export class ActivityHotplaceListComponent extends BaseChildComponent implements OnInit {
    placeList: any;
    searchCityCode = null;
    searchCityName = null;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public translateService: TranslateService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();

        // parameter Init
        // TODO - api를 통해 해당 리스트를 호출해야 한다.
        this.placeList = [
            { cityCode: 'AUSYD', cityName: '시드니', photoUrl: '/assets/images/temp/@temp-hotplace.png' },
            { cityCode: 'ESBCN', cityName: '바르셀로나', photoUrl: '/assets/images/temp/@temp-hotplace.png' },
            { cityCode: 'MYKUL', cityName: '쿠알라룸푸르', photoUrl: '/assets/images/temp/@temp-hotplace.png' }
        ];
    }

    onGoNextPage() {
        const activityMainInfo = {
            rq: {
                stationTypeCode: environment.STATION_CODE,
                currency: 'KRW',  // TODO - user setting
                language: 'KO', // TODO - user setting
                condition: {
                    cityCode: this.searchCityCode,
                    limits: [0, 10]
                }
            },
            searchCityName: this.searchCityName, // display용
            searchCategoryName: null
        };

        // const base64Str = this.base64Svc.base64EncodingFun(activityMainInfo);
        // const path = "/activity-city-intro/" + base64Str;
        const qsStr = qs.stringify(activityMainInfo);
        const path = ActivityEnums.PAGE_CITY_INTRO + qsStr;
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }

    /**
     * 검색 카테고리 클릭
     */
    onGoCityIntroClick(cIndex) {
        // console.log("onGoCityIntroClick cIndex : ", this.placeList[cIndex]);
        this.searchCityCode = this.placeList[cIndex].cityCode;
        this.searchCityName = this.placeList[cIndex].cityName;
        this.onGoNextPage();
    }

}
