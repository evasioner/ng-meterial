import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-my-modal-main',
    templateUrl: './my-modal-main.component.html',
    styleUrls: ['./my-modal-main.component.scss']
})
export class MyModalMainComponent implements OnInit, OnDestroy {
    isLogin: boolean = true;

    constructor() {
    }

    ngOnInit(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
    }

    ngOnDestroy() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }
}
