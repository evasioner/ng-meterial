import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelModalAgreementComponent } from './hotel-modal-agreement.component';

describe('HotelModalAgreementComponent', () => {
  let component: HotelModalAgreementComponent;
  let fixture: ComponentFixture<HotelModalAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelModalAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelModalAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
