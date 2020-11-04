import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    isBrowser: boolean = false;
    isServer: boolean = false;
    rxAlive: boolean = true;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.isBrowser = true;
        }

        if (isPlatformServer(this.platformId)) {
            this.isServer = true;
        }

        if (this.isBrowser) {
            console.info('[app.component > ngOnInit > window]', window);
        }
    }

    ngOnDestroy() {
        this.rxAlive = false;
    }
}
