import { Component, OnInit } from '@angular/core';
import { PageCodes } from '../../common-source/enums/page-codes.enum';

@Component({
    selector: 'app-airtel-main-page',
    templateUrl: './airtel-main-page.component.html',
    styleUrls: ['./airtel-main-page.component.scss']
})
export class AirtelMainPageComponent implements OnInit {
    headerConfig: any;
    constructor() { }

    ngOnInit() {
    }
    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_CONVENIENCE
        };
    }
}
