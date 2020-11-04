import { Component, OnInit, Inject, PLATFORM_ID, Input, OnDestroy } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-airtel-modal-step-page',
    templateUrl: './airtel-modal-step-page.component.html',
    styleUrls: ['./airtel-modal-step-page.component.scss']
})
export class AirtelModalStepPageComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Input() path: any;
    @Input() step: string;
    @Input() parent: any;

    isClose: any;
    timer: any;
    ctx: any = this;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private router: Router,
        private route: ActivatedRoute,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();
        console.info('[ngOnInit | 묶음할인 모달 스텝]');

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        console.log('타이머시작');
        this.timer = setTimeout(() => {
            console.log('페이지이동');

            this.modalClose();
            console.log('자식모달 닫기');

            if (this.parent) {
                console.log('부모모달 닫기');
                this.parent.modalClose();
            }

        }, 3000);


    }

    ngOnDestroy() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }



    modalClose() {
        this.router.navigate([this.path], { relativeTo: this.route });

        this.isClose = true;
        this.bsModalRef.hide();
    }

    stopStepMove() {
        console.log('타이머종료');
        clearTimeout(this.timer);
    }
}
