import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelModalPaymentDetailComponent } from './airtel-modal-payment-detail.component';

describe('AirtelModalPaymentDetailComponent', () => {
  let component: AirtelModalPaymentDetailComponent;
  let fixture: ComponentFixture<AirtelModalPaymentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelModalPaymentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelModalPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
