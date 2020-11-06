import { Component, HostListener, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonLayoutSideMenuService } from '../../services/common-layout-side-menu/common-layout-side-menu.service';

import { environment } from '@/environments/environment';

import { HeaderTypes } from '../../enums/header-types.enum';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-main-header',
    templateUrl: './main-header.component.html',
    styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent extends BaseChildComponent implements OnInit {
    @Input() headerType: HeaderTypes;
    @Input() headerConfig: any = null;

    public classFixed: boolean = false;
    public viewModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private router: Router,
        private route: ActivatedRoute,
        private commonLayoutSideMenuService: CommonLayoutSideMenuService,
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

    /**
     * onMainClick
     * 메인 메뉴로 이동
     *
     * @param event 돔 이벤트
     */
    public onMainClick(event: any): void {
        event && event.preventDefault();

        this.router.navigate(['/main'], { relativeTo: this.route });
    }

    /**
     * onMenuClick
     * 메뉴 표시
     *
     * @param event 돔 이벤트
     */
    public onMenuClick(event: any): void {
        event && event.preventDefault();

        this.commonLayoutSideMenuService.setOpen();
    }
}
