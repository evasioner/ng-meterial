import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelModalPaymentComponent } from './airtel-modal-payment.component';

describe('AirtelModalPaymentComponent', () => {
  let component: AirtelModalPaymentComponent;
  let fixture: ComponentFixture<AirtelModalPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelModalPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelModalPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
