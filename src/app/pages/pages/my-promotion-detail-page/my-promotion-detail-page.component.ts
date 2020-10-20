import { Component, OnInit } from '@angular/core';
import { PageCodes } from '../../common-source/enums/page-codes.enum';

@Component({
    selector: 'app-my-promotion-detail-page',
    templateUrl: './my-promotion-detail-page.component.html',
    styleUrls: ['./my-promotion-detail-page.component.scss']
})
export class MyPromotionDetailPageComponent implements OnInit {

    headerConfig: any;
    tabNo: any = 0;
    constructor() { }

    ngOnInit() {
    }
    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_MY
        };
    }

}
