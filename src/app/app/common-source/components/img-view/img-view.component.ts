import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewChild, EventEmitter, DoCheck, Output } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

import { TranslateService } from '@ngx-translate/core';

//Component
import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';
import { CommonModalPhotoListComponent } from '../../modal-components/common-modal-photo-list/common-modal-photo-list.component';


@Component({
    selector: 'app-img-view',
    templateUrl: './img-view.component.html',
    styleUrls: ['./img-view.component.scss']
})
export class ImgViewComponent extends BaseChildComponent implements OnInit, DoCheck {
    /**
     * http://kenwheeler.github.io/slick/
     * 위 라이브러리가 메인으로 사용됨.
     *
     * https://github.com/leo6104/ngx-slick-carousel#readme
     * 해당 라이브러리 앵귤러용으로 재사용
     */
    @ViewChild('slickModal') slickModal: SlickCarouselComponent;
    @Input() public urlList: Array<any>;
    @Input() public category: any; // hotel | activity
    @Input() public modalPhotoDetail: Boolean = false;

    currentSlide: number;
    slideCount: number;

    /**
     * 사진 롤
     * slick 옵션
     * modalPhotoDetail = false
     */
    rollingConfig = {
        'infinite': true,
        'slidesToShow': 1,
        'slidesToScroll': 1,
        'method': {}
    };

    /**
     * 사진 상세 모달창
     * slick 옵션
     * modalPhotoDetail = true
     */
    detailConfig = {
        'infinite': true,
        'slidesToShow': 1,
        'slidesToScroll': 1,
        'nextArrow': '<a (click)="slickModal.slickNext()" class="btn-next">다음</a>',
        'prevArrow': '<a (click)="slickModal.slickPrev()" class="btn-prev">이전</a>'
    };

    bsModalRef: BsModalRef;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private bsModalService: BsModalService,
        public translateService: TranslateService
    ) {
        super(platformId);

        this.initialize();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngDoCheck() {
        !this.urlList || this.setPhotos();
    }


    //---------------------------------------[양방향 바인딩]
    /**
     * 사진 상세 모달창 양방향 바인딩 사용
     * modalPhotoDetail = true
     */
    @Input()
    get currentValue() {
        return this.currentSlide;
    }
    set currentValue(val) {
        this.currentSlide = val;
        this.currentValueChange.emit(this.currentSlide);
    }
    @Output() currentValueChange = new EventEmitter();
    //---------------------------------------[end 양방향 바인딩]

    /**
     * initialize
     * 초기화
     */
    private initialize(): void {
        this.slideCount = this.currentSlide = 0;
    }

    /**
     * setPhotos
     * 이미지 전송 완료 후 총 슬라이더 갯수 표시
     */
    private setPhotos(): void {
        this.slideCount = (this.urlList.length || 0);
    }

    /**
     * afterChange
     * 슬라이더 슬라이딩 후 실행
     *
     * @param evnet dom 이벤트
     */
    public afterChange(event: any): void {
        this.currentSlide = event.slick.currentSlide;
        this.currentValue = this.currentSlide;
    }


    /**
     * slick 초기화
     * @param e dom 이벤트
     */
    slickInit(e) {
        console.log(this.currentSlide, 'slick initialized', e);
        e.slick.slickGoTo(this.currentSlide);
        this.currentSlide = e.slick.currentSlide;
    }

    /**
     * onImgClick
     * 이미지 선택 시 이벤트
     *
     * @param event dom 이벤트
     */
    public onImgClick(event: any): void {
        event && event.preventDefault();

        this.imgClick(this.urlList);

    }

    public onImgError(e) {
        const $img = e.target;
        $img.src = '/assets/images/icons/ico-nodata-image.png';
        $img.classList.add('no-image');
    }

    /**
     * 사진 리스트 modal open
     * @param $photos
     */
    imgClick($photos) {
        console.info('[이미지 클릭]', $photos);

        const initialState = {
            category: this.category,
            photos: $photos
        };

        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        console.info('[initialState]', initialState);

        this.bsModalRef = this.bsModalService.show(CommonModalPhotoListComponent, { initialState, ...configInfo });
    }
}
