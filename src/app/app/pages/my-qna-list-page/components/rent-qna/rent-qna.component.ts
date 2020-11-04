import { Component, OnInit, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MyModalQnaViewComponent } from '../../modal-components/my-modal-qna-view/my-modal-qna-view.component';

@Component({
    selector: 'app-rent-qna',
    templateUrl: './rent-qna.component.html',
    styleUrls: ['./rent-qna.component.scss']
})
export class RentQnaComponent implements OnInit {

    @Input() public resolveData: any;
    public loadingBool: Boolean = false;
    public result: any;
    public cateResult: any[] = [];
    public pagePath: any;
    totalCount = 0;
    totalListCount = 0;
    public checkBoxValue: boolean = true;
    limitStart = 0;
    limitEnd = 10;
    pageCount = 10;
    bsModalRef: BsModalRef;
    public infiniteScrollConfig: any = {
        distance: 0,
        throttle: 300
    };

    constructor(
        public bsModalService: BsModalService,
    ) { }

    ngOnInit(): void {
    }

    detailView(qnaId) {
        const initialState = {
            list: [
                'Open a modal with component',
                'Pass your data',
                'Do something else',
                '...'
            ],
            title: 'Modal with component'
        };
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalRef = this.bsModalService.show(MyModalQnaViewComponent, { initialState, ...configInfo });
    }
}
