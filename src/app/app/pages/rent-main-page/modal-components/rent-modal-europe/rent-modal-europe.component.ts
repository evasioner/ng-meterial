import { Component, ElementRef, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-rent-modal-europe',
    templateUrl: './rent-modal-europe.component.html',
    styleUrls: ['./rent-modal-europe.component.scss']
})
export class RentModalEuropeComponent extends BaseChildComponent implements OnInit {

    element: any;

    vm: any = {
        selectObj: {
            selectVal: 'a4',
            optList: [
                { val: 'a1', name: '참고사항' },
                { val: 'a2', name: '미주 TIP' },
                { val: 'a3', name: '캐나다 TIP' },
                { val: 'a4', name: '유럽 TIP' }
            ]

        }
    };

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public translateService: TranslateService,
        public bsModalRef: BsModalRef,
        private el: ElementRef,
    ) {
        super(platformId);
        this.element = this.el.nativeElement;
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
    }


    public modalClose(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    isHtmlHide($str) {
        const tgVal = this.vm.selectObj.selectVal;
        if (tgVal !== $str) {
            return true;
        } else {
            return false;
        }
    }

    onCloseClick() {
        console.info('모달 닫기');
        this.modalClose();
    }

}