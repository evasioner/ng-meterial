import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';
import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';


@Component({
    selector: 'app-activity-hotactivity-list',
    templateUrl: './activity-hotactivity-list.component.html',
    styleUrls: ['./activity-hotactivity-list.component.scss']
})
export class ActivityHotactivityListComponent extends BaseChildComponent implements OnInit, OnDestroy {
    hotactivityList: any;
    tagIndex: number;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public translateService: TranslateService,
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();

        // TODO - api를 통해 해당 리스트를 호출해야 한다. 상위 태그에 따라 목록이 달라진다.
        this.tagIndex = 1;
        this.hotactivityList = [
            {
                'activityCode': '1',
                'photoUrl': '/assets/images/temp/@temp-hotplace.png',
                'activityCategory': '투어',
                'activityTitle': '마카오 하우스 오브 댄싱 워터쇼 (QR코드 바로 가농)',
                'activityLocation': '미국, 샌프란시스코',
                'activityPrice': 41000
            },
            {
                'activityCode': '2',
                'photoUrl': '/assets/images/temp/@temp-hotplace.png',
                'activityCategory': '투어',
                'activityTitle': '마카오 하우스 오브 댄싱 워터쇼 (QR코드 바로 가농)',
                'activityLocation': '미국, 샌프란시스코',
                'activityPrice': 41000
            },
            {
                'activityCode': '3',
                'photoUrl': '/assets/images/temp/@temp-hotplace.png',
                'activityCategory': '투어',
                'activityTitle': '마카오 하우스 오브 댄싱 워터쇼 (QR코드 바로 가농)',
                'activityLocation': '미국, 샌프란시스코',
                'activityPrice': 41000
            }
        ];
    }

    ngOnDestroy() {
        if (this.isBrowser) {
            /*
            this.pickupSubscription.unsubscribe();
            this.returnSubscription.unsubscribe();
            this.calendarSubscription.unsubscribe();
            */
        }
    }

    /**
     * 태그 클릭
     */
    onChangeTag(cIndex: number) {
        console.log('onChangeTag cIndex : ', cIndex);
        this.tagIndex = cIndex;
    }

    /**
     * 액티비티 클릭 - 상세페이지로 이동
     */
    onGoDetailPage(cIndex) {
        console.log('onGoDetailPage cIndex : ', this.hotactivityList[cIndex]);
        // this.router.navigate(["/activity-search-result-detail"]);
    }

}
