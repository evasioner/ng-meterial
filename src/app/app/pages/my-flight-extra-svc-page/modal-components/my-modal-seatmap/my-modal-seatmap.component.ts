import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MyModalSeatmapResultComponent } from '../my-modal-seatmap-result/my-modal-seatmap-result.component';

@Component({
    selector: 'app-my-modal-seatmap',
    templateUrl: './my-modal-seatmap.component.html',
    styleUrls: ['./my-modal-seatmap.component.scss']
})
export class MyModalSeatmapComponent extends BaseChildComponent implements OnInit {
    element: any;
    $element: any;
    // bsModalRef: BsModalRef;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public translateService: TranslateService,
        public bsModalRef: BsModalRef,
        private bsModalService: BsModalService
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick() {
        this.modalClose();
    }

    onSeatmapResultClick() {
        console.info('[좌석선택결과]');
        this.modalClose();

        const storeId = 'seatmapResult';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(MyModalSeatmapResultComponent, { initialState, ...configInfo });

    }

}