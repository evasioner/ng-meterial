import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-my-modal-flight-bag-drop',
    templateUrl: './my-modal-flight-bag-drop.component.html',
    styleUrls: ['./my-modal-flight-bag-drop.component.scss']
})
export class MyModalFlightBagDropComponent extends BaseChildComponent implements OnInit {
    slides: any;
    slideConfig: any;
    addBagDrog1: any;
    bookerName: any;
    bagDrop: any;
    vm: any = {
        id: 'page',
        bookerList: [{
            name: '홍길동',
            bagDrop: '20kg',
            meal: '기내식1, 생수1',
            seatMap: 'A02D14'
        }, {
            name: '김길동',
            bagDrop: '25kg',
            meal: '기내식1, 생수1',
            seatMap: 'A02D14'
        }, {
            name: '고길동',
            bagDrop: '20kg',
            meal: '기내식1, 생수1',
            seatMap: 'A02D14'
        }, {
            name: '박길동',
            bagDrop: '30kg',
            meal: '기내식1, 생수1',
            seatMap: 'A02D14'
        }]
    };
    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public translateService: TranslateService,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        this.pageInit();
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick() {
        this.modalClose();
    }

    pageInit() {
        this.slides = this.vm.bookerList;

        this.slideConfig = {
            'slidesToShow': 1,
            'slidesToScroll': 1,
            'nextArrow': '<div class="nav-btn next-slide"></div>',
            'prevArrow': '<div class="nav-btn prev-slide"></div>',
            'dots': true,
            'infinite': true
        };
    }

    // 이벤트가 필요한경우 사용
    addSlide() {
        // this.slides.push({img: "/assets/images/temp/@temp-event-banner3.png"});
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
        console.log('afterChange');
        console.log('e>>>', e);
        // tslint:disable-next-line: no-unused-expression
        e.currentSlide;
    }

    beforeChange(e) {
        // console.log('beforeChange');
    }

}