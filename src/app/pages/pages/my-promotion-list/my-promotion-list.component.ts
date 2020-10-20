import { Component, OnInit } from '@angular/core';
import { PageCodes } from '../../common-source/enums/page-codes.enum';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-my-promotion-list',
    templateUrl: './my-promotion-list.component.html',
    styleUrls: ['./my-promotion-list.component.scss']
})
export class MyPromotionListComponent implements OnInit {
    headerConfig: any;
    tabNo: any = 0;
    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
    }
    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_MY
        };
    }
    selectTab(no) {
        this.tabNo = no;
    }
    detailClick() {
        const path = '/my-promotion-detail';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
}
