import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';

import { environment } from '@/environments/environment';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends BaseChildComponent implements OnInit {
    public viewModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
    ) {
        super(platformId);

        this.initialize();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    private initialize() {
        this.viewModel = {
            ybUrl: environment.ybUrl
        };
    }
}
