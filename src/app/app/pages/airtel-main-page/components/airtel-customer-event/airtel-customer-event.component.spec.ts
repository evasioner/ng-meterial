import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelCustomerEventComponent } from './airtel-customer-event.component';

describe('AirtelCustomerEventComponent', () => {
  let component: AirtelCustomerEventComponent;
  let fixture: ComponentFixture<AirtelCustomerEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelCustomerEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelCustomerEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
