import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelModalChildrenInformationComponent } from './hotel-modal-children-information.component';

describe('HotelModalChildrenInformationComponent', () => {
    let component: HotelModalChildrenInformationComponent;
    let fixture: ComponentFixture<HotelModalChildrenInformationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HotelModalChildrenInformationComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HotelModalChildrenInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
