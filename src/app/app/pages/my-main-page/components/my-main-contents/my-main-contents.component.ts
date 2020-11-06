import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

declare var $;

@Component({
    selector: 'app-my-main-contents',
    templateUrl: './my-main-contents.component.html',
    styleUrls: ['./my-main-contents.component.scss']
})
export class MyMainContentsComponent extends BaseChildComponent implements OnInit {

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private store: Store<any>,
        public translateService: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        super(platformId);
    }

    ngOnInit(): void {
    }

    slides = [
        { img: '/assets/images/temp/@temp-event-banner3.png' },
        { img: '/assets/images/temp/@temp-event-banner3.png' },
        { img: '/assets/images/temp/@temp-event-banner3.png' },
    ];
    slideConfig = {
        'slidesToShow': 1,
        'slidesToScroll': 1,
        'nextArrow': '<div class="nav-btn next-slide"></div>',
        'prevArrow': '<div class="nav-btn prev-slide"></div>',
        'dots': true,
        'infinite': true
    };

    // 이벤트가 필요한경우 사용
    addSlide() {
        this.slides.push({ img: '/assets/images/temp/@temp-event-banner3.png' });
    }

    removeSlide() {
        this.slides.length = this.slides.length - 1;
    }

    slickInit(e) {
        // console.log('slick initialized');
    }

    breakpoint(e) {
        // console.log('breakpoint');
    }

    afterChange(e) {
        // console.log('afterChange');
    }

    beforeChange(e) {
        // console.log('beforeChange');
    }

    // mypage modal main page
    mypageMainModal() {
        console.info('[마이페이지 메인 >> 모달 버전]');
        const path = 'mypage-main-modal';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }

}
