import { Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';


@Component({
    selector: 'app-rent-img-view',
    templateUrl: './rent-img-view.component.html',
    styleUrls: ['./rent-img-view.component.scss']
})
export class RentImgViewComponent extends BaseChildComponent implements OnInit {
    @Input() urlList: any;
    styleUrl: any;


    // slides = [
    //   {img: "http://placehold.it/350x150/000000"},
    //   {img: "http://placehold.it/350x150/111111"},
    //   {img: "http://placehold.it/350x150/333333"},
    //   {img: "http://placehold.it/350x150/666666"}
    // ];

    slideConfig = { 'slidesToShow': 1, 'slidesToScroll': 1 };

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private el: ElementRef
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.styleUrl = {
            'background': `url(${this.urlList[0]}) 50% 50%`,
            'background-size': 'cover',
            'background-repeat': 'no-repeat'
        };

    }

    addSlide() {
        // this.urlList.push({img: "http://placehold.it/350x150/777777"})
    }

    removeSlide() {
        // this.urlList.length = this.urlList.length - 1;
    }

    slickInit() {
        // console.log('slick initialized', e);
    }

    breakpoint() {
        // console.log('breakpoint', e);
    }

    afterChange() {
        // console.log('afterChange', e);
    }

    beforeChange() {
        // console.log('beforeChange', e);
    }
    onImgClick() {
        // console.info('[이미지 클릭]', $item);
    }
}
