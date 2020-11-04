import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitySearchResultOptionPageComponent } from './activity-search-result-option-page.component';

describe('ActivitySearchResultOptionPageComponent', () => {
    let component: ActivitySearchResultOptionPageComponent;
    let fixture: ComponentFixture<ActivitySearchResultOptionPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ActivitySearchResultOptionPageComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivitySearchResultOptionPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
