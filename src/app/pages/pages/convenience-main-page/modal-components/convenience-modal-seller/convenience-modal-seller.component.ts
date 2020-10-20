import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-convenience-modal-seller',
    templateUrl: './convenience-modal-seller.component.html',
    styleUrls: ['./convenience-modal-seller.component.scss']
})
export class ConvenienceModalSellerComponent implements OnInit {
    url: any;

    constructor(
        public bsModalRef: BsModalRef,
    ) { }

    ngOnInit(

    ) {
    }
    modalClose() {
        this.bsModalRef.hide();
    }
    goToSite() {

        window.open(this.url);
        console.log(this.url, 'url');
    }
}
