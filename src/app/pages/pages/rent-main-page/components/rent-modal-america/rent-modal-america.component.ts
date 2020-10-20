import { Component, ElementRef, Inject, OnInit, PLATFORM_ID } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-rent-modal-america',
    templateUrl: './rent-modal-america.component.html',
    styleUrls: ['./rent-modal-america.component.scss']
})
export class RentModalAmericaComponent extends BaseChildComponent implements OnInit {

    element: any;
    rxAlive: boolean = true;
    vm: any = {
        selectObj: {
            selectVal: 'a2',
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
        public bsModalRef: BsModalRef,
        private el: ElementRef,
        public translateService: TranslateService
    ) {
        super(platformId);
        this.element = this.el.nativeElement;
    }

    ngOnInit() {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

    }

    modalClose() {
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
        console.log('모달닫기');
        this.modalClose();
    }

}
