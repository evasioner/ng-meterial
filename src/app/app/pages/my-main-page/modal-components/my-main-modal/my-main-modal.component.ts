import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT, Location } from '@angular/common';

@Component({
    selector: 'app-my-main-modal',
    templateUrl: './my-main-modal.component.html',
    styleUrls: ['./my-main-modal.component.scss']
})
export class MyMainModalComponent extends BaseChildComponent implements OnInit {

    element: any;
    $element: any;
    slides: Array<any>;
    slideConfig: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        @Inject(DOCUMENT) private document: Document,
        private store: Store<any>,
        public translateService: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private el: ElementRef,
    ) {
        super(platformId);
        this.element = this.el.nativeElement;

        this.slides = [
            { img: '/assets/images/temp/@temp-event-banner3.png' },
            { img: '/assets/images/temp/@temp-event-banner3.png' },
            { img: '/assets/images/temp/@temp-event-banner3.png' }
        ];
        this.slideConfig = {
            'slidesToShow': 1,
            'slidesToScroll': 1,
            'nextArrow': '<div class="nav-btn next-slide"></div>',
            'prevArrow': '<div class="nav-btn prev-slide"></div>',
            'dots': true,
            'infinite': true
        };
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
    }

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

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.location.back();
    }

    onCloseClick() {
        console.info('모달 닫기');
        this.modalClose();
    }
}
