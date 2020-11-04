import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentCustomerEventComponent } from './rent-customer-event.component';

describe('RentCustomerEventComponent', () => {
  let component: RentCustomerEventComponent;
  let fixture: ComponentFixture<RentCustomerEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentCustomerEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentCustomerEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
