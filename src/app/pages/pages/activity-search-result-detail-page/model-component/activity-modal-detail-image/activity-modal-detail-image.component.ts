import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import * as activitySearchResultDetailSelectors from '@/app/store/activity-search-result-detail-page/activity-search-result-detail/activity-search-result-detail.selectors';


import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';

@Component({
    selector: 'app-activity-modal-detail-image',
    templateUrl: './activity-modal-detail-image.component.html',
    styleUrls: ['./activity-modal-detail-image.component.scss']
})
export class ActivityModalDetailImageComponent implements OnInit, OnDestroy {
    @ViewChild('slickModal') slickModal: SlickCarouselComponent;

    rxAlive: boolean = true;
    loadingBool: boolean = false;

    hotelInfo: any;
    photoList: any;
    slideCount: number;
    currentSlide: number;

    imagesSlider = {
        // "centerMode": true,
        // "centerPadding": "20px",
        focusOnSelect: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        draggable: true,
        asNavFor: '.slider-nav',
    };
    thumbnailsSlider = {
        // "centerMode": true,
        // "centerPadding": "20px",
        focusOnSelect: true,
        infinite: true,
        speed: 300,
        slidesToShow: 12,
        slidesToScroll: 1,
        draggable: true,
        asNavFor: '.slider-for'
    };
    private subscriptionList: Subscription[];

    constructor(
        private store: Store<any>,
    ) {
        this.subscriptionList = [];
        this.storeInit();
    }

    ngOnInit(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
    }

    ngOnDestroy(): void {
        console.info('[photoList] ngOnDestroy');
        this.rxAlive = false;
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }

    private storeInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(activitySearchResultDetailSelectors.getSelectId(ActivityStore.STORE_SEARCH_RESULT_RS)), // 스토어 ID
                    distinctUntilChanged(
                        (before: any, now: any) => _.isEqual(before, now)
                    )
                )
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            console.info('activity image : ', ev);
                        }
                    }
                )
        );
    }
}
