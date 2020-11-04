import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-common-modal-loading',
    templateUrl: './common-modal-loading.component.html',
    styleUrls: ['./common-modal-loading.component.scss']
})
export class CommonModalLoadingComponent extends BaseChildComponent implements OnInit, OnDestroy {

    constructor(
        @Inject(PLATFORM_ID) platformId: object
    ) {
        super(platformId);
    }

    ngOnInit() {
        console.info('[ngOnInit | 가격 알림 설정]');
        if (this.isBrowser) {
            const bodyEl = document.getElementsByTagName('body')[0];
            bodyEl.classList.add('overflow-none');
        }
    }

    ngOnDestroy() {
        if (this.isBrowser) {
            const bodyEl = document.getElementsByTagName('body')[0];
            bodyEl.classList.remove('overflow-none');
        }
        // this.modalClose();
    }

}
