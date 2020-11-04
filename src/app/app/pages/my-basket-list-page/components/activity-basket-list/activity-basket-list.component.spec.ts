import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBasketListComponent } from './activity-basket-list.component';

describe('ActivityBasketListComponent', () => {
    let component: ActivityBasketListComponent;
    let fixture: ComponentFixture<ActivityBasketListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ActivityBasketListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivityBasketListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
