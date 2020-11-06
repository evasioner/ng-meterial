import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { BaseChildComponent } from '../base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-cm-system-error',
    templateUrl: './cm-system-error.component.html',
    styleUrls: ['./cm-system-error.component.scss']
})
export class CmSystemErrorComponent extends BaseChildComponent implements OnInit, OnDestroy {

    constructor(
        @Inject(PLATFORM_ID) public platformId: any
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        if (this.isBrowser) {
            const bodyEl = document.getElementsByTagName('body')[0];
            bodyEl.classList.add('overflow-none');
        }
    }

    ngOnDestroy(): void {
        if (this.isBrowser) {
            const bodyEl = document.getElementsByTagName('body')[0];
            bodyEl.classList.remove('overflow-none');
        }
    }

}
